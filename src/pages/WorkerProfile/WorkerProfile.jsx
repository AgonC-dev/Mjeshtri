import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from "../../api/firebase.js";
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import WhatsAppButton from '../../components/WhatsAppButton/WhatsAppButton'
import styles from './WorkerProfile.module.css'
import { useEffect, useState } from 'react';

// Mock data - in a real app, this would come from an API

function WorkerProfile() {
  const { fullName } = useParams()
  const navigate = useNavigate();
  const location = useLocation();
  
  const [worker, setWorker] = useState(location.state.workerData || null)
  const [loading, setLoading] = useState(!worker);

  useEffect(() => {

     if (!worker) {
      const fetchWorkerByName = async () => {
        setLoading(true);
        try {
          const q = query(collection(db, "workers"), where("fullName", "==", fullName));
          const querySnapShot = await getDocs(q);
         
          if (!querySnapShot.empty) {
            setWorker(querySnapShot.docs[0].data());
          }

        } catch (err) {
          console.error("Error fetching worker:", err);
        } finally {
          setLoading(false)
        }
      }
      
      fetchWorkerByName();
  }

  },[fullName])

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

      <div className={styles.ctaSection}>
        <WhatsAppButton phoneNumber={worker.phoneNumber} />
      </div>
    </div>
  )
}

export default WorkerProfile
