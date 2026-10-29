/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onCall,onRequest, HttpsError } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2";
import admin from "firebase-admin";
// Destructure FieldValue specifically for Admin v13
import { FieldValue } from "firebase-admin/firestore"; 
import crypto from "node:crypto";
import { defineSecret } from "firebase-functions/params";
import { Resend } from "resend";
import { onDocumentCreated } from "firebase-functions/v2/firestore";






// Initialize admin only if it hasn't been initialized already
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

setGlobalOptions({
  maxInstances: 5,
  memory: "256MiB", // Updated to MiB (standard for v2)
  region: "us-central1" // Recommended to specify your region explicitly
});

export const createContactSession = onCall({ cors: true }, async (req) => {
  const { workerId, customerName, customerPhone } = req.data;

  if (!workerId || !customerPhone) {
    throw new HttpsError("invalid-argument", "Të dhënat mungojnë.");
  }

  // --- FINGERPRINTING ---
  const ip = req.rawRequest.ip || "unknown";
  const userAgent = req.rawRequest.headers["user-agent"] || "unknown";
  
  // Combine IP and Browser info for a stronger fingerprint
  const fingerprint = crypto
    .createHash("sha256")
    .update(`${ip}-${userAgent}`)
    .digest("hex");

  // --- RATE LIMIT LOGIC (1 Read) ---
  const recentSnapshot = await db.collection("contactSessions")
    .where("fingerprint", "==", fingerprint)
    .orderBy("createdAt", "desc")
    .limit(1)
    .get();

  if (!recentSnapshot.empty) {
    const lastSession = recentSnapshot.docs[0].data();
    // In Cloud Functions, serverTimestamp hasn't resolved yet on the fresh doc, 
    // but here we are reading an existing one.
    const lastTime = lastSession.createdAt.toDate();
    const diffInSeconds = (Date.now() - lastTime.getTime()) / 1000;

    if (diffInSeconds < 60) {
      throw new HttpsError(
        "resource-exhausted", 
        "Sistemi mbrojtës: Ju lutem prisni një minutë para kërkesës tjetër."
      );
    }
  }

  // --- DATA ATOMICITY (1 Write + 1 Update) ---
  const sessionData = {
    workerId,
    customerName: customerName || "Klient i paemërt",
    customerPhone,
    createdAt: FieldValue.serverTimestamp(),
    fingerprint, // Store the hash
    usedForReview: false,
    status: "open"
  };

  const sessionRef = await db.collection("contactSessions").add(sessionData);

  // Increment total project contact count & individual worker count
  const batch = db.batch();
  batch.update(db.collection("workers").doc(workerId), {
    whatsappRequests: FieldValue.increment(1)
  });
  batch.update(db.collection("metadata").doc("globalStats"), {
    contactCount: FieldValue.increment(1)
  });
  
  await batch.commit();

  return { sessionId: sessionRef.id };
});






