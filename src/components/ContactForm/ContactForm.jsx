import { useState } from "react";
import styles from "./ContactForm.module.css"; // Reuse your dashboard/modal styles
import { getFunctions, httpsCallable } from "firebase/functions";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../../api/firebase";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const functions = getFunctions();

export default function ContactForm({ workerId, workerPhone, workerName, onClose }) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!customerPhone || customerPhone.length < 8) {
      alert("Ju lutem jepni një numër të vlefshëm.");
      return;
    }

    setLoading(true);
    try {
      // 1. Create the session (The "Bridge" for the review later)
      const createSession = httpsCallable(functions, "createContactSession");
      await createSession({
        workerId,
        customerName: customerName || "Klient",
        customerPhone,
      });

      // 2. Simple Stat Increment
      await updateDoc(doc(db, "workers", workerId), {
        whatsappRequests: increment(1)
      });

      // 3. Redirect to WhatsApp
      const cleanPhone = workerPhone.replace(/\D/g, '');
      const message = encodeURIComponent(
        `Përshëndetje ${workerName}, unë jam ${customerName}. Ju gjeta te Mjeshtri.ks...`
      );
      
      window.location.href = `https://wa.me/${cleanPhone}?text=${message}`;

    } catch (err) {
      console.error("Session Error:", err);
      alert("Ndodhi një gabim. Provoni përsëri.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.proContent}> {/* Reusing your modal content styles */}
      <h2>Kontakto Mjeshtrin</h2>
      <p>Plotësoni të dhënat që mjeshtri t'ju identifikojë për vlerësim më vonë.</p>
      
      <form onSubmit={handleSubmit} className={styles.contactForm}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Emri juaj</label>
          <input 
            type="text" 
            className={styles.input}
            required 
            value={customerName} 
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Emri dhe Mbiemri"
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Numri i telefonit (WhatsApp)</label>
          <PhoneInput
            country={'xk'}
            value={customerPhone}
            onChange={setCustomerPhone}
            containerClass={styles.phoneContainer}
            inputClass={styles.PhoneInput}
          />
        </div>

        <div className={styles.actions}>
          <button 
            type="submit" 
            disabled={loading} 
            className={styles.purchaseBtn} // Matches your PRO button style
          >
            {loading ? "Duke procesuar..." : "Vazhdo te WhatsApp"}
          </button>
          <button 
            type="button" 
            onClick={onClose} 
            className={styles.cancelBtn}
          >
            Anulo
          </button>
        </div>
      </form>
    </div>
  );
}