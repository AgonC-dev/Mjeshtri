import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "../../api/firebase";
import styles from "./SuspensionGuard.module.css";

const SUPPORT_EMAIL = "support@gjejnjerin.com";

export default function SuspensionGuard({ children }) {
  const [status, setStatus] = useState("checking");
  const [retryCount, setRetryCount] = useState(0);
  const [signingOut, setSigningOut] = useState(false);

  const requestId = useRef(0);

  useEffect(() => {
    let active = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const currentRequest = ++requestId.current;

      // Public visitors don't need a suspension check.
      if (!user) {
        if (active) setStatus("allowed");
        return;
      }

      // Only authenticated users reach this point.
      setStatus("checking");

      try {
        const workerRef = doc(db, "workers", user.uid);
        const workerSnap = await getDoc(workerRef);

        if (!active || currentRequest !== requestId.current) return;

        const isSuspended =
          workerSnap.exists() &&
          workerSnap.data().isSuspend === true;

        setStatus(isSuspended ? "suspended" : "allowed");
      } catch (error) {
        console.error("Suspension check failed:", error);

        if (active && currentRequest === requestId.current) {
          setStatus("error");
        }
      }
    });

    return () => {
      active = false;
      requestId.current++;
      unsubscribe();
    };
  }, [retryCount]);

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await signOut(auth);
    } catch (error) {
      console.error("Sign out failed:", error);
      setSigningOut(false);
    }
  };

  const handleRetry = () => {
    setStatus("checking");
    setRetryCount((count) => count + 1);
  };

  // Important: while Firebase checks authentication or the worker
  // document, the public website remains visible.
  if (status !== "suspended" && status !== "error") {
    return children;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.logo}>G</div>

        {status === "suspended" ? (
          <>
            <div className={styles.icon}>!</div>

            <span className={styles.statusLabel}>
              LLOGARIA E PEZULLUAR
            </span>

            <h1>Llogaria juaj është pezulluar</h1>

            <p className={styles.description}>
              Qasja në platformën Gjejnjerin është kufizuar
              për llogarinë tuaj. Nëse mendoni se ky vendim
              është bërë gabimisht, kontaktoni ekipin tonë
              të mbështetjes.
            </p>

            <div className={styles.support}>
              <span>Ne jemi këtu për t'ju ndihmuar</span>
              <a href={`mailto:${SUPPORT_EMAIL}`}>
                {SUPPORT_EMAIL}
              </a>
            </div>

            <a
              className={styles.primaryButton}
              href={`mailto:${SUPPORT_EMAIL}`}
            >
              Kontakto mbështetjen
            </a>

            <button
              className={styles.secondaryButton}
              onClick={handleSignOut}
              disabled={signingOut}
            >
              {signingOut
                ? "Duke dalë..."
                : "Dil dhe kyçu me një llogari tjetër"}
            </button>
          </>
        ) : (
          <>
            <div className={styles.icon}>!</div>

            <h1>Nuk mund ta verifikojmë llogarinë</h1>

            <p className={styles.description}>
              Pati një problem gjatë kontrollimit të statusit
              të llogarisë suaj. Ju lutemi provoni përsëri.
            </p>

            <button
              className={styles.primaryButton}
              onClick={handleRetry}
            >
              Provo përsëri
            </button>

            <button
              className={styles.secondaryButton}
              onClick={handleSignOut}
              disabled={signingOut}
            >
              {signingOut ? "Duke dalë..." : "Dil nga llogaria"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}