import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from "../../api/firebase.js";
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import WhatsAppButton from '../../components/WhatsAppButton/WhatsAppButton'
import styles from './WorkerProfile.module.css'
import { useEffect, useState } from 'react';

// Mock data - in a real app, this would come from an API

function WorkerProfile() {
  const { id, slug } = useParams()
  const navigate = useNavigate();
  const location = useLocation();
  
  const [worker, setWorker] = useState(location.state?.workerData || null)
  const [loading, setLoading] = useState(!worker);
  const [reviews, setReviews] = useState([]);
useEffect(() => { 
  window.scroll(0, 0);

 const fetchWorkerAndReviews = async () => {
  if (!worker) setLoading(true);

  try {
    let finalWorkerData = worker;

    // 1. GET THE WORKER
    if (!finalWorkerData) {
      if (id) {
        // DIRECT HIT (Fastest)
        const docRef = doc(db, "workers", id);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          finalWorkerData = { id: snap.id, ...snap.data() };
        }
      } else if (slug) {
        // QUERY (Necessary for slugs)
        const q = query(collection(db, "workers"), where("slug", "==", slug));
        const qSnap = await getDocs(q);
        if (!qSnap.empty) {
          finalWorkerData = { id: qSnap.docs[0].id, ...qSnap.docs[0].data() };
        }
      }
    }

    if (finalWorkerData) {
      setWorker(finalWorkerData);

      // 2. GET THE REVIEWS (Always a query because one worker has many reviews)
      const qReviews = query(
        collection(db, "reviews"),
        where("workerId", "==", finalWorkerData.id), // Use the ID we just found
        orderBy("createdAt", "desc")
      );
      const revSnap = await getDocs(qReviews);
      setReviews(revSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  fetchWorkerAndReviews();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [id]);

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

  const VerifiedBadge = ({ size = 18 }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={styles.badge}
  >
    {/* The "Burst" Shape */}
    <path 
      d="M9.707 2.13a3 3 0 014.586 0l.867.996a1 1 0 00.755.343l1.319-.015a3 3 0 013.243 3.243l-.015 1.319a1 1 0 00.343.755l.996.867a3 3 0 010 4.586l-.996.867a1 1 0 00-.343.755l.015 1.319a3 3 0 01-3.243 3.243l-1.319-.015a1 1 0 00-.755.343l-.867.996a3 3 0 01-4.586 0l-.867-.996a1 1 0 00-.755-.343l-1.319.015a3 3 0 01-3.243-3.243l.015-1.319a1 1 0 00-.343-.755l-.996-.867a3 3 0 010-4.586l.996-.867a1 1 0 00.343-.755l-.015-1.319a3 3 0 013.243-3.243l1.319.015a1 1 0 00.755-.343l.867-.996z" 
      fill="#0095f6" /* The classic Instagram Blue */
    />
    {/* The Checkmark */}
    <path 
      d="M17.333 9.333L10.933 15.733L7.733 12.533" 
      stroke="white" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </svg>
);

  return (
    <div className={styles.profile}>
      <div className={styles.header}>
        <div className={styles.imageContainer}>
          <img src={worker.profilePic} alt={worker.name} className={styles.image} />
          <div className={styles.onlineBadge}></div>
        </div>
        <div className={styles.info}>
          <h1 className={styles.name}>
            {worker.fullName} 
            {worker.isPro && <VerifiedBadge size={22} />}
          </h1>
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
  {/* WhatsApp Stat Card */}
  <div className={styles.statCard}>
    <div className={styles.statHeader}>
      {/* The big number is now the SUM of clicks and reviews */}
      <div className={styles.statValue}>
        {(worker.whatsappRequests || 0) + (reviews?.length || 0)}
      </div>
      <div className={styles.infoTooltip}>
        <span className={styles.infoIcon}>?</span>
        <span className={styles.tooltipText}>
          Ky profil monitorohet automatikisht. Raporti mes klikimeve dhe vlerësimeve duhet të jetë logjik për të ruajtur statusin "I Verifikuar".
        </span>
      </div>
    </div>
    <div className={styles.statLabel}>Klientë të interesuar</div>
    
    {/* Transparency Breakdown */}
    <div className={styles.transparencyBreakdown}>
      <span>{worker.whatsappRequests || 0} Klikime</span>
      <span className={styles.dot}>•</span>
      <span>{reviews?.length || 0} Vlerësime</span>
    </div>

    <div className={styles.verificationBadge}>
      <span className={styles.checkIcon}>✓</span>
      Interaksione të Verifikuara
    </div>
  </div>

  {/* Experience Stat Card */}
  <div className={styles.statCard}>
    <div className={styles.statValue}>{worker.experienceYears}</div>
    <div className={styles.statLabel}>Vite përvojë</div>
    <div className={styles.verificationBadge}>
      <span className={styles.checkIcon}>✓</span>
      Përvojë e konfirmuar
    </div>
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
