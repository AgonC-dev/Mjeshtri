/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onCall, HttpsError } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2";
import admin from "firebase-admin";
// Destructure FieldValue specifically for Admin v13
import { FieldValue } from "firebase-admin/firestore"; 
import crypto from "node:crypto";



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

  if (!workerId && !customerPhone) {
    throw new HttpsError("invalid-argument", "workerId mungon.");
  }



  const ip = req.rawRequest.ip || "unknown";
  const ua = req.rawRequest.headers["user-agent"] || "unknown";

  const ipHash = crypto.createHash("sha256").update(ip).digest("hex");
  const uaHash = crypto.createHash("sha256").update(ua).digest("hex");


  const sessionRef = await db.collection("contactSessions").add({
    workerId,
    customerName: customerName || "Klient i paemërt",
    customerPhone, // This
    createdAt: FieldValue.serverTimestamp(),
    ipHash,
    uaHash,
    usedForReview: false,
  })

  return { sessionId: sessionRef.id };
});



export const createReviewRequest = onCall({ cors: true }, async (req) => {
  const uid = req.auth?.uid;
  const { sessionId } = req.data;

  // 1. Auth Guard
  if (!uid) {
    throw new HttpsError("unauthenticated", "Ju duhet të jeni i kyçur.");
  }

  // 2. Fetch Worker Data (The "Source of Truth")
  const workerSnap = await db.collection("workers").doc(uid).get();
  if (!workerSnap.exists) {
    throw new HttpsError("not-found", "Mjeshtri nuk u gjet.");
  }
  const workerData = workerSnap.data();

  // 3. Fetch Session
  const sessionRef = db.collection("contactSessions").doc(sessionId);
  const sessionSnap = await sessionRef.get();

  if (!sessionSnap.exists) {
    throw new HttpsError("not-found", "Ky kontakt nuk ekziston.");
  }
 
  const session = sessionSnap.data();
    
  // 4. Ownership Guard
  if (session.workerId !== uid) {
    throw new HttpsError("permission-denied", "Ky kontakt nuk ju përket juve.");
  }

  // 5. Expiration Check (7 days)
  const createdAt = session.createdAt?.toDate();
  const now = new Date();
  if (!createdAt || now - createdAt > 1000 * 60 * 60 * 24 * 7) {
    throw new HttpsError("failed-precondition", "Ky kontakt ka skaduar (mbi 7 ditë).");
  }

  // 6. Usage Check
  if (session.usedForReview) {
    throw new HttpsError("already-exists", "Ky kontakt është përdorur njëherë.");
  }

  const token = crypto.randomBytes(8).toString("hex");

  // 7. Transaction for Atomic Updates
  await db.runTransaction(async (transaction) => {
    transaction.update(sessionRef, { usedForReview: true });

    transaction.set(db.collection("reviewRequests").doc(token), {
      workerId: uid,
      workerName: workerData.fullName || "Mjeshtër",
      workerPic: workerData.profilePic || "", // Changed 'workerProfile' to 'workerPic' to match your ReviewPage
      sessionId,
      customerPhone: session.customerPhone,
      customerName: session.customerName || "Klient",
      status: "pending",
      createdAt: FieldValue.serverTimestamp(),
    });
  });

  return {
    reviewUrl: `https://mjeshtri-blue.vercel.app/review/${token}`,
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


export const submitReview = onCall({ cors: true }, async (request) => {
const { token, rating, comment, customerName, inputPhone} = request.data;

if(!token || !rating || rating < 1 || rating > 5) {
  throw new HttpsError("invalid-argument", "Të dhëna të gabuara.");
}

const reviewReqRef = db.collection("reviewRequests").doc(token);

return await db.runTransaction(async ( transaction ) => {
  const snap = await transaction.get(reviewReqRef);

  if(!snap.exists || snap.data().status !== "pending") {
    throw new HttpsError("failed-precondition", "Ky link është përdorur ose nuk ekziston.");
  }

  const reviewData = snap.data()
  if (reviewData.customerPhone !== inputPhone) {
      throw new HttpsError("permission-denied", "Numri i telefonit nuk përputhet me këtë kërkesë.");
  }


  const workerId = snap.data().workerId;
  const workerRef = db.collection("workers").doc(workerId);
  const workerSnap = await transaction.get(workerRef);

  if (!workerSnap.exists) {
      throw new HttpsError("not-found", "Mjeshtri nuk ekziston.");
  }


  const currentPoints = workerSnap.data().totalRatingPoints || 0;
  const currentCount = workerSnap.data().reviewCount || 0;

  const newCount = currentCount + 1;
  const newPoints = currentPoints + rating;
  const newAvg = newPoints / newCount;

  transaction.update(reviewReqRef, {
    status: "used",
    usedAt:  FieldValue.serverTimestamp(),
  });

  transaction.update(workerRef, {
    reviewCount: newCount, 
    totalRatingPoints: newPoints,
    avgRating: newAvg
  });

  const newReviewRef = db.collection("reviews").doc();
  transaction.set(newReviewRef, {
    workerId,
    rating,
    comment: comment || "",
    customerName: customerName || "Klient i Verifikuar",
    createdAt: FieldValue.serverTimestamp(),
  });

  return { success: true}
})

})

// Add { cors: true } or your specific domain to the first argument
export const handleGetPro = onCall({ cors: true }, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Ju duhet të jeni i kyçur.");
  }

  const uid = request.auth.uid;

  try {
    const workerRef = db.collection("workers").doc(uid);
    await workerRef.update({
      isPro: true,
      proSubscribedAt: FieldValue.serverTimestamp(),
    });

    return { success: true };
  } catch (err) {
    console.error("Error activating Pro:", err);
    throw new HttpsError("internal", "Dështoi aktivizimi i PRO.");
  }
});