export const createReviewRequest = onCall({ cors: true }, async (req) => {
  const uid = req.auth?.uid;
  const { sessionId } = req.data;

  // 1. Auth Guard
  if (!uid) {
    throw new HttpsError("unauthenticated", "Ju duhet të jeni i kyçur.");
  }

  // 2. Capture Worker's current Fingerprint (The Trap)
  const ip = req.rawRequest.ip || "unknown";
  const ua = req.rawRequest.headers["user-agent"] || "unknown";
  const currentFingerprint = crypto
    .createHash("sha256")
    .update(`${ip}-${ua}`)
    .digest("hex");

  // 3. Fetch Worker Data (The "Source of Truth")
  const workerRef = db.collection("workers").doc(uid);
  const workerSnap = await workerRef.get();
  
  if (!workerSnap.exists) {
    throw new HttpsError("not-found", "Mjeshtri nuk u gjet.");
  }
  const workerData = workerSnap.data();

  // 4. Fetch Session
  const sessionRef = db.collection("contactSessions").doc(sessionId);
  const sessionSnap = await sessionRef.get();

  if (!sessionSnap.exists) {
    throw new HttpsError("not-found", "Ky kontakt nuk ekziston.");
  }
 
  const session = sessionSnap.data();
    
  // 5. Ownership Guard
  if (session.workerId !== uid) {
    throw new HttpsError("permission-denied", "Ky kontakt nuk ju përket juve.");
  }

  // 6. Expiration Check (7 days)
  const createdAt = session.createdAt?.toDate();
  const now = new Date();
  if (!createdAt || now - createdAt > 1000 * 60 * 60 * 24 * 7) {
    throw new HttpsError("failed-precondition", "Ky kontakt ka skaduar (mbi 7 ditë).");
  }

  // 7. Usage Check
  if (session.usedForReview) {
    throw new HttpsError("already-exists", "Ky kontakt është përdorur njëherë.");
  }

  const token = crypto.randomBytes(8).toString("hex");

  // 8. Transaction for Atomic Updates
  await db.runTransaction(async (transaction) => {
    // A. Mark session as used
    transaction.update(sessionRef, { usedForReview: true });

    // B. Update Worker's Last Fingerprint (Piggyback update)
    transaction.update(workerRef, { 
      lastFingerprint: currentFingerprint 
    });

    // C. Create the Review Request Token
    transaction.set(db.collection("reviewRequests").doc(token), {
      workerId: uid,
      workerName: workerData.fullName || "Mjeshtër",
      workerPic: workerData.profilePic || "",
      sessionId,
      customerPhone: session.customerPhone,
      customerName: session.customerName || "Klient",
      // We store the session's creator fingerprint to verify 
      // if the reviewer is actually the same person who clicked the button
      sessionFingerprint: session.fingerprint || null, 
      status: "pending",
      createdAt: FieldValue.serverTimestamp(),
    });
  });

  return {
    reviewUrl: `https://gjejnjerin.com/review/${token}`,
  };
});



// export const generateReviewRequest = onCall(async (request) => {
//   if (!request.auth) {
//     throw new HttpsError("unauthenticated", "Ju duhet të jeni i kyçur.");
//   }

//   const { customerPhone } = request.data;
//   const workerId = request.auth.uid;

//   if (!customerPhone) {
//     throw new HttpsError("invalid-argument", "Numri i telefonit mungon.");
//   }

//   try {
//     const workerSnap = await db.collection("workers").doc(workerId).get();
//     if (!workerSnap.exists) {
//       throw new HttpsError("not-found", "Mjeshtri nuk u gjet.");
//     }
    
//     const workerData = workerSnap.data();
//     const token = crypto.randomBytes(16).toString("hex");

//     await db.collection("reviewRequests").doc(token).set({
//       workerId,
//       workerName: workerData.fullName || "Mjeshtër",
//       workerPic: workerData.profilePic || "",
//       customerPhone,
//       token,
//       status: "pending",
//       createdAt: FieldValue.serverTimestamp(), // This will now work
//     });

//     return { token };
//   } catch (err) {
//     console.error("Actual Server Error:", err); // Look at Firebase Console Logs for this!
//     throw new HttpsError("internal", err.message || "Ndodhi një gabim në server.");
//   }
// });


// export const sendWelcomeEmail = onDocumentCreated(
//   {
//     document: "workers/{workerId}",
//   },
//   async (event) => {
//     console.log("NEW WORKER CREATED!");
//   }
// );

const resendApiKey = defineSecret("RESEND_API_KEY");
const resendWebhookSecret = defineSecret("RESEND_WEBHOOK_SECRET");


