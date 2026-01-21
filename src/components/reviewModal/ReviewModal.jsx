import { useState } from "react";
import { httpsCallable } from "firebase/functions";
import PhoneInput from 'react-phone-input-2';
// Import the ALREADY CONNECTED functions instance from your central config
import { functions } from "../../api/firebase"; 
import styles from './ReviewModal.module.css';

export default function ReviewModal({ onClose }) {
  const [customerPhone, setCustomerPhone] = useState("");
  const [loadingLink, setLoadingLink] = useState(false);
  const [whatsappUrl, setWhatsAppUrl] = useState(null);

  const handlePrepareLink = async () => {
    // Basic validation
    if (!customerPhone || customerPhone.length < 5) {
      alert("Ju lutem shkruani një numër të vlefshëm.");
      return;
    };
    
    setLoadingLink(true);

    try {
      // Use the callable function
      const generateToken = httpsCallable(functions, "generateReviewRequest");
      
      // We pass the phone number to the Cloud Function
      const { data } = await generateToken({ customerPhone });

      // Determine the base URL for the review link
      const baseUrl = window.location.hostname === "localhost"
        ? "http://localhost:3000"
        : "https://mjeshtri-blue-vercel.app";

      const reviewLink = `${baseUrl}/review/${data.token}`;
      
      // Clean the phone number for the WhatsApp API (remove +, spaces, etc)
      const cleanPhone = customerPhone.replace(/\D/g, ""); 
      
      // Create the pre-filled message
      const message = encodeURIComponent(
        `Përshëndetje! Ju lutem ndani përvojën tuaj duke lënë një vlerësim për punën time këtu: ${reviewLink}`
      );
      
      const waUrl = `https://wa.me/${cleanPhone}?text=${message}`;

      setWhatsAppUrl(waUrl);
    } catch (error) {
      console.error("Error generating token:", error);
      // Helpful error message for the user
      const errorMessage = error.code === 'unauthenticated' 
        ? "Ju duhet të jeni i kyçur për të kryer këtë veprim." 
        : "Ndodhi një gabim gjatë gjenerimit të linkut.";
      alert(errorMessage);
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
            setWhatsAppUrl(null); // Reset link if number changes
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