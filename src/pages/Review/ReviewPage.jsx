import { addDoc, collection, doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
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

  async function handleSubmit(e) {
    e.preventDefault();
    if(!tokenData || isSubmitting) return;

    try {
        setIsSubmitting(true);
        // 1. Create the Review
        await addDoc(collection(db, "reviews"), {
          workerId: tokenData.workerId,
          rating,
          comment: comment.trim(),
          customerName: customerName.trim() || "Klient i Verifikuar",
          token: token,
          createdAt: serverTimestamp(),
        });

        // 2. Mark token as used
        await updateDoc(doc(db, "reviewRequests", token), {
            status: "used",
            usedAt: serverTimestamp(),
        });

        setSubmitted(true);
    } catch (err) {
        console.error(err);
        setError("Dështoi dërgimi i vlerësimit. Provoni përsëri.");
    } finally {
        setIsSubmitting(false);
    }
  }
  
  if (loading) return <div className={styles.centered}><p>Duke u ngarkuar...</p></div>;
  if (error) return <div className={styles.centered}><p className={styles.errorText}>{error}</p></div>;
  
  if (submitted) {
    return (
      <div className={styles.successCard}>
        <div className={styles.successIcon}>🎉</div>
        <h2>Vlerësimi u dërgua!</h2>
        <p>Faleminderit që ndihmoni komunitetin tonë të rritet.</p>
        <button onClick={() => window.location.href = '/'} className={styles.homeBtn}>Kthehu në Ballinë</button>
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
            {tokenData.workerPic ? (
              <img src={tokenData.workerPic} alt="" className={styles.workerImg} />
            ) : (
              <div className={styles.avatarPlaceholder}>{tokenData.workerName[0]}</div>
            )}
            <span className={styles.workerName}>{tokenData.workerName}</span>
          </div>
        </header>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.ratingGroup}>
            <label>Si do ta vlerësonit punën?</label>
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
            {isSubmitting ? "Duke u dërguar..." : "Dërgo Vlerësimin"}
          </button>
        </form>
      </div>
    </div>
  );
}