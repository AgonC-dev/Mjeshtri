
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

  // Validate the Firebase action code when the page opens.
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
          "This link is incomplete. Please open the full link from your email."
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
            throw new Error("Unexpected email action code.");
          }

          if (!cancelled) {
            setValidCode(true);
          }
        } else if (isEmailChange) {
          const info = await checkActionCode(auth, oobCode);

          if (info.operation !== "VERIFY_AND_CHANGE_EMAIL") {
            throw new Error(
              "This code is not for changing an email address."
            );
          }

          if (!cancelled) {
            setEmail(info.data.email || "");
            setValidCode(true);
          }
        } else {
          if (!cancelled) {
            setError("This email action is not supported.");
          }
        }
      } catch (err) {
        console.error("Email action code validation failed:", err);

        if (!cancelled) {
          setError(
            "This link is invalid, expired, or has already been used. Please request a new link."
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

  // Handle password reset.
  async function handlePasswordReset(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 6) {
      setError("Your password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      await confirmPasswordReset(auth, oobCode, password);

      setSuccess(
        "Your password has been reset successfully. You can now log in with your new password."
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
          "This reset link has expired or has already been used. Please request a new one."
        );
      } else if (err.code === "auth/weak-password") {
        setError("Please choose a stronger password.");
      } else {
        setError("We could not reset your password. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  // Handle initial email verification.
  async function handleEmailVerification() {
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await applyActionCode(auth, oobCode);

      setSuccess(
        "Your email address has been verified successfully. You can now return to Gjejnjerin."
      );

      setValidCode(false);
    } catch (err) {
      console.error("Email verification failed:", err);

      if (
        err.code === "auth/expired-action-code" ||
        err.code === "auth/invalid-action-code"
      ) {
        setError(
          "This verification link has expired or has already been used."
        );
      } else {
        setError("We could not verify your email. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  // Handle changing the account email.
  async function handleEmailChange() {
    setError("");
    setSuccess("");
    setSubmitting(true);

    let firebaseChangeApplied = false;

    try {
      // Get the new email from the action code before applying it.
      const info = await checkActionCode(auth, oobCode);

      if (info.operation !== "VERIFY_AND_CHANGE_EMAIL") {
        throw new Error("This is not a valid email-change code.");
      }

      const newEmail = info.data.email;

      if (!newEmail) {
        throw new Error("The new email address could not be found.");
      }

      // This completes the email change in Firebase Authentication.
      await applyActionCode(auth, oobCode);
      firebaseChangeApplied = true;

      // Keep workers/{uid}.email synchronized with Firebase Auth.
      const functions = getFunctions(undefined, "us-central1");
      const syncWorkerEmail = httpsCallable(
        functions,
        "syncWorkerEmailAfterChange"
      );

      try {
        await syncWorkerEmail({ email: newEmail });

        setSuccess(
          "Your email address has been changed successfully. You can now use your new email to log in."
        );
      } catch (syncError) {
        console.error("Worker email synchronization failed:", syncError);

        setSuccess(
          "Your Firebase email has been changed successfully, but your worker profile could not be synchronized. Please contact support if your account details do not update."
        );
      }

      setEmail(newEmail);
      setValidCode(false);
    } catch (err) {
      console.error("Email change failed:", err);

      if (firebaseChangeApplied) {
        setError(
          "Your email was changed, but a follow-up operation failed. Please contact support if your profile still shows the old email."
        );
      } else if (
        err.code === "auth/expired-action-code" ||
        err.code === "auth/invalid-action-code"
      ) {
        setError(
          "This email-change link has expired or has already been used. Please request a new email-change link."
        );
      } else {
        setError(
          "We could not change your email. Please try again or request a new link."
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
            <h1 className={styles.title}>Checking your link...</h1>
            <p className={styles.emailDescription}>
              Please wait while we verify your email link.
            </p>
          </>
        ) : (
          <>
            <h1 className={styles.title}>
              {isReset
                ? "Reset your password"
                : isEmailChange
                  ? "Confirm email change"
                  : isVerify
                    ? "Verify your email"
                    : "Account action"}
            </h1>

            <p className={styles.emailDescription}>
              {isReset
                ? "Choose a new password for your Gjejnjerin account."
                : isEmailChange
                  ? "Confirm that you want to change your Gjejnjerin account to the new email address below."
                  : isVerify
                    ? "Confirm your email address to complete verification."
                    : "This email action is not supported."}
            </p>

            {email && (isReset || isEmailChange) && (
              <p className={styles.emailAddress}>
                {isEmailChange ? "New email:" : "Account:"}{" "}
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
                    New password
                  </label>

                  <input
                    id="new-password"
                    className={styles.input}
                    type="password"
                    autoComplete="new-password"
                    placeholder="Enter your new password"
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
                    Confirm new password
                  </label>

                  <input
                    id="confirm-password"
                    className={styles.input}
                    type="password"
                    autoComplete="new-password"
                    placeholder="Enter your password again"
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
                    "Reset password"
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
                  "Verify email"
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
                  "Confirm email change"
                )}
              </button>
            )}

            {(success || error) && (
              <div className={styles.registerRow}>
                <Link to="/login" className={styles.textBtn}>
                  Return to login
                </Link>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
