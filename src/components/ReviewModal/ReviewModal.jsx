import {
  getFunctions,
  httpsCallable,
  connectFunctionsEmulator,
} from "firebase/functions";
import { useState, useEffect } from "react";
import styles from "./ReviewModal.module.css";
import { app } from "../../api/firebase";

const functions = getFunctions(app, "us-central1");

// Handle Emulator vs Production
if (import.meta.env.VITE_USE_EMULATOR === "true") {
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
}

export default function ReviewModal({ user, onClose, sessions }) {
  const [generatingId, setGeneratingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Since sessions come from props, we just handle the loading state locally
  useEffect(() => {
    if (sessions) {
      setLoading(false);
    }
  }, [sessions]);

  const handleCreateLink = async (sessionId, phone) => {
    setGeneratingId(sessionId);
    try {
      // 1. Call your Cloud Function to generate the token and document
      const createRequest = httpsCallable(functions, "createReviewRequest");
      const { data } = await createRequest({ sessionId  });
   

      // 2. Format the message for WhatsApp
      const cleanPhone = phone.replace(/\D/g, "");
      const message = encodeURIComponent(
        `Përshëndetje! Faleminderit që na kontaktuat. Mund të lini një vlerësim për punën tonë në këtë link: ${data.reviewUrl}`
      );

      // 3. Open WhatsApp Web/App
      window.location.href = `https://wa.me/${cleanPhone}?text=${message}`, "_blank";

      // 4. Close the modal
      onClose();
    } catch (err) {
      console.error("Error creating review request:", err);
      alert("Gabim: " + err.message);
    } finally {
      setGeneratingId(null);
    }
  };

   return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <header className={styles.modalHeader}>
          <div className={styles.headerIcon}>⭐</div>
          <h2>Zgjidhni Klientin</h2>
          <p>Kërko vlerësim nga kontaktet e fundit:</p>
        </header>

        {loading ? (
          <div className={styles.loaderContainer}>
            <div className={styles.miniSpinner}></div>
            <span>Duke ngarkuar...</span>
          </div>
        ) : (
          <div className={styles.sessionList}>
            {sessions.length === 0 ? (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>💬</span>
                <p>Nuk u gjet asnjë kontakt i ri i disponueshëm.</p>
              </div>
            ) : (
              sessions.map((s) => (
                <div key={s.id} className={styles.sessionItem}>
                  <div className={styles.clientInfo}>
                    <span className={styles.clientName}>{s.customerName}</span>
                    <span className={styles.clientPhone}>{s.customerPhone}</span>
                  </div>
                  <button
                    onClick={() => handleCreateLink(s.id, s.customerPhone)}
                    disabled={generatingId !== null}
                    className={styles.generateBtn}
                  >
                    {generatingId === s.id ? (
                      <div className={styles.btnLoader}></div>
                    ) : (
                      "Dërgo"
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        )}
        
        <button onClick={onClose} className={styles.closeModalBtn}>Mbyll</button>
      </div>
    </div>
  );
}