export const sendWelcomeEmail = onDocumentCreated(
  {
    document: "workers/{workerId}",
    secrets: [resendApiKey],
  },
  async (event) => {
    const worker = event.data?.data();

    console.log("NEW WORKER CREATED");

    if (!worker) {
      console.log("Worker document does not exist.");
      return;
    }

    const email = worker.email;
    const name = worker.fullName;

    if (!email) {
      console.log("Worker has no email.");
      return;
    }

    try {
      const firebaseLink =
        await admin.auth().generateEmailVerificationLink(email);

      const generatedUrl = new URL(firebaseLink);
      const oobCode = generatedUrl.searchParams.get("oobCode");
      const mode = generatedUrl.searchParams.get("mode");

      if (!oobCode || mode !== "verifyEmail") {
        throw new Error("Unexpected Firebase verification link.");
      }

      // Redirect the user to your custom verification page.
      const verificationUrl = new URL(
        "https://gjejnjerin.com/email/confirm"
      );

      verificationUrl.searchParams.set("mode", "verifyEmail");
      verificationUrl.searchParams.set("oobCode", oobCode);

      const resend = new Resend(resendApiKey.value());

      const { data, error } = await resend.emails.send({
        from: "Gjejnjerin <hello@gjejnjerin.com>",
        to: [email],
        subject: "Mirë se erdhe në Gjejnjerin! 👋",

        html: `
          <div style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 30px;
            color: #222;
          ">

            <h1 style="margin-bottom: 10px;">
              Mirë se erdhe, ${name}! 👋
            </h1>

            <p style="font-size: 16px; line-height: 1.6;">
              Llogaria jote në <strong>Gjejnjerin</strong>
              u krijua me sukses.
            </p>

            <p style="font-size: 16px; line-height: 1.6;">
              Para se të vazhdosh, verifiko adresën tënde
              të email-it duke klikuar butonin më poshtë.
            </p>

            <a
              href="${verificationUrl.href}"
              style="
                display: inline-block;
                margin-top: 15px;
                padding: 13px 22px;
                background: #004cff;
                color: #fff;
                text-decoration: none;
                border-radius: 8px;
                font-weight: bold;
              "
            >
              Verifiko email-in
            </a>

            <p style="
              margin-top: 12px;
              color: #777;
              font-size: 13px;
              line-height: 1.5;
            ">
              Nëse nuk e ke krijuar ti këtë llogari,
              mund ta injorosh këtë email.
            </p>

            <hr style="
              border: none;
              border-top: 1px solid #eee;
              margin: 25px 0;
            " />

            <p style="font-size: 16px; line-height: 1.6;">
              Pasi të verifikosh email-in, mund të plotësosh
              profilin, të shtosh punët në portofol dhe të
              fillosh të lidhesh me klientë.
            </p>

            <a
              href="https://gjejnjerin.com"
              style="
                display: inline-block;
                margin-top: 10px;
                padding: 12px 20px;
                background: #000;
                color: #fff;
                text-decoration: none;
                border-radius: 8px;
              "
            >
              Hape Gjejnjerin
            </a>

            <p style="
              margin-top: 30px;
              color: #777;
              font-size: 14px;
            ">
              Faleminderit që u bëre pjesë e Gjejnjerin. ❤️
            </p>

          </div>
        `,
      });

      if (error) {
        console.error("Welcome email error:", error.message);
        return;
      }

      console.log("Welcome email sent:", data?.id);

    } catch (error) {
      console.error(
        "Welcome email error:",
        error?.code || error?.message || "Unknown error"
      );
    }
  }
);


// export const sendVerificationEmail = onCall(
//   {
//     secrets: [resendApiKey],
//     cors: true
//   },
//   async (request) => {
//     // Only a signed-in user can request verification for their account.
//     if (!request.auth) {
//       throw new HttpsError(
//         "unauthenticated",
//         "You must be signed in to request email verification."
//       );
//     }

//     try {
//       // Get the account from Firebase Auth using the verified caller's UID.
//       const user = await admin.auth().getUser(request.auth.uid);

//       if (!user.email) {
//         throw new HttpsError(
//           "failed-precondition",
//           "This account does not have an email address."
//         );
//       }

//       if (user.emailVerified) {
//         return {
//           success: true,
//           message: "Your email address is already verified.",
//         };
//       }

//       // Generate a genuine Firebase email-verification link.
//       const firebaseLink =
//         await admin.auth().generateEmailVerificationLink(user.email);

