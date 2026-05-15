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

