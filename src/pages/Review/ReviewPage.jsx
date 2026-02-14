import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../api/firebase";
import styles from './ReviewPage.module.css';
import { httpsCallable, getFunctions } from "firebase/functions";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const functions = getFunctions();

export default function ReviewPage() {
  const { token } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tokenData, setTokenData] = useState(null);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0); 
  const [comment, setComment] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inputPhone, setInputPhone] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const tokenRef = doc(db, "reviewRequests", token);
        const snap = await getDoc(tokenRef);

        if (!snap.exists()) {
          setError("Link i pavlefshëm ose i skaduar.");
          return;
        }

        const data = snap.data();
        if (data.status === "used") {
          setError("Ky link është përdorur tashmë. Faleminderit për vlerësimin tuaj!");
          return;
        }

        setTokenData(data);
      } catch (err) {
        console.error(err);
        setError("Ndodhi një gabim gjatë ngarkimit të faqes.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  function handleCheckPhone() {
    const cleanInput = inputPhone.replace(/\D/g, "");
    const cleanTarget = tokenData.customerPhone.replace(/\D/g, "");

    // Checking for exact match or suffix match (to handle country code variations)
    if (cleanInput === cleanTarget || cleanInput.endsWith(cleanTarget) || cleanTarget.endsWith(cleanInput)) {
      setIsVerified(true);
      setError("");
      setPhoneError("");
    } else {
      setPhoneError("Numri nuk përputhet me kërkesën.");
      return;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!tokenData || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const submitReviewFn = httpsCallable(functions, "submitReview");

      await submitReviewFn({
        token: token,
        rating: rating,
        comment: comment.trim(),
        customerName: customerName.trim(),
        inputPhone: inputPhone.replace(/\D/g, "") // Send clean phone to backend
      });

      setSubmitted(true);
    } catch (err) {
      console.error("Transaction failed: ", err);
      setError(err.message || "Dështoi dërgimi i vlerësimit. Provoni përsëri.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className={styles.centered}>
        <div className={styles.loader}></div>
        <p className={styles.loadingText}>Duke u sinkronizuar...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorCard}>
          <span className={styles.errorIcon}>⚠️</span>
          <p className={styles.errorText}>{error}</p>
          <button onClick={() => window.location.reload()} className={styles.retryBtn}>
            Provo përsëri
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className={styles.container}>
        <div className={`${styles.card} ${styles.successCard}`}>
          <div className={styles.successIcon}>🎉</div>
          <h2>Vlerësimi u dërgua!</h2>
          <p>Faleminderit që ndihmoni komunitetin tonë të rritet.</p>
          <button 
            onClick={() => window.location.href = '/'} 
            className={styles.homeBtn}
            style={{ marginTop: '2rem' }}
          >
            Kthehu në Ballinë
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h2>Lini një Vlerësim</h2>
          <p>Eksperienca juaj me mjeshtrin:</p>
          <div className={styles.workerBadge}>
            {tokenData?.workerPic ? (
              <img src={tokenData.workerPic} alt="" className={styles.workerImg} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                {tokenData?.workerName ? tokenData.workerName[0] : "?"}
              </div>
            )}
            <span className={styles.workerName}>{tokenData?.workerName}</span>
          </div>
        </header>

        {!isVerified ? (
          /* --- Step 1: Verification UI --- */
          <div className={styles.verifySection}>
            <label className={styles.verifyLabel}>
              Verifikoni numrin e telefonit për të vazhduar:
            </label>
            <div className={styles.phoneWrapper}>
              <PhoneInput
                country={'xk'}
                value={inputPhone}
                onChange={setInputPhone}
                inputClass={styles.phoneInputCustom}
                containerClass={styles.phoneContainerCustom}
              />
            </div>
            {phoneError && <p className={styles.phoneErrorText}>{phoneError}</p>}
            <button 
              type="button" 
              onClick={handleCheckPhone} 
              className={styles.submitBtn}
              style={{ marginTop: '1rem' }}
            >
              Verifiko & Vazhdo
            </button>
          </div>
        ) : (
          /* --- Step 2: The Actual Review Form --- */
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.ratingGroup}>
              <label style={{textAlign: 'center', display: 'block', color: '#888', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '8px'}}>
                Si do ta vlerësonit punën?
              </label>
              <div className={styles.starRating}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={star <= (hover || rating) ? styles.starActive : styles.starInactive}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Emri juaj (Opsionale)</label>
              <input 
                type="text" 
                value={customerName} 
                onChange={(e) => setCustomerName(e.target.value)} 
                placeholder="Psh: Filan Fisteku"
                className={styles.textField}
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Komenti juaj</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Shpjegoni shkurtimisht çfarë ju pëlqeu..."
                required
                className={styles.textareaField}
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                  <div className={styles.loader} style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div>
                  Dërgimi...
                </div>
              ) : "Dërgo Vlerësimin"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}