
import { getFunctions, httpsCallable } from "firebase/functions";
import { useState } from "react";
import PhoneInput from 'react-phone-input-2';
import styles from './ReviewModal.module.css';

export default function ReviewModalContent({ onClose }) {
    const [ customerPhone, setCustomerPhone] = useState(null);
    const [ loadingLink, setLoadingLink ] = useState(false);
    const [ whatsappUrl, setWhatsAppUrl] = useState(null);

 const handlePrepareLink = async () => {
    if(!customerPhone) return;
    setLoadingLink(true);

    try {
        const functions = getFunctions();
        const generateToken = httpsCallable(functions, "generateReviewRequest");
        const { data } = await generateToken( { customerPhone});

        const reviewLink = `https://mjeshtri-blue-vercel.app/review/${data.token}`;
        const message = `Përshëndetje! Ju mund të lini një vlerësim për mjeshtrin tim: ${reviewLink}`
   
        const waUrl = `https://wa.me/${customerPhone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
        setWhatsAppUrl(waUrl);

    } catch (error) {
       console.log(error)
    } finally {
        setLoadingLink(false);
    }
 }

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