
import { getFunctions, httpsCallable, connectFunctionsEmulator } from "firebase/functions";
import { useState } from "react";
import PhoneInput from 'react-phone-input-2';
import styles from './ReviewModal.module.css';
import { app } from '../../api/firebase';

const functions = getFunctions(app, "us-central1");

if (import.meta.env.VITE_USE_EMULATOR === "true") {
  console.log("🔗 Using Emulator Mode");
  connectFunctionsEmulator(functions, "127.0.0.1", 5001);
} else {
  console.log("🚀 Using Production Mode");
}


export default function ReviewModal({ onClose }) {
    const [ customerPhone, setCustomerPhone] = useState(null);
    const [ loadingLink, setLoadingLink ] = useState(false);
    const [ whatsappUrl, setWhatsAppUrl] = useState(null);

const handlePrepareLink = async () => {
  if (!customerPhone) return;

  setLoadingLink(true);

  try {
    const generateToken = httpsCallable(functions, "generateReviewRequest");
    const { data } = await generateToken({ customerPhone });

    // ✅ ALWAYS production URL here
  const baseUrl = window.location.hostname.includes("localhost") 
  ? window.location.origin 
  : "https://mjeshtri-blue.vercel.app"; // This gets 'https://mjeshtri-blue.vercel.app' automatically
  const reviewLink = `${baseUrl}/review/${data.token}`;

    const phoneNumber = customerPhone.replace(/\D/g, "");
    const waUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      `Përshëndetje! Ju mund të lini një vlerësim për mjeshtrin tim: ${reviewLink}`
    )}`;

    setWhatsAppUrl(waUrl);
  } catch (error) {
    console.error("Error generating token:", error);
  } finally {
    setLoadingLink(false);
  }
};

 return (
    <div className={styles.proContent}>
      <h2>Kërko Vlerësim</h2>
      <p>Dërgoni një link klientit tuaj për të marrë një vlerësim me yje.</p>
      <div style={{ textAlign: 'left', marginTop: '1.5rem' }}>
        <label className={styles.label}>Numri i Klientit (WhatsApp)</label>
        <PhoneInput
          country={'xk'}
          value={customerPhone}
          onChange={(val) => {
            setCustomerPhone(val);
            setWhatsAppUrl(null); // Reset if number changes
          }}
          containerClass={styles.phoneContainer}
          inputClass={styles.PhoneInput}
        />
      </div>
      <div className={styles.actions}>
        {!whatsappUrl ? (
          <button 
            className={styles.purchaseBtn} 
            onClick={handlePrepareLink} 
            disabled={!customerPhone || loadingLink}
          >
            {loadingLink ? "Duke përgatitur..." : "Gjenero Linkun 🔗"}
          </button>
        ) : (
          <a 
            href={whatsappUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.purchaseBtn}
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            Dërgo në WhatsApp 💬
          </a>
        )}
        <button className={styles.cancelBtn} onClick={onClose}>Anulo</button>
      </div>
    </div>
  );


}