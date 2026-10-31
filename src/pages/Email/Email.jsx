import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  checkActionCode,
  applyActionCode,
  verifyPasswordResetCode,
  confirmPasswordReset,
} from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";

import { auth } from "../../api/firebase";
import styles from "./Email.module.css";

export default function Email() {
  const { action } = useParams();
  const [searchParams] = useSearchParams();

  const mode = searchParams.get("mode");
  const oobCode = searchParams.get("oobCode");

  const currentAction =
    action === "reset"
      ? "resetPassword"
      : action === "confirm"
        ? "verifyEmail"
        : mode;

  const isEmailChange =
    action === "change" || mode === "verifyAndChangeEmail";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [validCode, setValidCode] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Kontrollo kodin e veprimit të Firebase kur hapet faqja.
  useEffect(() => {
    let cancelled = false;

    async function validateCode() {
      setLoading(true);
      setError("");
      setSuccess("");
      setValidCode(false);
      setEmail("");

      if (!oobCode) {
        setError(
          "Kjo lidhje nuk është e plotë. Ju lutemi hapni lidhjen e plotë nga email-i juaj."
        );
        setLoading(false);
        return;
      }

      try {
        if (currentAction === "resetPassword") {
          const emailAddress = await verifyPasswordResetCode(
            auth,
            oobCode
          );

          if (!cancelled) {
            setEmail(emailAddress);
            setValidCode(true);
          }
        } else if (currentAction === "verifyEmail") {
          const info = await checkActionCode(auth, oobCode);

          if (info.operation !== "VERIFY_EMAIL") {
            throw new Error("Kodi i veprimit të email-it është i papritur.");
          }

          if (!cancelled) {
            setValidCode(true);
          }
        } else if (isEmailChange) {
          const info = await checkActionCode(auth, oobCode);

          if (info.operation !== "VERIFY_AND_CHANGE_EMAIL") {
            throw new Error(
              "Ky kod nuk është për ndryshimin e adresës së email-it."
            );
          }

          if (!cancelled) {
            setEmail(info.data.email || "");
            setValidCode(true);
          }
        } else {
          if (!cancelled) {
            setError("Ky veprim i email-it nuk mbështetet.");
          }
        }
      } catch (err) {
        console.error("Email action code validation failed:", err);

        if (!cancelled) {
          setError(
            "Kjo lidhje është e pavlefshme, ka skaduar ose është përdorur më parë. Ju lutemi kërkoni një lidhje të re."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    validateCode();

    return () => {
      cancelled = true;
    };
  }, [currentAction, oobCode, isEmailChange]);

  // Trajto rivendosjen e fjalëkalimit.
  async function handlePasswordReset(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Fjalëkalimi duhet të përmbajë të paktën 6 karaktere.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Fjalëkalimet nuk përputhen.");
      return;
    }

    setSubmitting(true);

    try {
      await confirmPasswordReset(auth, oobCode, password);

      setSuccess(
        "Fjalëkalimi juaj u ndryshua me sukses. Tani mund të hyni në llogarinë tuaj me fjalëkalimin e ri."
      );

      setValidCode(false);
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Password reset failed:", err);

      if (
        err.code === "auth/expired-action-code" ||
        err.code === "auth/invalid-action-code"
      ) {
        setError(
          "Kjo lidhje për rivendosjen e fjalëkalimit ka skaduar ose është përdorur më parë. Ju lutemi kërkoni një lidhje të re."
        );
      } else if (err.code === "auth/weak-password") {
        setError("Ju lutemi zgjidhni një fjalëkalim më të fortë.");
      } else {
        setError("Nuk arritëm ta ndryshojmë fjalëkalimin. Ju lutemi provoni përsëri.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  // Trajto verifikimin fillestar të email-it.
  async function handleEmailVerification() {
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await applyActionCode(auth, oobCode);

      setSuccess(
        "Adresa juaj e email-it u verifikua me sukses. Tani mund të ktheheni në Gjejnjerin."
      );

      setValidCode(false);
    } catch (err) {
      console.error("Email verification failed:", err);

      if (
        err.code === "auth/expired-action-code" ||
        err.code === "auth/invalid-action-code"
      ) {
        setError(
          "Kjo lidhje verifikimi ka skaduar ose është përdorur më parë."
        );
      } else {
        setError("Nuk arritëm ta verifikojmë email-in tuaj. Ju lutemi provoni përsëri.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  // Trajto ndryshimin e email-it të llogarisë.
  async function handleEmailChange() {
    setError("");
    setSuccess("");
    setSubmitting(true);

    let firebaseChangeApplied = false;

    try {
      // Merr email-in e ri nga kodi i veprimit para se ta aplikosh.
      const info = await checkActionCode(auth, oobCode);

      if (info.operation !== "VERIFY_AND_CHANGE_EMAIL") {
        throw new Error("Ky nuk është një kod i vlefshëm për ndryshimin e email-it.");
      }

      const newEmail = info.data.email;

      if (!newEmail) {
        throw new Error("Nuk arritëm ta gjejmë adresën e re të email-it.");
      }

      // Përfundo ndryshimin e email-it në Firebase Authentication.
      await applyActionCode(auth, oobCode);
      firebaseChangeApplied = true;

      // Mbaj të sinkronizuar workers/{uid}.email me Firebase Auth.
      const functions = getFunctions(undefined, "us-central1");
      const syncWorkerEmail = httpsCallable(
        functions,
        "syncWorkerEmailAfterChange"
      );

      try {

          if (!auth.currentUser) {
    throw new Error(
      "Nuk ka sesion aktiv. Për sinkronizimin e profilit duhet të jeni të kyçur."
    );
  }

  // Rifresko gjendjen e autentifikimit të përdoruesit.
  await auth.currentUser.reload();
  await auth.currentUser.getIdToken(true); 
        await syncWorkerEmail({ email: newEmail });

        setSuccess(
          "Adresa juaj e email-it u ndryshua me sukses. Tani mund të hyni në llogarinë tuaj me email-in e ri."
        );
      } catch (syncError) {
        console.error("Worker email synchronization failed:", syncError);

        setSuccess(
          "Email-i juaj në Firebase u ndryshua me sukses, por profili juaj nuk arriti të sinkronizohej. Ju lutemi kontaktoni mbështetjen nëse të dhënat e llogarisë nuk përditësohen."
        );
      }

      setEmail(newEmail);
      setValidCode(false);
    } catch (err) {
      console.error("Email change failed:", err);

      if (firebaseChangeApplied) {
        setError(
          "Email-i juaj u ndryshua, por një veprim pasues dështoi. Ju lutemi kontaktoni mbështetjen nëse profili juaj ende shfaq email-in e vjetër."
        );
      } else if (
        err.code === "auth/expired-action-code" ||
        err.code === "auth/invalid-action-code"
      ) {
        setError(
          "Kjo lidhje për ndryshimin e email-it ka skaduar ose është përdorur më parë. Ju lutemi kërkoni një lidhje të re."
        );
      } else {
        setError(
          "Nuk arritëm ta ndryshojmë email-in tuaj. Ju lutemi provoni përsëri ose kërkoni një lidhje të re."
        );
      }
    } finally {
      setSubmitting(false);
    }
  }

  const isReset = currentAction === "resetPassword";
  const isVerify = currentAction === "verifyEmail";

  return (
    <main className={styles.loginWrap}>
      <section className={styles.card}>
        <Link to="/" className={styles.emailLogoLink}>
          <img
            className={styles.emailLogo}
            src="https://gjejnjerin.com/assets/Logo2-GOoX1SOo.png"
            alt="Gjejnjerin"
          />
        </Link>

        {loading ? (
          <>
            <h1 className={styles.title}>Duke kontrolluar lidhjen...</h1>
            <p className={styles.emailDescription}>
              Ju lutemi prisni derisa të verifikojmë lidhjen tuaj të email-it.
            </p>
          </>
        ) : (
          <>
            <h1 className={styles.title}>
              {isReset
                ? "Rivendos fjalëkalimin"
                : isEmailChange
                  ? "Konfirmo ndryshimin e email-it"
                  : isVerify
                    ? "Verifiko email-in"
                    : "Veprimi i llogarisë"}
            </h1>

            <p className={styles.emailDescription}>
              {isReset
                ? "Zgjidhni një fjalëkalim të ri për llogarinë tuaj në Gjejnjerin."
                : isEmailChange
                  ? "Konfirmoni që dëshironi të ndryshoni email-in e llogarisë suaj në Gjejnjerin në adresën e re më poshtë."
                  : isVerify
                    ? "Konfirmoni adresën tuaj të email-it për të përfunduar verifikimin."
                    : "Ky veprim i email-it nuk mbështetet."}
            </p>

            {email && (isReset || isEmailChange) && (
              <p className={styles.emailAddress}>
                {isEmailChange ? "Email-i i ri:" : "Llogaria:"}{" "}
                <strong>{email}</strong>
              </p>
            )}

            {error && (
              <div className={styles.errorMessage} role="alert">
                {error}
              </div>
            )}

            {success && (
              <div className={styles.resetMessage} role="status">
                {success}
              </div>
            )}

            {validCode && isReset && !success && (
              <form
                className={styles.form}
                onSubmit={handlePasswordReset}
              >
                <div className={styles.inputGroup}>
                  <label
                    className={styles.label}
                    htmlFor="new-password"
                  >
                    Fjalëkalimi i ri
                  </label>

                  <input
                    id="new-password"
                    className={styles.input}
                    type="password"
                    autoComplete="new-password"
                    placeholder="Shkruani fjalëkalimin e ri"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    minLength={6}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label
                    className={styles.label}
                    htmlFor="confirm-password"
                  >
                    Konfirmo fjalëkalimin e ri
                  </label>

                  <input
                    id="confirm-password"
                    className={styles.input}
                    type="password"
                    autoComplete="new-password"
                    placeholder="Shkruani përsëri fjalëkalimin"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(event.target.value)
                    }
                    minLength={6}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className={styles.spinner} />
                  ) : (
                    "Rivendos fjalëkalimin"
                  )}
                </button>
              </form>
            )}

            {validCode && isVerify && (
              <button
                type="button"
                className={styles.submitButton}
                onClick={handleEmailVerification}
                disabled={submitting}
              >
                {submitting ? (
                  <span className={styles.spinner} />
                ) : (
                  "Verifiko email-in"
                )}
              </button>
            )}

            {validCode && isEmailChange && (
              <button
                type="button"
                className={styles.submitButton}
                onClick={handleEmailChange}
                disabled={submitting}
              >
                {submitting ? (
                  <span className={styles.spinner} />
                ) : (
                  "Konfirmo ndryshimin e email-it"
                )}
              </button>
            )}

            {(success || error) && (
              <div className={styles.registerRow}>
                <Link to="/login" className={styles.textBtn}>
                  Kthehu te kyçja
                </Link>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}