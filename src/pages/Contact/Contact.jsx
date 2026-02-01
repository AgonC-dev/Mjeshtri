import { useEffect, useState } from 'react';
import styles from './Contact.module.css';

export default function Contact() {
  const [result, setResult] = useState("");
  const [status, setStatus] = useState(""); // "success" or "error"

  useEffect(() => {
    window.scroll(0, 0);
  }, [])

  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Duke u dërguar...");
    setStatus("loading");
    
    const formData = new FormData(event.target);
    // Sigurohu që kjo key është e saktë nga web3forms dashboard
    formData.append("access_key", "0eb38deb-61ed-4c8e-ac89-001194247faa");
    formData.append("subject", "Mesazh i ri nga Mjeshtri.ks")

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setResult("Mesazhi u dërgua me sukses!");
        event.target.reset();
      } else {
        setStatus("error");
        setResult("Pati një gabim. Provoni përsëri.");
      }
    } catch (error) {
      setStatus("error");
      setResult("Gabim në lidhje. Kontrolloni internetin.");
    }
  };

  return (
 <div className={styles.wrapper}>
  <div className={styles.contactCard}>
    <h2 className={styles.title}>Na <span>Kontaktoni</span></h2>
  <p className={styles.subtitle}>Kemi krijuar këtë hapësirë për çdo pyetje apo sugjerim tuajin.</p>

    <form onSubmit={onSubmit} className={styles.form}>
      {/* Desktop: Side-by-side, Mobile: Stacked */}
      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <label>Emri</label>
          <input type="text" name="name" placeholder="Filan Fisteku" required />
        </div>
        <div className={styles.inputGroup}>
          <label>Email</label>
          <input type="email" name="email" placeholder="emri@shembull.com" required />
        </div>
      </div>

      <input type="hidden" name="botcheck" style={{display: "none"}} />

      <div className={styles.inputGroup}>
    <label>Subjekti</label>
    <div className={styles.selectWrapper}>
      <select name="subject" className={styles.customSelect} required>
        <option value="" disabled selected>Zgjidhni një kategori</option>
        <option value="Pergjithshme">Pyetje e përgjithshme</option>
        <option value="Punetor">Unë jam Punëtor</option>
        <option value="Klient">Unë jam Klient</option>
        <option value="Problem">Raporto Problem</option>
      </select>
    </div>
  </div>

      <div className={styles.inputGroup}>
        <label>Mesazhi</label>
        <textarea name="message" rows="4" placeholder="Shkruani mesazhin tuaj këtu..." required></textarea>
      </div>

      <div className={styles.footerRow}>
        <button type="submit" className={styles.submitBtn}>Dërgo Mesazhin</button>
        {result && <p className={`${styles.status} ${styles[status]}`}>{result}</p>}
      </div>
    </form>
  </div>
</div>
  );
}