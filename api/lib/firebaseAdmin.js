import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!serviceAccountString) {
  throw new Error("Missing FIREBASE_SERVICE_ACCOUNT environment variable.");
}

const serviceAccount = JSON.parse(serviceAccountString);

const firebaseAdminApp =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert(serviceAccount),
      });

export const adminDb = getFirestore(firebaseAdminApp);