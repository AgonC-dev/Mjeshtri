import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db, auth } from "../../api/firebase.js";
import WhatsAppButton from '../../components/WhatsAppButton/WhatsAppButton';
import styles from './WorkerProfile.module.css';
import MapPin from '../../assets/Mappin.png';
import Verified from '../../assets/verified.png';

function WorkerProfile() {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize with state if available (prevents loading flicker when navigating from home)
  const [worker, setWorker] = useState(location.state?.workerData || null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(!worker);

  const [isFav, setIsFav] = useState(false);


  useEffect(() => {

    if (!worker?.id) return;

    const checkPersistence = () => {
      const saved = JSON.parse(localStorage.getItem("mjeshtri_favs") || "[]")
      setIsFav(saved.some(item => item.id === worker.id));
    }

    checkPersistence();

    window.addEventListener("favoritesUpdated", checkPersistence)
    window.addEventListener("storage", checkPersistence)

    return () => {
      window.removeEventListener("favoritesUpdated", checkPersistence);
     window.removeEventListener("storage", checkPersistence);
    }
  }, [worker?.id])



  // Sync with localStorage on mount
  useEffect(() => {

       if (!worker?.id) return;
    const saved = JSON.parse(localStorage.getItem("mjeshtri_favs") || "[]");
    setIsFav(saved.some(item => item.id === worker.id));
  }, [worker?.id]);

  const toggleFavorite = (e) => {
    e.stopPropagation(); // Prevents clicking the card
    e.preventDefault();

    const saved = JSON.parse(localStorage.getItem("mjeshtri_favs") || "[]");
    const isAlreadyFav = saved.some(item => item.id === worker.id);

    let updated;
    if (isAlreadyFav) {
      updated = saved.filter(item => item.id !== worker.id);
    } else {
      updated = [...saved, {
        id: worker.id,
        fullName: worker.fullName,
        category: worker.category,
        profilePic: worker.profilePic,
        phoneNum: worker.phoneNumber || worker.phoneNum,
        city: worker.city
      }];
    }

    localStorage.setItem("mjeshtri_favs", JSON.stringify(updated));
    setIsFav(!isAlreadyFav);

    // Tell the Header to update its badge
    window.dispatchEvent(new Event("favoritesUpdated"));
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchWorkerAndReviews = async () => {
      if (!worker) setLoading(true);

      try {
        let finalWorkerData = worker;

        // 1. GET THE WORKER DATA
        if (!finalWorkerData) {
          if (id) {
            // DIRECT HIT (Fastest - usually from internal navigation)
            const docRef = doc(db, "workers", id);
            const snap = await getDoc(docRef);
            if (snap.exists()) {
              finalWorkerData = { id: snap.id, ...snap.data() };
            }
          } else if (slug) {
            // SLUG SEARCH (For personalized links)
          
            const q = query(collection(db, "workers"), where("slug", "==", slug));
            const qSnap = await getDocs(q);
            if (!qSnap.empty) {
              const data = qSnap.docs[0].data();

              if(data.isPro) {
                finalWorkerData = { id: qSnap.docs[0].id, ...data};
              } else {
                finalWorkerData = null;
              }
            } 
          }
        }

        if (finalWorkerData) {
          setWorker(finalWorkerData);

          // 2. GET APPROVED REVIEWS
          const qReviews = query(
            collection(db, "reviews"),
            where("workerId", "==", finalWorkerData.id),
            where("status", "==", "approved"), // Only show approved ones
            orderBy("createdAt", "desc")
          );
          const revSnap = await getDocs(qReviews);
          setReviews(revSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkerAndReviews();
  }, [id, slug]); // Listen to both ID and Slug changes

  if (loading) return <div className={styles.loader}><span></span></div>;
  if (!worker) {
  return (
    <div className={styles.errorPageWrapper}>
      <div className={styles.errorCircleBg}></div>
      <div className={styles.errorCard}>
        <div className={styles.errorIconWrapper}>
           <span className={styles.lockEmoji}>🔒</span>
           <div className={styles.iconPulse}></div>
        </div>
        
        <h1 className={styles.errorTitle}>Link i Kufizuar</h1>
        <p className={styles.errorSubtext}>
          Ky profil kërkon një anëtarësim <span>PRO</span> për t'u hapur nëpërmjet linkut të personalizuar.
        </p>
        
        <div className={styles.errorActionArea}>
          <button onClick={() => navigate('/')} className={styles.backBtn}>
            Kthehu në Ballinë
          </button>
          <p className={styles.helpText}>Nëse jeni ju pronari i këtij profili, ju lutem kyçuni.</p>
        </div>
      </div>
    </div>
  );
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
             {!auth.currentUser && <button 
                    onClick={toggleFavorite} 
                    className={`${styles.heartBtn} ${isFav ? styles.active : ''}`}
                    aria-label="Favorite"
                  >
                    <div className={styles.heartContainer}>
                      {/* The Outline Heart */}
                      <svg className={styles.heartOutline} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      
                      {/* The Filled Heart */}
                      <svg className={styles.heartFill} viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </div>
              
                    {/* Floating particles effect for extra "pop" */}
                    {isFav && <div className={styles.particles}>
                      <span></span><span></span><span></span><span></span>
                    </div>}
                  </button>} 
               
              <div className={styles.topBadges}>
                <span className={styles.catBadge}>{worker.category}</span>
                {worker.showProStar && <span className={styles.verifiedPro}>PRO</span>}
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
               {worker.quickResponse === true && (
                 <p>✓ Reagim i shpejtë</p>
              )}
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
          />
        </div>
      </div>
    </div> 
  );
}

export default WorkerProfile;