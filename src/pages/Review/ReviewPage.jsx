import { addDoc, collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../api/firebase";

export default function ReviewPage() {
    const { token } = useParams();
    
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tokenData, setTokenData] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);


  useEffect(() => {
    async function load() {
        try {
            const tokenRef = doc(db, "reaviewRequests", token);
            const snap = await getDoc(tokenRef);

            if(!snap.exists()) {
                setError("Link i pavlefshëm.");
                return;
            }

            const data = snap.data();
            if (data.status === "used") {
                setError("Ky link është përdorur tashmë.");
               return;
            }

            setTokenData(data);
        } catch (err) {
            console.error(err);
            setError("Ndodhi një gabim.");
        } finally {
            setLoading(false)
        }
    }

    load();
  }, [token])


  async function handleSubmit(e) {
    e.preventDefault();
    if(!tokenData) return;

    try {
        await addDoc(collection(db, "reviews"), {
          workerId: tokenData.workerId,
          rating,
          comment,
          createdAt: serverTimestamp(),
        })

        await updateDoc(doc(db, "reviewRequests", token), {
            status: "used",
            usedAt: serverTimestamp(),
        });

        setSubmitted(true);
    } catch (err) {
        console.error(err);
         setError("Dështoi dërgimi i vlerësimit.");
    }

  }
  
  
  if (loading) return <p>Duke u ngarkuar...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  
  
   if (submitted) {
    return (
      <div className={styles.success}>
        <h2>Faleminderit! ⭐</h2>
        <p>Vlerësimi juaj u dërgua me sukses.</p>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <h2>Vlerësoni Mjeshtrin</h2>
      <div className={styles.workerInfo}>
        {tokenData.workerPic && <img src={tokenData.workerPic} alt="worker" />}
        <p><strong>{tokenData.workerName}</strong></p>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <label>Vlerësimi (1–5)</label>
        <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
          {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ★</option>)}
        </select>

        <label>Koment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Shkruani përvojën tuaj..."
        />

        <button type="submit">Dërgo Vlerësimin</button>
      </form>
    </div>
  );

}