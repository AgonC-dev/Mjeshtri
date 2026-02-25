import { getDoc, doc, query, collection, orderBy, where, getDocs } from 'firebase/firestore';
import { db, auth } from "../../api/firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import WhatsAppButton from '../../components/WhatsAppButton/WhatsAppButton'
import styles from './UserProfile.module.css'
import { useEffect, useState } from 'react';
import MapPin from '../../assets/Mappin.png';
import Loading from '../../components/Loading/Loading.jsx';
import Verified from '../../assets/verified.png';

// Mock data - in a real app, this would come from an API

function UserProfile() {
const { id: urlId } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Used to catch passed state
  
  const [worker, setWorker] = useState(location.state?.workerData || null);
  const [loading, setLoading] = useState(!worker);
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState([]);
  const disabled = true;

useEffect(() => {
  let isMounted = true; // Prevents memory leaks/state updates on unmounted component

  const fetchData = async (activeID) => {
    try {
      setLoading(true);
      
      // 1. Fetch Worker Profile
      const docRef = doc(db, "workers", activeID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && isMounted) {
        setWorker(docSnap.data());
      } else if (isMounted) {
        setError("Profil nuk u gjet.");
        return;
      }

      // 2. Fetch Approved Reviews
      const q = query(
        collection(db, "reviews"),
        where("workerId", "==", activeID),
        where("status", "==", "approved"),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      if (isMounted) {
        setReviews(querySnapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      }

    } catch (err) {
      console.error("Fetch Error:", err);
      if (isMounted) setError('Ups! Nuk mundëm të gjenim profilin.');
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  // Auth Listener to determine WHO we are looking at
  const unsub = onAuthStateChanged(auth, (currentUser) => {
    // Priority: 1. URL ID (/profile/123) 2. Passed State 3. Logged in User
    const activeID = urlId || location.state?.workerData?.uid || currentUser?.uid;

    if (activeID) {
      fetchData(activeID);
    } else {
      // No ID found anywhere - send to login
      setLoading(false);
      navigate('/login');
    }
  });

  return () => {
    isMounted = false;
    unsub();
  };
}, [urlId, navigate, location.state]); // Added missing dependencies // Only watch 'id'


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
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroBg} style={{ backgroundImage: `url(${worker.profilePic})` }}></div>
        <div className={styles.heroContent}>
          <div className={styles.heroMain}>
            <div className={styles.visualSide}>
              <div className={styles.imageFrame}>
                <img src={worker.profilePic} alt={worker.fullName} className={styles.mainAvatar} />
                <div className={styles.expTag}>
                   <span className={styles.expNum}>{worker.experienceYears || 0}+</span>
                   <span className={styles.expLabel}>VITE PËRVOJË</span>
                </div>
              </div>
            </div>

            <div className={styles.textSide}>
             
              <div className={styles.topBadges}>
                <span className={styles.catBadge}>{worker.category}</span>
                {worker.isPro && <span className={styles.verifiedPro}>PRO</span>}
                {worker.isVerified && <span className={styles.verifiedBadge}>
                   <img src={Verified} alt='verified badge' />
                </span>}
              </div>
              <h1 className={styles.heroTitle}>{worker.fullName}</h1>
              <div className={styles.heroStats}>
                <div className={styles.statItem}>
                  <img src={MapPin} alt="location" />
                  <span>{worker.city}, KS</span>
                </div>
                <div className={styles.statDivider}></div>
                <div className={styles.statItem}>
                  <span className={styles.starIcon}>★</span>
                  <span>{worker.rating || "5.0"} Score</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className={styles.bodyContainer}>
        <div className={styles.contentGrid}>
          <main className={styles.detailsArea}>
            <div className={styles.cardSection}>
              <h3 className={styles.miniTitle}>Rreth Meje</h3>
              <p className={styles.descriptionText}>{worker.bio || "Ky mjeshtër nuk ka shtuar ende një biografi."}</p>
            </div>

            {worker.portfolio?.length > 0 && (
              <div className={styles.cardSection}>
                <h3 className={styles.miniTitle}>Punimet e fundit</h3>
                <div className={styles.portfolioScrollContainer}>
                  <div className={styles.portfolioDisplay}>
                    {worker.portfolio.map((img, i) => (
                      <div key={i} className={styles.portfolioItem}>
                        <img src={img} alt={`Work ${i}`} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </main>

          <aside className={styles.bookingSidebar}>
            <div className={styles.stickyCard}>
              <div className={styles.priceHeader}>
                <p>Tarifa Fillestare</p>
                <h2>{worker.startingPrice ? `${worker.startingPrice}€` : "Me marrëveshje"}</h2>
              </div>
              <div className={styles.actionButtons}>
                <WhatsAppButton 
                  workerId={worker.id} 
                  phoneNumber={worker.phoneNumber} 
                  workerName={worker.fullName} 
                  disabled={disabled}
                />
                <a 
                  href={`https://wa.me/${worker.phoneNumber.replace(/\D/g, '')}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className={styles.secondaryCallBtn}
                >
                   Bisedo direkt
                </a>
              </div>
              <div className={styles.trustFooter}>
                <p>✓ Verifikuar nga Mjeshtri.ks</p>
                <p>✓ Reagim i shpejtë</p>
              </div>
            </div>
          </aside>
        </div>

        <section className={styles.feedbackSection}>
          <div className={styles.feedbackHeader}>
            <h2>Vlerësimet ({reviews.length})</h2>
          </div>
          <div className={styles.feedbackGrid}>
            {reviews.length > 0 ? (
              reviews.map((r) => (
                <div key={r.id} className={styles.modernReviewCard}>
                  <div className={styles.reviewScore}>
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < r.rating ? styles.starFilled : styles.starEmpty}>★</span>
                    ))}
                  </div>
                  <p className={styles.reviewText}>"{r.comment}"</p>
                  <div className={styles.reviewerInfo}>
                    <div className={styles.reviewerAvatar}>{r.customerName?.[0] || "?"}</div>
                    <div>
                      <p className={styles.reviewerName}>{r.customerName}</p>
                      <p className={styles.reviewDate}>
                        {r.createdAt?.toDate ? r.createdAt.toDate().toLocaleDateString('sq-AL') : "Sot"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.noReviews}>Ende nuk ka vlerësime për këtë mjeshtër.</p>
            )}
          </div>
        </section>
      </div>

      <div className={styles.mobileAction}>
        <div className={styles.mobileActionInner}>
          <div className={styles.mobilePricing}>
             <strong>{worker.startingPrice ? `${worker.startingPrice}€` : "Tarifa"}</strong>
             <span>Fillon nga</span>
          </div>
          <WhatsAppButton 
            workerId={worker.id} 
            phoneNumber={worker.phoneNumber} 
            workerName={worker.fullName}
            disabled={disabled} 
          />
        </div>
      </div>
    </div> 
  );
}

export default UserProfile