//       // Extract Firebase's one-time action code from the generated URL.
//       const generatedUrl = new URL(firebaseLink);
//       const oobCode = generatedUrl.searchParams.get("oobCode");
//       const mode = generatedUrl.searchParams.get("mode");

//       if (!oobCode || mode !== "verifyEmail") {
//         throw new Error(
//           "Firebase generated an unexpected verification link."
//         );
//       }

//       // Build our own branded website URL.
//       const customUrl = new URL(
//         "https://gjejnjerin.com/email/confirm"
//       );

//       customUrl.searchParams.set("mode", "verifyEmail");
//       customUrl.searchParams.set("oobCode", oobCode);

//       const resend = new Resend(resendApiKey.value());

//       // Send the custom-branded email through Resend.
//       const { data, error } = await resend.emails.send({
//         from: "Gjejnjerin <hello@gjejnjerin.com>",
//         to: [user.email],
//         subject: "Verifiko email-in tënd — Gjejnjerin",
//         html: `
//           <!DOCTYPE html>
//           <html lang="sq">
//             <body style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,sans-serif;color:#222">
//               <div style="max-width:560px;margin:32px auto;padding:32px;background:#ffffff;border-radius:14px">
//                 <h1 style="color:#004cff;margin-top:0">Mirë se vjen në Gjejnjerin!</h1>

//                 <p style="font-size:16px;line-height:1.6">
//                   Për të përfunduar regjistrimin, konfirmo adresën tënde të email-it.
//                 </p>

//                 <p style="margin:28px 0">
//                   <a
//                     href="${customUrl.href}"
//                     style="display:inline-block;padding:14px 22px;background:#004cff;color:#ffffff;text-decoration:none;border-radius:8px;font-weight:bold"
//                   >
//                     Verifiko email-in
//                   </a>
//                 </p>

//                 <p style="font-size:14px;line-height:1.6;color:#666">
//                   Nëse nuk je regjistruar në Gjejnjerin, mund ta shpërfillësh këtë email.
//                 </p>

//                 <p style="font-size:12px;color:#888;margin-bottom:0">
//                   Gjejnjerin.com
//                 </p>
//               </div>
//             </body>
//           </html>
//         `,
//       });

//       if (error) {
//         console.error(
//           "Verification email delivery failed:",
//           error.message
//         );

//         throw new HttpsError(
//           "internal",
//           "Could not send the verification email."
//         );
//       }

//       console.log("Verification email sent:", data?.id);

//       return {
//         success: true,
//         message: "Verification email sent. Please check your inbox.",
//       };
//     } catch (error) {
//       // Preserve intentional callable errors.
//       if (error instanceof HttpsError) {
//         throw error;
//       }

//       // Do not log the action code or the complete verification URL.
//       console.error(
//         "Verification email request failed:",
//         error?.code || error?.message || "Unknown error"
//       );

//       throw new HttpsError(
//         "internal",
//         "Could not send the verification email. Please try again later."
//       );
//     }
//   }
// );


export const syncWorkerEmailAfterChange = onCall(
  async (request) => {
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "You must be signed in."
      );
    }

    try {
      // Always use the authenticated user's UID.
      const uid = request.auth.uid;

      // Read the email directly from Firebase Authentication.
      const user = await admin.auth().getUser(uid);

      if (!user.email || !user.emailVerified) {
        throw new HttpsError(
          "failed-precondition",
          "The account email has not been verified."
        );
      }

      const workerRef = db.collection("workers").doc(uid);
      const workerDoc = await workerRef.get();

      // This account may not have a worker profile.
      if (!workerDoc.exists) {
        throw new HttpsError(
          "not-found",
          "Worker profile not found."
        );
      }

      // Synchronize Firestore with the trusted Auth email.
      await workerRef.update({
        email: user.email,
      });

      return {
        success: true,
        message: "Worker email synchronized successfully.",
      };
    } catch (error) {
      if (error instanceof HttpsError) {
        throw error;
      }

      console.error(
        "Worker email synchronization failed:",
        error?.code || error?.message || "Unknown error"
      );

      throw new HttpsError(
        "internal",
        "Could not synchronize the worker email."
      );
    }
  }
);


