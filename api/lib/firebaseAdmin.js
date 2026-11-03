
import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const rawServiceAccount =
  process.env.FIREBASE_SERVICE_ACCOUNT;

if (!rawServiceAccount) {
  throw new Error("Missing FIREBASE_SERVICE_ACCOUNT environment variable.");
}

// Escape actual line breaks inside the private_key value.
const normalizedServiceAccount = rawServiceAccount.replace(
  /("private_key"\s*:\s*")([\s\S]*?)(")/,
  (_, prefix, key, suffix) =>
    prefix + key.replace(/\r?\n/g, "\\n") + suffix
);

let serviceAccount;

try {
  serviceAccount = JSON.parse(normalizedServiceAccount);
} catch (error) {
  throw new Error(`Invalid Firebase service account JSON: ${error.message}`);
}

serviceAccount.private_key =
  serviceAccount.private_key.replace(/\\n/g, "\n");

const firebaseAdminApp =
  getApps().length > 0
    ? getApps()[0]
    : initializeApp({
        credential: cert(serviceAccount),
      });

export const adminDb = getFirestore(firebaseAdminApp);
