/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions/v2");
const admin = require("firebase-admin");
const crypto = require("crypto");

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

// Set global options for all functions (Cost & Performance Control)
setGlobalOptions({ 
  maxInstances: 5, 
  memory: "128MB",
  
});

/**
 * This function generates a review request token for a worker.
 * Accesses auth context automatically via Firebase SDK.
 */
exports.generateReviewRequest = onCall(async (request) => {
    // 1. Authentication Check (Injected by Firebase)
    if (!request.auth) {
        throw new HttpsError("unauthenticated", "Ju duhet të jeni i kyçur.");
    }

    // 2. Data Extraction (Passed from Frontend)
    const { customerPhone } = request.data;
    const workerId = request.auth.uid; // Securely pulled from Auth token

    if (!customerPhone) {
        throw new HttpsError("invalid-argument", "Numri i telefonit mungon.");
    }

    

    try {

      const workerSnap = await admin.firestore().collection("workers").doc(workerId).get();
        if (!workerSnap.exists) {
            throw new HttpsError("not-found", "Mjeshtri nuk u gjet.");
        }
        const workerData = workerSnap.data();
        // 3. Logic: Generate secure random token
        const token = crypto.randomBytes(16).toString("hex");
        const docRef = db.collection("reviewRequests").doc(token);

        // 4. Save to Firestore
        await docRef.set({
            workerId,
            workerName: workerData.fullName || "Mjeshtër",
            workerPic: workerData.profilePic || "",
            customerPhone,
            token,
            status: "pending",
            createdAt: admin.firestore.Timestamp.now(),
        });

        // 5. Return data to Frontend
        return { token };
    } catch (error) {
        console.error("Error generating token:", error);
        throw new HttpsError("internal", "Ndodhi një gabim në server.");
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