export const requestEmailChange = onCall(
  {
    cors: true,
    secrets: [resendApiKey],
  },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "Duhet të jesh i kyçur."
      );
    }

    const newEmail =
      typeof request.data?.newEmail === "string"
        ? request.data.newEmail.trim().toLowerCase()
        : "";

    if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      throw new HttpsError(
        "invalid-argument",
        "Shkruaj një email të vlefshëm."
      );
    }

    // Require recent authentication before changing account details.
    const authTime = Number(request.auth.token.auth_time);

    if (
      !authTime ||
      Date.now() / 1000 - authTime > 5 * 60
    ) {
      throw new HttpsError(
        "failed-precondition",
        "Rikyçu dhe provo përsëri."
      );
    }

    try {
      const user = await admin.auth().getUser(request.auth.uid);
      const currentEmail = user.email;

      if (!currentEmail) {
        throw new HttpsError(
          "failed-precondition",
          "Llogaria nuk ka një email aktual."
        );
      }

      if (currentEmail.toLowerCase() === newEmail) {
        throw new HttpsError(
          "invalid-argument",
          "Ky është tashmë email-i yt."
        );
      }

      // Firebase generates the action code for changing the email.
      const firebaseLink =
        await admin.auth().generateVerifyAndChangeEmailLink(
          currentEmail,
          newEmail
        );

      const generatedUrl = new URL(firebaseLink);
      const oobCode = generatedUrl.searchParams.get("oobCode");

      if (!oobCode) {
        throw new Error("Firebase did not return an action code.");
      }

      const customUrl = new URL(
        "https://gjejnjerin.com/email/change"
      );

      customUrl.searchParams.set(
        "mode",
        "verifyAndChangeEmail"
      );
      customUrl.searchParams.set("oobCode", oobCode);

      const resend = new Resend(resendApiKey.value());

      const { data, error } = await resend.emails.send({
        from: "Gjejnjerin <hello@gjejnjerin.com>",
        to: [newEmail],
        subject: "Konfirmo email-in e ri — Gjejnjerin",
        html: `
          <div style="
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 30px;
            color: #222;
          ">
            <h1>Konfirmo email-in e ri</h1>

            <p style="font-size:16px;line-height:1.6">
              Ke kërkuar ta ndryshosh email-in e llogarisë
              tënde në Gjejnjerin në
              <strong>${newEmail.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")}</strong>.
            </p>

            <p style="font-size:16px;line-height:1.6">
              Kliko butonin më poshtë për ta konfirmuar
              ndryshimin. Email-i i llogarisë do të ndryshohet
              vetëm pasi ta konfirmosh.
            </p>

            <a
              href="${customUrl.href}"
              style="
                display:inline-block;
                margin-top:15px;
                padding:13px 22px;
                background:#004cff;
                color:#fff;
                text-decoration:none;
                border-radius:8px;
                font-weight:bold;
              "
            >
              Konfirmo email-in e ri
            </a>

            <p style="
              margin-top:25px;
              color:#777;
              font-size:13px;
              line-height:1.6;
            ">
              Nëse nuk e ke kërkuar këtë ndryshim,
              mos e kliko lidhjen.
            </p>
          </div>
        `,
      });

      if (error) {
        console.error("Email change delivery failed:", error.message);
        throw new HttpsError(
          "internal",
          "Email-i i konfirmimit nuk mund të dërgohej."
        );
      }

      console.log("Email change confirmation sent:", data?.id);

      return {
        success: true,
        message:
          "Email-i i konfirmimit u dërgua në adresën e re.",
      };
    } catch (error) {
      if (error instanceof HttpsError) {
        throw error;
      }

      console.error(
        "Email change request failed:",
        error?.code || error?.message || "Unknown error"
      );

      if (
        error?.code === "auth/email-already-exists" ||
        error?.code === "auth/invalid-email"
      ) {
        throw new HttpsError(
          "already-exists",
          "Ky email nuk mund të përdoret. Kontrolloje ose provo një tjetër."
        );
      }

      throw new HttpsError(
        "internal",
        "Ndryshimi i email-it dështoi. Provo përsëri më vonë."
      );
    }
  }
);


