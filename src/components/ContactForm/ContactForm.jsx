import { useEffect, useRef, useState } from "react";
import styles from "./ContactForm.module.css"; // Reuse your dashboard/modal styles
import { getFunctions, httpsCallable } from "firebase/functions";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db, functions } from "../../api/firebase";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';




export default function ContactForm({ workerId, workerPhone, workerName = "Mjeshtri", onClose }) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);

  
  
  useEffect(() => {
    if (countdown <= 0) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if ( prev <= 1) {
          clearInterval(interval)
          return 0;
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [countdown > 0])
   
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (countdown > 0) return;
    setError('');
    

 
    
   if (!workerId) {
    alert("Error: ID e mjeshtrit mungon.");
    return;
  }

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
      

      // 3. Redirect to WhatsApp
      const cleanPhone = workerPhone.replace(/\D/g, '');
      const message = encodeURIComponent(
        `Përshëndetje ${workerName}, unë jam ${customerName}. Ju gjeta te Mjeshtri.ks...`
      );
      
      window.location.href = `https://wa.me/${cleanPhone}?text=${message}`;

    } catch (err) {
       if(err.code === 'functions/resource-exhausted') {

        setError("Ngadalë pak! 👋 Keni dërguar shumë kërkesa. Prisni pak sekonda.")
        setCountdown(60)

      } else if (err.message) {
        setError(err.message)
       } else {
         setCountdown(60);
    
       }

       setTimeout(() => setError(''), 5000);
    } finally {
      setLoading(false)
    }
}

  return (
    <div className={styles.proContent}> {/* Reusing your modal content styles */}
      <h2>Kontakto Mjeshtrin</h2>
      <p>Plotësoni të dhënat që mjeshtri t'ju identifikojë për vlerësim më vonë.</p>
      
      <form onSubmit={handleSubmit} className={styles.contactForm}>
        <div className={styles.inputGroup} style={{ animationDelay: '0.1s' }}>
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

        <div className={styles.inputGroup} style={{ animationDelay: '0.2s' }}>
          <label className={styles.label}>Numri i telefonit (WhatsApp)</label>
          <PhoneInput
            country={'xk'}
            value={customerPhone}
            onChange={setCustomerPhone}
            containerClass={styles.phoneContainer}
            inputClass={styles.PhoneInput}
          />
        </div>

        <div className={styles.actions} style={{ animationDelay: '0.3s' }}>
          {error && <p className={styles.errorMessage} style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</p>}
           <button 
            type="submit" 
            disabled={loading || countdown > 0} 
            className={countdown > 0 ? styles.disabledBtn : styles.purchaseBtn}
          >
            {loading ? (
              "Duke procesuar..."
            ) : countdown > 0 ? (
              `Provo përsëri pas ${countdown}s`
            ) : (
              "Vazhdo te WhatsApp"
            )}
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