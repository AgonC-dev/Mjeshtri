import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../api/firebase";
import styles from "./SuspensionGuard.module.css";

function SuspensionGuard({ children }) {
  const [status, setStatus] = useState("checking");
  const [retry, setRetry] = useState(0);

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

  if (status === "checking") {
    return (
      <div className={styles.screen}>
        <p>Po verifikohet llogaria juaj...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className={styles.screen}>
        <h2>Nuk mundëm të verifikojmë llogarinë</h2>
        <p>
          Ju lutemi provoni përsëri. Për arsye sigurie,
          qasja është përkohësisht e kufizuar.
        </p>

        <button onClick={() => setRetry((prev) => prev + 1)}>
          Provo përsëri
        </button>
      </div>
    );
  }

  if (status === "suspended") {
    return (
      <div className={styles.screen}>
        <div className={styles.suspendedCard}>
          <div className={styles.icon}>!</div>

          <h2>Llogaria juaj është pezulluar</h2>

          <p>
            Llogaria juaj është pezulluar nga administratori
            i Gjejnjerin. Për momentin nuk mund të përdorni
            platformën.
          </p>

          <p>
            Nëse mendoni se ky vendim është marrë gabimisht,
            ju lutemi kontaktoni ekipin tonë.
          </p>

          {import.meta.env.VITE_SUPPORT_EMAIL && (
            <a
              href={`mailto:${import.meta.env.VITE_SUPPORT_EMAIL}`}
              className={styles.contactButton}
            >
              Kontakto mbështetjen
            </a>
          )}
        </div>
      </div>
    );
  }

  return children;
}

export default SuspensionGuard;