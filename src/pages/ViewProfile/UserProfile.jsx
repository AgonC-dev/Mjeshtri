import { getDoc, doc, query, collection, orderBy, where, getDocs } from 'firebase/firestore';
import { db, auth } from "../../api/firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import WhatsAppButton from '../../components/WhatsAppButton/WhatsAppButton'
import styles from './UserProfile.module.css'
import { useEffect, useState } from 'react';
import Loading from '../../components/Loading/Loading.jsx';

// Mock data - in a real app, this would come from an API

function UserProfile() {
const { id: urlId } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Used to catch passed state
  
  const [worker, setWorker] = useState(location.state?.workerData || null);
  const [loading, setLoading] = useState(!worker);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState([]);
  

useEffect(() => {
const unsub = onAuthStateChanged(auth, (currentUser) => {
    const activeID = urlId || currentUser?.uid

    if(!activeID) {
        if(!urlId && !location.state?.workerData) {
            setLoading(false);
            navigate('/login')
        }
        return;
    }

    const fetchWorkerById =  async () => {
        try {
            setLoading(true);
            const docRef = doc(db, "workers", activeID);
            const docSnap = await getDoc(docRef);

            if(docSnap) {
                setWorker(docSnap.data())
            }

            const q = query(
             collection(db, "reviews"),
             where("workerId", "==", activeID),
             orderBy("createdAt", "desc")
            );

            const querySnapshot = await getDocs(q);
            setReviews(querySnapshot.docs.map(d => ({ id: d.id, ...d.data() })));

        } catch (err) {
            setError('Ups! Nuk mundëm të gjenim profilin e mjeshtrit. Sigurohuni që linku është i saktë.')
        } finally {
            setLoading(false);
        }
    } 

    fetchWorkerById();
});

return () => unsub();

}, [urlId]); // Only watch 'id'


if (loading) {
  return <Loading />
}

if (error) {
  return (
    <div className={styles.errorOverlay}>
      <div className={styles.errorCard}>
        {/* Using a simple SVG or Icon that matches the clean theme */}
        <div style={{fontSize: '3rem'}}>🛠️</div> 
        <h2 className={styles.errorTitle}>Lidhja dështoi</h2>
        <p className={styles.errorText}>
          Nuk mundëm të siguronim të dhënat e mjeshtrit për momentin. 
          Ju lutem kontrolloni internetin ose provoni përsëri.
        </p>
        <button className={styles.refreshBtn} onClick={() => window.location.reload()}>
          PROVO PËRSËRI
        </button>
      </div>
    </div>
  );
}

  
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
          <img src={worker.profilePic || worker.profileUrl || 'https://via.placeholder.com/150'} alt={worker.name} className={styles.image} />
          <div className={styles.onlineBadge}></div>
        </div>
        <div className={styles.info}>
          <h1 className={styles.name}>{worker.fullName}</h1>
          <p className={styles.category}>{worker.category}</p>
          <p className={styles.city}>{worker.city}</p>
          <div className={styles.rating}>
            <span className={styles.stars}>{renderStars(worker.rating)}</span>
            <span className={styles.ratingValue}>{worker.rating}</span>
          </div>
          {worker.bio &&   
            <div className={styles.bio}>
              <p>{worker.bio}</p>
            </div>}
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{worker.completedJobs}</div>
          <div className={styles.statLabel}>Punë të përfunduara</div>
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
        <WhatsAppButton phoneNumber={worker.phoneNumber} />
      </div>
    </div>
  )
}

export default UserProfile
