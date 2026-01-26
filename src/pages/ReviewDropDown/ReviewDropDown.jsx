import React, { useState, useMemo } from "react";
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";
import PhoneInput from "react-phone-input-2";
import { app } from "../../api/firebase";
import "react-phone-input-2/lib/style.css";
import styles from "./ReviewDropDown.module.css";

// Initialize outside to prevent re-runs on every keystroke
const functions = getFunctions(app, "us-central1");
if (import.meta.env.VITE_USE_EMULATOR === "true") {
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
}

export default function ReviewDropDown() {
  const [customerPhone, setCustomerPhone] = useState("");
  const [loadingLink, setLoadingLink] = useState(false);
  const [whatsappUrl, setWhatsAppUrl] = useState(null);



  const handlePrepareLink = async () => {
    if (!customerPhone) return;
    setLoadingLink(true);

    try {
      const generateToken = httpsCallable(functions, "generateReviewRequest");
      const { data } = await generateToken({ customerPhone });

      const base = window.location.hostname.includes("localhost")
        ? window.location.origin
        : "https://mjeshtri-blue.vercel.app";

      const reviewLink = `${base}/review/${data.token}`;
      const cleanNumber = customerPhone.replace(/\D/g, "");
      
      const waUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
        `Përshëndetje! Mund të lini një vlerësim për punën time këtu: ${reviewLink}`
      )}`;

      setWhatsAppUrl(waUrl);
    } catch (error) {
      console.error("Error generating token:", error);
    } finally {
      setLoadingLink(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.iconCircle}>⭐</div>
        <h2 className={styles.title}>
          Kërko <span className={styles.highlight}>Vlerësim</span>
        </h2>
        <p className={styles.subtitle}>
          Vlerësimet me yje rrisin besueshmërinë tuaj në platformë.
        </p>
      </div>

      <div className={styles.infoBox}>
        <p>
          ℹ️ Ky funksion gjeneron një link unik për klientin tuaj. Këtë buton e gjeni gjithmonë edhe te <strong>Paneli i Mjeshtrit</strong>.
        </p>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Numri i Klientit (WhatsApp)</label>
        <PhoneInput
          country={"xk"}
          value={customerPhone}
          onChange={(val) => {
            setCustomerPhone(val);
            if (whatsappUrl) setWhatsAppUrl(null);
          }}
          containerClass={styles.phoneContainer}
          inputClass={styles.PhoneInput}
        />
      </div>

      <div className={styles.actions}>
        {!whatsappUrl ? (
          <button
            className={styles.generateBtn}
            onClick={handlePrepareLink}
            disabled={!customerPhone || loadingLink}
          >
            {loadingLink ? (
              <span className={styles.loader}></span>
            ) : (
              "Gjenero Linkun 🔗"
            )}
          </button>
        ) : (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappBtn}
          >
            Dërgo në WhatsApp 💬
          </a>
        )}
        
       
      </div>
    </div>
  );
}