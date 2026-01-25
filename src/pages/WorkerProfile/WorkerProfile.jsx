import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from "../../api/firebase.js";
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import WhatsAppButton from '../../components/WhatsAppButton/WhatsAppButton'
import styles from './WorkerProfile.module.css'
import { useEffect, useState } from 'react';

// Mock data - in a real app, this would come from an API

function WorkerProfile() {
  const { id } = useParams()
  const navigate = useNavigate();
  const location = useLocation();
  
  const [worker, setWorker] = useState(location.state.workerData || null)
  const [loading, setLoading] = useState(!worker);
  const [reviews, setReviews] = useState([]);
useEffect(() => { 
  window.scroll(0, 0);

  const fetchWorkerAndReviews = async () => {
    // We only set loading to true if we don't have worker data yet
    if (!worker) setLoading(true); 

    try {
      // 1. Fetch Worker Details only if missing
      if (!worker) {
        const docRef = doc(db, "workers", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setWorker(docSnap.data());
        }
      }

      // 2. Fetch Reviews (ALWAYS run this)
      console.log("Fetching reviews for worker:", id); // Debug log
      
            const q = query(
             collection(db, "reviews"),
             where("workerId", "==", id),
             orderBy("createdAt", "desc")
            );
      
      const querySnapshot = await getDocs(q);
      const reviewsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setReviews(reviewsData);

    } catch (err) {
      console.error("Error fetching reviews:", err);
      // If you get an error here, it's likely the missing Index link!
    } finally {
      setLoading(false);
    }
  };

  fetchWorkerAndReviews();
}, [id]); // Only re-run if the ID in the URL changes

  if (loading) return <div className={styles.loading}>Duke u ngarkuar...</div>;

  if (!worker) {
    return (
      <div className={styles.notFound}>
        <p>Mjeshtri nuk u gjet.</p>
        <button onClick={() => navigate('/workers')} className={styles.backButton}>
          Kthehu te lista
        </button>
      </div>
    )
  }

const averageRating = (worker.reviewCount && worker.totalRatingPoints) 
  ? (worker.totalRatingPoints / worker.reviewCount).toFixed(1) 
  : 0;

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const stars = []

    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i}>⭐</span>)
    }
    if (hasHalfStar) {
      stars.push(<span key="half">✨</span>)
    }
    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`}>☆</span>)
    }
    return stars
  }

  return (
    <div className={styles.profile}>
      <div className={styles.header}>
        <div className={styles.imageContainer}>
          <img src={worker.profilePic} alt={worker.name} className={styles.image} />
          <div className={styles.onlineBadge}></div>
        </div>
        <div className={styles.info}>
          <h1 className={styles.name}>{worker.fullName}</h1>
          <p className={styles.category}>{worker.category}</p>
          <p className={styles.city}>{worker.city}</p>
          <div className={styles.rating}>
  <span className={styles.stars}>{renderStars(averageRating)}</span>
  
  <span className={styles.ratingValue}>
    {averageRating > 0 ? averageRating : "Pa vlerësime"}
  </span>

  {/* Only show the count if there are reviews */}
  {worker.reviewCount > 0 && (
    <span className={styles.reviewCount}>
      {worker.reviewCount} {worker.reviewCount === 1 ? 'vlerësim' : 'vlerësime'}
    </span>
  )}
</div>
          {worker.bio &&   
            <div className={styles.bio}>
              <p>{worker.bio}</p>
            </div>}
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{worker.whatsappRequests}</div>
          <div className={styles.statLabel}>Klientë të interesuar</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{worker.experienceYears}</div>
          <div className={styles.statLabel}>Vite përvojë</div>
        </div>
      </div>

      <div className={styles.portfolioGrid}>
  {/* Add a check to see if portfolio exists and has items */}
       <section className={styles.portfolioSection}>
  {worker.portfolio && worker.portfolio.length > 0 && (
    <>
      <h2 className={styles.portfolioTitle}>Portofoli i punimeve</h2>
      <div className={styles.portfolioFlex}>
        {worker.portfolio.map((image, index) => (
          <div key={index} className={styles.portfolioItem}>
            <img 
              src={image} 
              alt={`Punë ${index + 1}`} 
              className={styles.portfolioImage} 
            />
          </div>
        ))}
      </div>
    </>
  )}
</section>
</div>
{/* REVIEWS SECTION */}
 <section className={styles.reviewsSection}>
  <div className={styles.reviewHeaderMain}>
    <h2 className={styles.sectionTitle}>Eksperiencat e Klientëve</h2>
    <span className={styles.reviewCount}>{ reviews?.length === 1 ? "1 Vlerësim" : `${reviews?.length} Vlerësime` }</span>
  </div>

  <div className={styles.reviewsGrid}>
    {reviews.length === 0 ? (
      <div className={styles.emptyState}>Nuk ka vlerësime ende.</div>
    ) : (
      reviews.map((r, index) => (
        <div key={r.id} className={styles.reviewCard} style={{ "--delay": `${index * 0.1}s` }}>
          <div className={styles.reviewTop}>
            <div className={styles.starBadge}>
              <span className={styles.starIcon}>★</span>
              <span className={styles.ratingNumber}>{r.rating}</span>
            </div>
            <div className={styles.verifiedTag}>I Verifikuar</div>
          </div>
          
          <p className={styles.comment}>{r.comment}</p>
          
          <div className={styles.reviewFooter}>
            <div className={styles.customerInfo}>
              <div className={styles.avatarMini}>{r.customerName?.[0] || "K"}</div>
              <strong>{r.customerName || "Klient"}</strong>
            </div>
            <span className={styles.reviewDate}>
               {r.createdAt?.toDate ? r.createdAt.toDate().toLocaleDateString('sq-AL') : "Sot"}
            </span>
          </div>
        </div>
      ))
    )}
  </div>
</section>

      <div className={styles.ctaSection}>
        <WhatsAppButton id={worker.id || worker.uid} phoneNumber={worker.phoneNumber} />
      </div>
    </div>
  )
}

export default WorkerProfile
