import { useState, useEffect } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
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
      await updateDoc(userDocRef, {
        isActive: false,
        deactivatedAt: serverTimestamp(),
      });

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

      {status.msg && (
        <div
          className={`${styles.statusMessage} ${
            status.type === "success" ? styles.success : styles.error
          }`}
        >
          {status.msg}
        </div>
      )}

      <div className={styles.sectionsWrapper}>
        {/* Section 1: Email Management */}
        <section className={styles.settingsSection}>
          <h2 className={styles.sectionTitle}>E-mail dhe Identiteti</h2>
          <div className={styles.card}>
            {!isEditing.email ? (
              <div className={styles.displayRow}>
                <div className={styles.info}>
                  <label>Adresa aktuale</label>
                  <p>{user.email}</p>
                </div>
                <button
                  className={styles.editToggleButton}
                  onClick={() => {
                    setIsEditing((prev) => ({ ...prev, email: true }));
                    setStatus({ msg: "", type: "" });
                  }}
                >
                  Ndrysho
                </button>
              </div>
            ) : (
              <form className={styles.editForm} onSubmit={handleEditEmail}>
                <div className={styles.inputGroup}>
                  <label>E-mail i ri</label>
                  <input
                    type="email"
                    required
                    placeholder="shkruani email-in e ri"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Fjalëkalimi aktual (për siguri)</label>
                  <input
                    type="password"
                    required
                    value={passwords.current}
                    placeholder="••••••••"
                    onChange={(e) =>
                      setPassword((prev) => ({
                        ...prev,
                        current: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className={styles.buttonGroup}>
                  <button type="submit" className={styles.updateButton}>
                    Ruaj Email-in
                  </button>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() =>
                      setIsEditing((prev) => ({ ...prev, email: false }))
                    }
                  >
                    Anulo
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* Section 2: Password Management */}
        <section className={styles.settingsSection}>
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
                  onClick={() => {
                    setIsEditing((prev) => ({ ...prev, password: true }));
                    setStatus({ msg: "", type: "" });
                  }}
                >
                  Ndrysho
                </button>
              </div>
            ) : (
              <form className={styles.editForm} onSubmit={handleUpdatePassword}>
                <div className={styles.inputGroup}>
                  <label>Fjalëkalimi aktual</label>
                  <input
                    type="password"
                    required
                    placeholder="Shkruani fjalëkalimin e vjetër"
                    onChange={(e) =>
                      setPassword((prev) => ({
                        ...prev,
                        current: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Fjalëkalimi i ri</label>
                  <input
                    type="password"
                    required
                    placeholder="Shkruani fjalëkalimin e ri"
                    onChange={(e) =>
                      setPassword((prev) => ({ ...prev, next: e.target.value }))
                    }
                  />
                </div>
                <div className={styles.buttonGroup}>
                  <button type="submit" className={styles.updateButton}>
                    Ndrysho Fjalëkalimin
                  </button>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() =>
                      setIsEditing((prev) => ({ ...prev, password: false }))
                    }
                  >
                    Anulo
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* Section 3: Danger Zone */}
        {!isEditing.deleting ? (
          <section className={styles.settingsSection}>
            <h2 className={`${styles.sectionTitle} ${styles.dangerText}`}>
              Zona e Rrezikut
            </h2>
            <div className={`${styles.card} ${styles.dangerCard}`}>
              <div className={styles.dangerInfo}>
                <h3>Fshini Llogarinë</h3>
                <p>
                  Ky veprim do të fshijë profilin tuaj përfundimisht. Të gjitha
                  të dhënat dhe vlerësimet tuaja do të arkivohen dhe nuk mund të
                  kthehen më.
                </p>
              </div>
              <button
                className={styles.deleteButton}
                onClick={() =>
                  setIsEditing((prev) => ({ ...prev, deleting: true }))
                }
              >
                Fshi Llogarinë
              </button>
            </div>
          </section>
        ) : (
          <section className={styles.settingsSection}>
            <h2 className={`${styles.sectionTitle} ${styles.dangerText}`}>
              Konfirmo Fshirjen
            </h2>
            <div className={`${styles.card} ${styles.dangerCard}`}>
              <form onSubmit={handleGhostAccount} className={styles.editForm}>
                <div className={styles.inputGroup}>
                  <label>
                    Shkruani fjalëkalimin tuaj për të konfirmuar fshirjen:
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={passwords.current}
                    onChange={(e) =>
                      setPassword((prev) => ({
                        ...prev,
                        current: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className={styles.buttonGroup}>
                  <button
                    type="submit"
                    className={styles.deleteButtonFull}
                    onClick={handleGhostAccount}
                  >
                    Konfirmo Fshirjen Përfundimtare
                  </button>
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => {
                      setIsEditing((prev) => ({ ...prev, deleting: false }));
                      setPassword((prev) => ({ ...prev, current: "" }));
                    }}
                  >
                    Anulo
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;