export const requestPasswordReset = onCall(
  {
    cors: true,
    secrets: [resendApiKey],
  },
  async (request) => {
    const email =
      typeof request.data?.email === "string"
        ? request.data.email.trim()
        : "";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new HttpsError(
        "invalid-argument",
        "Ju lutem shkruani një email të vlefshëm."
      );
    }

    try {
      // 1. Ask Firebase Admin to generate a genuine reset link.
      const firebaseLink =
        await admin.auth().generatePasswordResetLink(email);

      // 2. Extract the real Firebase action code.
      const generatedUrl = new URL(firebaseLink);
      const oobCode = generatedUrl.searchParams.get("oobCode");
      const apiKey = generatedUrl.searchParams.get("apiKey");
      const mode = generatedUrl.searchParams.get("mode");

      if (!oobCode || mode !== "resetPassword") {
        throw new Error(
          "Firebase generated a link with unexpected parameters."
        );
      }

      // 3. Build the link to YOUR website.
      const customUrl = new URL(
        "https://gjejnjerin.com/email/reset"
      );

      customUrl.searchParams.set("mode", "resetPassword");
      customUrl.searchParams.set("oobCode", oobCode);

      if (apiKey) {
        customUrl.searchParams.set("apiKey", apiKey);
      }

      // 4. Send the branded email using Resend.
      const resend = new Resend(resendApiKey.value());

      const { data, error } = await resend.emails.send({
        from: "Gjejnjerin <hello@gjejnjerin.com>",
        to: [email],
        subject: "Rivendos fjalëkalimin — Gjejnjerin",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px;color:#222">
            <h1 style="color:#004cff">Rivendos fjalëkalimin</h1>

            <p>
              Kërkuat të rivendosni fjalëkalimin e llogarisë
              suaj në Gjejnjerin.
            </p>

            <p>
              Klikoni butonin më poshtë për të zgjedhur
              një fjalëkalim të ri.
            </p>

            <a
              href="${customUrl.href}"
              style="display:inline-block;padding:13px 22px;background:#004cff;color:#fff;text-decoration:none;border-radius:8px;font-weight:bold"
            >
              Rivendos fjalëkalimin
            </a>

            <p style="margin-top:24px;color:#666;font-size:14px">
              Nëse nuk e keni kërkuar këtë ndryshim,
              mund ta shpërfillni këtë email.
            </p>

            <p style="color:#888;font-size:12px">
              Gjejnjerin.com
            </p>
          </div>
        `,
      });

      if (error) {
        console.error("Password reset email send failed:", error);
        throw new Error("Email delivery failed.");
      }

      console.log("Password reset email sent:", data?.id);
    } catch (error) {
      // Do not expose whether an account exists.
      // Avoid logging the generated link or its action code.
      console.error(
        "Password reset request failed:",
        error?.code || error?.message || "Unknown error"
      );
    }

    // Same response whether the account exists or not.
    return {
      success: true,
      message:
        "Nëse ky email është i regjistruar, do të merrni një link për rivendosjen e fjalëkalimit.",
    };
  }
);


export const resendInboundWebhook = onRequest(
  {
    secrets: [resendApiKey, resendWebhookSecret],
  },
  async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).send("Method not allowed");
    }

    try {
      const payload = req.rawBody.toString();

      // Extracted safely as standard JS strings
      const id = String(req.headers["svix-id"] || "");
      const timestamp = String(req.headers["svix-timestamp"] || "");
      const signature = String(req.headers["svix-signature"] || "");

      if (!id || !timestamp || !signature) {
        console.warn("Missing Resend webhook headers");
        return res.status(400).send("Missing webhook headers");
      }

      const resend = new Resend(resendApiKey.value());

      // 1. Verify Webhook Event Signature
      const event = resend.webhooks.verify({
        payload,
        headers: {
          id,
          timestamp,
          signature,
        },
        webhookSecret: resendWebhookSecret.value(),
      });

      if (event.type !== "email.received") {
        return res.status(200).send("Ignored non-email event");
      }

      const emailId = event.data.email_id;

      // 2. Retrieve Email Content
      const { data: emailData, error: receivingError } = await resend.emails.receiving.get(emailId);

      if (receivingError || !emailData) {
        console.error("Resend receiving error details:", receivingError);
        return res.status(500).send(`Failed to retrieve email content: ${receivingError?.message || "No data"}`);
      }

      // 3. Forward Email
      const { error: sendError } = await resend.emails.send({
        from: "hello@gjejnjerin.com",
        to: "liscitaku@gmail.com",
        subject: `[FWD] ${emailData.subject || "No Subject"}`,
        html: emailData.html || `<p>${emailData.text || "Empty message"}</p>`,
        text: emailData.text || "",
        replyTo: emailData.from,
      });

      if (sendError) {
        console.error("Resend forwarding error:", sendError);
        return res.status(500).send("Forwarding failed");
      }

      return res.status(200).send("OK");
    } catch (err) {
      console.error("Webhook unexpected failure:", err);
      return res.status(500).json({
        error: "Webhook failed",
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }
);

export const submitReview = onCall({ cors: true }, async (request) => {
  const { token, rating, comment, customerName, inputPhone } = request.data;

  if (!token || !rating || rating < 1 || rating > 5) {
    throw new HttpsError("invalid-argument", "Të dhëna të gabuara.");
  }

  // 1. Generate Fingerprint for the person SUBMITTING the review
  const ip = request.rawRequest.ip || "unknown";
  const userAgent = request.rawRequest.headers["user-agent"] || "unknown";
  const reviewerFingerprint = crypto
    .createHash("sha256")
    .update(`${ip}-${userAgent}`)
    .digest("hex");

  const reviewReqRef = db.collection("reviewRequests").doc(token);

  return await db.runTransaction(async (transaction) => {
    const snap = await transaction.get(reviewReqRef);

    if (!snap.exists || snap.data().status !== "pending") {
      throw new HttpsError("failed-precondition", "Ky link është përdorur ose nuk ekziston.");
    }

    const reviewReqData = snap.data();
    
    // 2. Validate Phone Number (Security Layer 1)
    if (reviewReqData.customerPhone !== inputPhone) {
      throw new HttpsError("permission-denied", "Numri i telefonit nuk përputhet.");
    }

    const workerId = reviewReqData.workerId;
    const workerRef = db.collection("workers").doc(workerId);
    const workerSnap = await transaction.get(workerRef);

    if (!workerSnap.exists) {
      throw new HttpsError("not-found", "Mjeshtri nuk ekziston.");
    }

    const workerData = workerSnap.data();

    // 3. SELF-REVIEW CHECK (Security Layer 2)
    if (workerData.lastFingerprint && workerData.lastFingerprint === reviewerFingerprint) {
      throw new HttpsError("permission-denied", "Nuk mund të lini rishikim për veten tuaj.");
    }

    // 4. CROSS-DEVICE DETECTION (Security Layer 3 - Informational)
    let isDifferentDevice = false;
    if (reviewReqData.sessionFingerprint && reviewReqData.sessionFingerprint !== reviewerFingerprint) {
      isDifferentDevice = true; // Reviewer isn't using the same device that contacted the worker
    }

    const workerName = workerData.fullName || "Mjeshtër pa emër";
    const customerPhone = reviewReqData.customerPhone;

    // 5. Update Review Request status
    transaction.update(reviewReqRef, {
      status: "used",
      usedAt: FieldValue.serverTimestamp(),
      reviewerFingerprint: reviewerFingerprint 
    });

    // 6. Create the Review
    const newReviewRef = db.collection("reviews").doc();
    transaction.set(newReviewRef, {
      workerId,
      workerName: workerName,
      searchName: workerName.trim().toLowerCase(),
      rating,
      customerPhone: customerPhone,
      status: "pending", 
      isVerified: false,
      comment: comment || "",
      customerName: customerName || "Klient i Verifikuar",
      reviewerFingerprint: reviewerFingerprint,
      isDifferentDevice, // Flag for the Admin panel
      createdAt: FieldValue.serverTimestamp(),
    });

    return { success: true };
  });
});


export const approveReview = onCall({ cors: true }, async (request) => {
  // Check if caller is Admin
  const ADMIN_UID = "mUc8sPZ3IURtFT3As8y0YN9Bsil2";
  if (!request.auth || request.auth.uid !== ADMIN_UID) {
    throw new HttpsError("permission-denied", "Vetëm admini mund të miratojë.");
  }

  const { reviewId } = request.data;
  if (!reviewId) throw new HttpsError("invalid-argument", "Review ID mungon.");

  const reviewRef = db.collection("reviews").doc(reviewId);

  return await db.runTransaction(async (transaction) => {
    const reviewSnap = await transaction.get(reviewRef);
    if (!reviewSnap.exists) throw new Error("Rishikimi nuk u gjet.");
    
    const reviewData = reviewSnap.data();
    if (reviewData.status === "approved") throw new Error("Ky rishikim është miratuar më parë.");

    const workerId = reviewData.workerId;
    const workerRef = db.collection("workers").doc(workerId);
    const workerSnap = await transaction.get(workerRef);

    if (!workerSnap.exists) throw new Error("Mjeshtri nuk ekziston.");

    // MATH TIME: Update the worker's score now
    const rating = reviewData.rating;
    const currentPoints = workerSnap.data().totalRatingPoints || 0;
    const currentCount = workerSnap.data().reviewCount || 0;

    const newCount = currentCount + 1;
    const newPoints = currentPoints + rating;
    const newAvg = Math.round((newPoints / newCount) * 10) / 10;

    // 1. Mark review as approved
    transaction.update(reviewRef, {
      status: "approved",
      isVerified: true,
      adminNote: request.data.note || "",
      approvedAt: FieldValue.serverTimestamp(),
    });

    // 2. Update worker stats
    transaction.update(workerRef, {
      reviewCount: newCount,
      totalRatingPoints: newPoints,
      avgRating: newAvg,
    });

    // 3. Update global stats (optional: track total verified reviews)
    const statsRef = db.collection("metadata").doc("globalStats");
    transaction.update(statsRef, {
      totalReviews: FieldValue.increment(1)
    });

    return { success: true };
  });
});

// Add { cors: true } or your specific domain to the first argument
export const handleGetPro = onCall({ cors: true }, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Ju duhet të jeni i kyçur.");
  }

  const uid = request.auth.uid;

  try {
    const workerRef = db.collection("workers").doc(uid);
    const statsRef = db.collection("metadata").doc("globalStats");

    // We use a Transaction to ensure both updates happen or neither happens
    // This prevents the count from increasing if the worker update fails
    await db.runTransaction(async (transaction) => {
      const workerDoc = await transaction.get(workerRef);
      
      if (!workerDoc.exists) {
        throw new Error("Mjeshtri nuk u gjet.");
      }

      // Check if already Pro to avoid double-counting
      if (workerDoc.data().isPro === true) {
        return; 
      }

      transaction.update(workerRef, {
        isPro: true,
        showProStar: true,
        isFeatured: true,
        proSubscribedAt: FieldValue.serverTimestamp(),
      });

      transaction.update(statsRef, {
        proCount: FieldValue.increment(1) // Admin SDK uses FieldValue.increment
      });
    });

    return { success: true };
  } catch (err) {
    console.error("Error activating Pro:", err);
    throw new HttpsError("internal", err.message || "Dështoi aktivizimi i PRO.");
  }
});

