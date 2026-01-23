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
import crypto from "crypto";

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

export const generateReviewRequest = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Ju duhet të jeni i kyçur.");
  }

  const { customerPhone } = request.data;
  const workerId = request.auth.uid;

  if (!customerPhone) {
    throw new HttpsError("invalid-argument", "Numri i telefonit mungon.");
  }

  try {
    const workerSnap = await db.collection("workers").doc(workerId).get();
    if (!workerSnap.exists) {
      throw new HttpsError("not-found", "Mjeshtri nuk u gjet.");
    }
    
    const workerData = workerSnap.data();
    const token = crypto.randomBytes(16).toString("hex");

    await db.collection("reviewRequests").doc(token).set({
      workerId,
      workerName: workerData.fullName || "Mjeshtër",
      workerPic: workerData.profilePic || "",
      customerPhone,
      token,
      status: "pending",
      createdAt: FieldValue.serverTimestamp(), // This will now work
    });

    return { token };
  } catch (err) {
    console.error("Actual Server Error:", err); // Look at Firebase Console Logs for this!
    throw new HttpsError("internal", err.message || "Ndodhi një gabim në server.");
  }
});
// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// maxInstances option in the function's options.

// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });