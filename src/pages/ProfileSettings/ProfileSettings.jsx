import { useState, useEffect } from "react";
import { doc, updateDoc, serverTimestamp, increment, writeBatch } from "firebase/firestore";
import styles from "./ProfileSettings.module.css";
import {
  verifyBeforeUpdateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  updatePassword,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "../../api/firebase";
import { useNavigate } from "react-router-dom";
import { sendEmailVerification } from "firebase/auth";

const ProfileSettings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState({
    email: false,
    password: false,
    deleting: false,
  });
  const [passwords, setPassword] = useState({ current: "", next: "" });
  const [newEmail, setNewEmail] = useState("");
  const [status, setStatus] = useState({ msg: "", type: "" });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) setNewEmail(currentUser.email);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  async function verifyUser(currentPassword) {
    const user = auth.currentUser;
    if (!user) throw new Error("No user logged in");
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      currentPassword
    );
    await reauthenticateWithCredential(auth.currentUser, credential);
  }

  async function handleEditEmail(e) {
    e.preventDefault();

    try {
      setStatus({ msg: "Duke përditësuar...", type: "" });
      await verifyUser(passwords.current);
      await verifyBeforeUpdateEmail(auth.currentUser, newEmail);

      setIsEditing((prev) => ({ ...prev, email: false }));
      setPassword((prev) => ({ ...prev, current: "" }));
      setStatus({
        msg: "Një link verifikimi u dërgua te email-i i ri. Klikoni linkun për të përfunduar ndryshimin.",
        type: "success",
      });
    } catch (err) {
      setStatus({
        msg: "Dështoi përditësimi. Sigurohuni që fjalëkalimi është i saktë.",
        type: "error",
      });
    }
  }

  async function handleUpdatePassword(e) {
    e.preventDefault();
    try {
      setStatus({ msg: "Duke përditësuar...", type: "" });
      await verifyUser(passwords.current);
      await updatePassword(auth.currentUser, passwords.next);
      setIsEditing((prev) => ({ ...prev, password: false }));
      setPassword({ current: "", next: "" });
      setStatus({ msg: "Fjalëkalimi u ndryshua me sukses!", type: "success" });
      window.scroll(0, 0);
    } catch (err) {
      window.scroll(0, 0);

      if (err.code === "auth/requires-recent-login") {
        window.scroll(0, 0);
        setStatus({
          msg: "Ju lutem dilni dhe hyni përsëri që të mund të ndryshoni email-in.",
          type: "error",
        });
      } else {
        setStatus({
          msg: "Dështoi përditësimi. Sigurohuni që fjalëkalimi është i saktë.",
          type: "error",
        });
      }
    }
  }

  async function handleGhostAccount(e) {
    e.preventDefault();

    try {
      setStatus({ msg: "Duke procesuar fshirjen...", type: "" });
      await verifyUser(passwords.current);
      const userUid = auth.currentUser.uid;

      const userDocRef = doc(db, "workers", userUid);
      const statusRef = doc(db, "metadata", "globalStats");

      const batch = writeBatch(db);

      batch.update(userDocRef, {
        isActive: false,
        deactivatedAt: serverTimestamp(),
      })
    
      batch.update(statusRef, {
        workerCount: increment(-1)
      })
      
      await batch.commit();
      
      await auth.currentUser.delete();

      setStatus({ msg: "Llogaria u fshi me sukses.", type: "success" });
      window.scroll(0, 0);
    } catch (err) {
      if (err.code === "auth/requires-recent-login") {
        setStatus({
          msg: "Ju lutem ri-hyni në llogari për të kryer këtë veprim.",
          type: "error",
        });
        window.scroll(0, 0);
      } else {
        setStatus({
          msg: "Fjalëkalimi i gabuar. Provoni përsëri.",
          type: "error",
        });
      }

      window.scroll(0, 0);
    }
  }

  const handleVerifyEmail = async () => {
  // 1. Give immediate feedback so the user knows the click worked
  setStatus({ msg: "Duke dërguar e-mailin...", type: "" });

  try {
    // Note: use auth.currentUser to ensure you have the latest instance
    await sendEmailVerification(auth.currentUser);
    
    // 2. Fix 'message' to 'msg' to match your JSX {status.msg}
    setStatus({ 
      msg: "Linku i verifikimit u dërgua me sukses! Kontrolloni inbox-in tuaj.", 
      type: "success" 
    });

    // 3. Auto-clear after 6 seconds so the dashboard stays clean
    setTimeout(() => setStatus({ msg: "", type: "" }), 6000);

  } catch (error) {
    setStatus({ 
      msg: "Dështoi dërgimi: " + error.message, 
      type: "error" 
    });
  }
};

  const handleRefreshStatus = async () => {
  try {
    setStatus({ msg: "Duke u sinkronizuar...", type: "" });
    
    // This is the magic line: it forces Firebase to check the latest server data
    await auth.currentUser.reload(); 
    
    const updatedUser = auth.currentUser;
    setUser(updatedUser); // Update local state

    if (updatedUser.emailVerified) {
      setStatus({ msg: "Sukses! Email-i u verifikua.", type: "success" });
    } else {
      setStatus({ msg: "Email-i ende nuk është verifikuar. Kontrolloni 'Spam'.", type: "error" });
    }
  } catch (error) {
    setStatus({ msg: "Dështoi rifreskimi: " + error.message, type: "error" });
  }
};

  if (loading) {
    return (
      <div className={styles.centeredContainer}>
        <div className={styles.loaderWrapper}>
          <div className={styles.jumpingDot}></div>
          <div className={styles.jumpingDot}></div>
          <div className={styles.jumpingDot}></div>
        </div>
        <p className={styles.animatedText}>
          Duke u sinkronizuar me Mjeshtri.ks...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.centeredContainer}>
        <div className={styles.lockIconWrapper}>
          <span className={styles.lockEmoji}>🔒</span>
        </div>
        <p className={styles.errorText}>
          Ju lutem hyni në llogari për të parë cilësimet.
        </p>
        <button
          className={styles.loginPulseButton}
          onClick={() => navigate("/login")}
        >
          Hyni Këtu
        </button>
      </div>
    );
  }



  return (
    <div className={styles.settingsContainer}>
      <h1 className={styles.pageTitle}>Cilësimet e Llogarisë</h1>

      {/* VERIFICATION WARNING BANNER */}
      {!user.emailVerified && (
  <div className={styles.securityWarningBanner}>
    <div className={styles.warningContent}>
      <span className={styles.warningIcon}>⚠️</span>
      <div>
        <p className={styles.warningTitle}>Verifikoni Email-in Tuaj</p>
        <p className={styles.warningDesc}>Ju lutem kontrolloni postën tuaj elektronike.</p>
      </div>
    </div>
    <div className={styles.bannerButtons}>
      <button onClick={handleVerifyEmail} className={styles.verifyBtnInline}>
        Dërgo Linkun
      </button>
      <button onClick={handleRefreshStatus} className={styles.refreshBtnInline}>
        Kam klikuar linkun ↻
      </button>
    </div>
  </div>
)}

      {status.msg && (
        <div className={`${styles.statusMessage} ${status.type === "success" ? styles.success : styles.error}`}>
          {status.msg}
        </div>
      )}

      <div className={styles.sectionsWrapper}>
        
        {/* SECTION 1: EMAIL (ALWAYS EDITABLE TO FIX TYPOS) */}
        <section className={styles.settingsSection}>
          <h2 className={styles.sectionTitle}>E-mail dhe Identiteti</h2>
          <div className={styles.card}>
            {!isEditing.email ? (
              <div className={styles.displayRow}>
                <div className={styles.info}>
                  <label>Adresa aktuale</label>
                  <p>{user.email} {user.emailVerified ? <span className={styles.verifiedTag}>✓</span> : <span className={styles.unverifiedTag}>!</span>}</p>
                </div>
                <button className={styles.editToggleButton} onClick={() => setIsEditing(p => ({ ...p, email: true }))}>Ndrysho</button>
              </div>
            ) : (
              <form className={styles.editForm} onSubmit={handleEditEmail}>
                <div className={styles.inputGroup}>
                  <label>E-mail i ri</label>
                  <input type="email" required value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Fjalëkalimi aktual</label>
                  <input type="password" required value={passwords.current} placeholder="••••••••" onChange={(e) => setPassword(p => ({ ...p, current: e.target.value }))} />
                </div>
                <div className={styles.buttonGroup}>
                  <button type="submit" className={styles.updateButton}>Ruaj Email-in</button>
                  <button type="button" className={styles.cancelButton} onClick={() => setIsEditing(p => ({ ...p, email: false }))}>Anulo</button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* SECTION 2: PASSWORD (LOCKED IF NOT VERIFIED) */}
        <section className={`${styles.settingsSection} ${!user.emailVerified ? styles.lockedSection : ""}`}>
          <h2 className={styles.sectionTitle}>Siguria e Fjalëkalimit</h2>
          <div className={styles.card}>
            {!isEditing.password ? (
              <div className={styles.displayRow}>
                <div className={styles.info}>
                  <label>Fjalëkalimi</label>
                  <p>••••••••••••</p>
                </div>
                <button 
                  className={styles.editToggleButton} 
                  disabled={!user.emailVerified} 
                  onClick={() => setIsEditing(p => ({ ...p, password: true }))}
                >
                  Ndrysho
                </button>
              </div>
            ) : (
              <form className={styles.editForm} onSubmit={handleUpdatePassword}>
                <div className={styles.inputGroup}>
                  <label>Fjalëkalimi aktual</label>
                  <input type="password" required onChange={(e) => setPassword(p => ({ ...p, current: e.target.value }))} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Fjalëkalimi i ri</label>
                  <input type="password" required onChange={(e) => setPassword(p => ({ ...p, next: e.target.value }))} />
                </div>
                <div className={styles.buttonGroup}>
                  <button type="submit" className={styles.updateButton}>Ndrysho Fjalëkalimin</button>
                  <button type="button" className={styles.cancelButton} onClick={() => setIsEditing(p => ({ ...p, password: false }))}>Anulo</button>
                </div>
              </form>
            )}
            {!user.emailVerified && <p className={styles.lockHint}>Duhet të verifikoni email-in për të ndryshuar fjalëkalimin.</p>}
          </div>
        </section>

        {/* SECTION 3: DANGER ZONE (LOCKED IF NOT VERIFIED) */}
        <section className={`${styles.settingsSection} ${!user.emailVerified ? styles.lockedSection : ""}`}>
          <h2 className={`${styles.sectionTitle} ${styles.dangerText}`}>Zona e Rrezikut</h2>
          <div className={`${styles.card} ${styles.dangerCard}`}>
            {!isEditing.deleting ? (
              <div className={styles.dangerRow}>
                <div className={styles.dangerInfo}>
                  <h3>Fshini Llogarinë</h3>
                  <p>Ky veprim është i pakthyeshëm. Të dhënat tuaja do të fshihen.</p>
                </div>
                <button 
                  className={styles.deleteButton} 
                  disabled={!user.emailVerified} 
                  onClick={() => setIsEditing(p => ({ ...p, deleting: true }))}
                >
                  Fshi Llogarinë
                </button>
              </div>
            ) : (
              <form onSubmit={handleGhostAccount} className={styles.editForm}>
                <div className={styles.inputGroup}>
                  <label>Shkruani fjalëkalimin për fshirje:</label>
                  <input type="password" required placeholder="••••••••" onChange={(e) => setPassword(p => ({ ...p, current: e.target.value }))} />
                </div>
                <div className={styles.buttonGroup}>
                  <button type="submit" className={styles.deleteButtonFull}>Konfirmo Fshirjen</button>
                  <button type="button" className={styles.cancelButton} 
                   onClick={() => {
                    setIsEditing(p => ({ ...p, deleting: false }));
                    setPassword({ current: "", next: "" }); // Clear the sensitive data
                  }}
                    >Anulo</button>
                </div>
              </form>
            )}
             {!user.emailVerified && <p className={styles.lockHint}>Duhet të verifikoni email-in për të fshirë llogarinë.</p>}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProfileSettings;
