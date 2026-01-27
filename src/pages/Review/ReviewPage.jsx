import { 
  addDoc, 
  collection, 
  doc, 
  getDoc, 
  updateDoc, 
  serverTimestamp ,
  runTransaction, 
  increment
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../api/firebase";
import styles from './ReviewPage.module.css';

export default function ReviewPage() {
  const { token } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tokenData, setTokenData] = useState(null);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0); // For star hover effect
  const [comment, setComment] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    console.log("Effect started")
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
    console.log("Effect finished")
  }, [token]);

  async function handleSubmit(e) {
  e.preventDefault();
  if(!tokenData || isSubmitting) return;

  try {
    setIsSubmitting(true);
    
    // 1. Setup the "Addresses" (References)
    const workerRef = doc(db, "workers", tokenData.workerId);
    const tokenRef = doc(db, "reviewRequests", token);
    const newReviewRef = doc(collection(db, "reviews")); 

    // 2. Start the Transaction - Everything inside these { } is protected
    await runTransaction(db, async (transaction) => {
      
      // STEP A: The READS (Must be first)
      const tokenSnap = await transaction.get(tokenRef);
      
      // We don't necessarily need workerSnap unless you want to check if the worker exists,
      // but let's keep it simple.

      if (!tokenSnap.exists() || tokenSnap.data().status === "used") {
        // Throwing an error inside a transaction cancels everything automatically
        throw new Error("Ky link është përdorur tashmë ose nuk ekziston.");
      }

      // STEP B: The WRITES (These are now INSIDE the transaction block)
      
      // Create the review document
      transaction.set(newReviewRef, {
        workerId: tokenData.workerId,
        rating: rating,
        comment: comment.trim(),
        customerName: customerName.trim() || "Klient i Verifikuar",
        token: token,
        createdAt: serverTimestamp(),
      });

      // Update the Worker totals
      transaction.update(workerRef, {
        reviewCount: increment(1),
        totalRatingPoints: increment(rating)
      });

      // Disable the token
      transaction.update(tokenRef, {
        status: "used",
        usedAt: serverTimestamp(),
      });
    });

    // If we get here, the transaction was successful!
    setSubmitted(true);

  } catch (err) {
    console.error("Transaction failed: ", err);
    // err.message will catch the "Ky link është përdorur..." error we threw above
    setError(err.message || "Dështoi dërgimi i vlerësimit. Provoni përsëri.");
  } finally {
    setIsSubmitting(false);
  }
}
  
// --- Loading Return ---
  if (loading) {
    return (
      <div className={styles.centered}>
        <div className={styles.loader}></div>
        <p className={styles.loadingText}>Duke u sinkronizuar...</p>
      </div>
    );
  }

  // --- Error Return ---
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

  // --- Success Return ---
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

  // --- Main Form Return ---
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
      </div>
    </div>
  );
}