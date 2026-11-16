import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../api/firebase";
import styles from "./SuspensionGuard.module.css";

const SUPPORT_EMAIL = "support@gjejnjerin.com";

function SuspensionGuard({ children }) {
  const [status, setStatus] = useState("checking");
  const [retry, setRetry] = useState(0);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState("");

  useEffect(() => {
    let active = true;
    let requestId = 0;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const currentRequest = ++requestId;

      if (!user) {
        setStatus("allowed");
        return;
      }

      setStatus("checking");

      try {
        const workerRef = doc(db, "workers", user.uid);
        const workerSnap = await getDoc(workerRef);

        if (!active || currentRequest !== requestId) return;

        const suspended =
          workerSnap.exists() &&
          workerSnap.data().isSuspend === true;

        setStatus(suspended ? "suspended" : "allowed");
      } catch (error) {
        console.error("Suspension verification failed:", error);

        if (active && currentRequest === requestId) {
          setStatus("error");
        }
      }
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, [retry]);

  const handleSignOut = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);
    setSignOutError("");

    try {
      await signOut(auth);
      // onAuthStateChanged detects the sign-out
      // and changes the guard status to "allowed".
    } catch (error) {
      console.error("Sign out failed:", error);
      setSignOutError(
        "Nuk mundëm të çkyçim llogarinë. Ju lutemi provoni përsëri."
      );
      setIsSigningOut(false);
    }
  };

  if (status === "checking") {
    return (
      <div className={styles.screen}>
        <div className={styles.loadingCard}>
          <div className={styles.loader} />
          <h2>Po verifikohet llogaria</h2>
          <p>Ju lutemi prisni disa momente...</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className={styles.screen}>
        <div className={styles.statusCard}>
          <div className={styles.warningIcon}>!</div>

          <h2>Verifikimi dështoi</h2>

          <p>
            Nuk mundëm të verifikojmë statusin e llogarisë suaj.
            Për arsye sigurie, qasja është përkohësisht e kufizuar.
          </p>

          <button
            className={styles.primaryButton}
            onClick={() => setRetry((prev) => prev + 1)}
          >
            Provo përsëri
          </button>
        </div>
      </div>
    );
  }

  if (status === "suspended") {
    return (
      <div className={styles.screen}>
        <div className={styles.suspendedCard}>
          <div className={styles.brand}>
            <span className={styles.brandMark}>G</span>
            <span>Gjejnjerin</span>
          </div>

          <div className={styles.statusIcon}>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 3 21 19H3L12 3Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <path
                d="M12 9v4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <circle cx="12" cy="16" r="1" fill="currentColor" />
            </svg>
          </div>

          <span className={styles.statusLabel}>
            STATUSI I LLOGARISË
          </span>

          <h1>Llogaria juaj është pezulluar</h1>

          <p className={styles.description}>
            Qasja në llogarinë tuaj është kufizuar nga administratori
            i Gjejnjerin. Për momentin nuk mund të përdorni shërbimet
            e platformës përmes kësaj llogarie.
          </p>

          <div className={styles.infoBox}>
            <div className={styles.infoIcon}>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 6h16v12H4z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path
                  d="m4 7 8 6 8-6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div>
              <span className={styles.infoTitle}>
                Keni nevojë për ndihmë?
              </span>

              <span className={styles.infoText}>
                Kontaktoni ekipin tonë për sqarime ose rishikim të
                vendimit.
              </span>

              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className={styles.emailLink}
              >
                {SUPPORT_EMAIL}
              </a>
            </div>
          </div>

          <a
            href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
              "Kërkesë për rishikimin e pezullimit të llogarisë"
            )}`}
            className={styles.primaryButton}
          >
            Kontakto mbështetjen
            <span aria-hidden="true">→</span>
          </a>

          <button
            type="button"
            className={styles.secondaryButton}
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            {isSigningOut ? (
              "Duke u çkyçur..."
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M10 17l5-5-5-5M15 12H3"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
                Dil dhe kyçu me një llogari tjetër
              </>
            )}
          </button>

          {signOutError && (
            <p className={styles.errorText} role="alert">
              {signOutError}
            </p>
          )}

          <span className={styles.footerText}>
            Gjejnjerin · Mbështetje për përdoruesit
          </span>
        </div>
      </div>
    );
  }

  return children;
}

export default SuspensionGuard;