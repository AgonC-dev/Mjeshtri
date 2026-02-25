import { useEffect, useState } from 'react';
import styles from './Contact.module.css';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../api/firebase';
import { useSearchParams } from 'react-router-dom';

export default function Contact() {
  const [result, setResult] = useState("");
  const [status, setStatus] = useState(""); // "loading", "success", "error"
  const [subject, setSubject] = useState("");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    window.scroll(0, 0);
    const urlSubject = searchParams.get("subject");
    if (urlSubject) {
      setSubject(urlSubject);
    }
  }, [searchParams]);

  const onSubmit = async (event) => {
  event.preventDefault();
  setResult("Duke u dërguar...");
  setStatus("loading");

  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());

  try {
    // 1. Prepare the standard report object for your Admin Dashboard
    const commonReport = {
      reporterName: data.name,
      reporterEmail: data.email,
      reporterId: auth.currentUser?.uid || "Guest",
      title: data.title,
      message: data.message,
      category: data.subject,
      createdAt: serverTimestamp(),
      status: "open", // Helpful for admin to track resolved issues
    };

    if (data.subject === "Problem") {
      // --- LOGIC FOR USER REPORTS (Firestore Only) ---
      await addDoc(collection(db, "reports"), {
        ...commonReport,
        reportedUserName: data.reported_user_display || "N/A",
        reportedUserId: data.reported_id || "N/A",
      });
      
      setResult("Raporti u dërgua me sukses. Faleminderit!");
    } else {
      // --- LOGIC FOR GENERAL INQUIRIES (Web3Forms + Firestore Backup) ---
      formData.append("access_key", "0eb38deb-61ed-4c8e-ac89-001194247faa");
      
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const resData = await response.json();

      if (resData.success) {
        // Now also save the general inquiry to Firestore so it shows in Admin Panel
        await addDoc(collection(db, "reports"), commonReport);
        
        setResult("Mesazhi u dërgua me sukses!");
      } else {
        throw new Error("Dërgimi dështoi nga Web3Forms");
      }
    }

    setStatus('success');
    setSubject("");
    event.target.reset();

  } catch (error) {
    console.error("DETAJET E GABIMIT:", error);
    setStatus("error");
    setResult("Pati një gabim. Provoni përsëri.");
  }
};

  return (
    <div className={styles.wrapper}>
      <div className={styles.contactCard}>
        <div className={styles.header}>
          <h2 className={styles.title}>Na <span>Kontaktoni</span></h2>
          <p className={styles.subtitle}>Kemi krijuar këtë hapësirë për çdo pyetje apo sugjerim tuajin.</p>
        </div>

        <form onSubmit={onSubmit} className={styles.form}>
          {/* USER INFO ROW */}
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Emri Juaj</label>
              <input type="text" name="name" placeholder="Filan Fisteku" required />
            </div>
            <div className={styles.inputGroup}>
              <label>Email</label>
              <input type="email" name="email" placeholder="emri@shembull.com" required />
            </div>
          </div>

          {/* CATEGORY SELECT */}
          <div className={styles.inputGroup}>
            <label>Kategoria</label>
            <div className={styles.selectWrapper}>
              <select 
                name="subject" 
                className={styles.customSelect} 
                required 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)}
              >
                <option value="" disabled>Zgjidhni një kategori</option>
                <option value="Pergjithshme">Pyetje e përgjithshme</option>
                <option value="Punetor">Unë jam Punëtor</option>
                <option value="Klient">Unë jam Klient</option>
                <option value="Problem">Raporto Problem / Abuzim</option>
              </select>
            </div>
          </div>

          {/* DYNAMIC FIELD: Reporting Target */}
          {subject === "Problem" && (
            <div className={styles.inputGroup} style={{ animation: "fadeIn 0.4s ease forwards" }}>
              <label>Personi që po raportoni</label>
              <div className={styles.lockedInputWrapper}>
                <input 
                  type="text" 
                  name="reported_user_display" 
                  defaultValue={searchParams.get("reported_name") || "I panjohur"} 
                  readOnly 
                  className={styles.lockedInput} 
                />
                <span className={styles.lockIcon}>🔒</span>
              </div>
              <input 
                type="hidden" 
                name="reported_id" 
                value={searchParams.get("reported_id") || ""} 
              />
              <p className={styles.helperText}>*ID e punëtorit është lidhur automatikisht.</p>
            </div>
          )}

          {/* SUBJECT TITLE FIELD */}
          <div className={styles.inputGroup}>
            <label>Subjekti i mesazhit</label>
            <input 
              type="text" 
              name="title" 
              placeholder={subject === "Problem" ? "Psh: Sjellje jo profesionale" : "Psh: Ndihmë me llogarinë"} 
              required 
            />
          </div>

          {/* MESSAGE AREA */}
          <div className={styles.inputGroup}>
            <label>Mesazhi juaj</label>
            <textarea 
              name="message" 
              rows="5" 
              placeholder="Shkruani detajet këtu..." 
              required
            ></textarea>
          </div>

          {/* FOOTER & FEEDBACK */}
          <div className={styles.footerRow}>
            <button 
              type="submit" 
              className={styles.submitBtn} 
              disabled={status === "loading"}
            >
              {status === "loading" ? "Duke u dërguar..." : (subject === "Problem" ? "Dërgo Raportin" : "Dërgo Mesazhin")}
            </button>
            {result && (
              <p className={`${styles.statusMsg} ${styles[status]}`}>
                {status === "success" ? "✅ " : status === "error" ? "❌ " : ""} {result}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}