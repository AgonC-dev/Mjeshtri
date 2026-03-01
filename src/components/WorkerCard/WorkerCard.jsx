import { useNavigate, useParams, Link } from 'react-router-dom'
import WhatsAppButton from '../WhatsAppButton/WhatsAppButton'
import styles from './WorkerCard.module.css'
import MapPin from '../../assets/Mappin.png';
import Verified from '../../assets/verified.png';
import { useEffect, useRef, useState } from 'react';
import { auth } from '../../api/firebase';

function WorkerCard({ worker, rank, verifyIcon }) {
const { id } = useParams();
const navigate = useNavigate();
const [showMenu, setShowMenu] = useState(false)
const menuRef = useRef();


const [isFav, setIsFav] = useState(false);


  useEffect(() => {
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
  }, [worker.id])

  // Sync with localStorage on mount
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("mjeshtri_favs") || "[]");
    setIsFav(saved.some(item => item.id === worker.id));
  }, [worker.id]);

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
  const handleOutsideClick = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setShowMenu(false);
    }
  }
  
  document.addEventListener("mousedown", handleOutsideClick)
  return () => document.removeEventListener("mousedown", handleOutsideClick) 
}, [])

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

  function handleNavigate() {
      navigate(`/worker/${worker.id}`, {state: {workerData: worker}});
  }
  


  return (
    <div className={styles.card} onClick={handleNavigate}>
      <div className={styles.imageContainer}>
        {rank && <div className={styles.rankBadge}>#{rank}</div>}
        <img
          src={worker.profilePic || 'https://via.placeholder.com/200?text=Worker'}
          alt={worker.fullName}
          className={styles.image}
        />
        <div className={styles.badgeWrapper}>
          {worker.isVerified && (
         <img src={Verified} className={verifyIcon ? styles.verifyBadge : styles.verifiedBadge} alt="verified" />
        )}
        {worker.isPro && (
         <div className={styles.proBadgeContainer} title="Anëtar PRO">
           <span className={styles.starIcon}>★</span>
         </div>
         
       )}
     </div>
     

        {/* THREE DOTS MENU */}
        <div className={styles.moreOptions} ref={menuRef}>
          <button 
            className={styles.dotsBtn} 
            onClick={(e) => {
              e.stopPropagation(); // Stop card navigation
              setShowMenu(!showMenu);
            }}
          >
            ⋮
          </button>
          
          {showMenu && (
  <div className={styles.optionsDropdown} onClick={(e) => e.stopPropagation()}>
    <Link 
      to={`/contact?subject=Problem&reported_id=${worker.id || worker.uid}&reported_name=${worker.fullName}`}
      className={styles.dropdownItem}
    >
      <span className={styles.icon}>🚩</span> Raporto
    </Link>
    
    {!auth.currentUser && <div className={styles.divider} />}
  
   {!auth.currentUser && <button 
       onClick={(e) => {
    e.preventDefault();
    e.stopPropagation(); // 1. Stop the card from navigating
    toggleFavorite(e);   // 2. Run the favorite logic
    setShowMenu(false);  // 3. Force the menu to close
  }}
       className={styles.dropdownItem}
    >
      <span className={styles.icon}>❤️</span> {isFav ? "Hiqe" : "Ruaje"}
    </button>}  
  </div>
)}
        </div>
      </div>

      <div className={styles.content}>
        <h3 className={styles.name}>{worker.fullName}</h3>
        
        <div className={styles.priceCityCon}>
          <div className={styles.cityCon}>
            <img src={MapPin} className={styles.mappin} alt='mapPin' />
            <p className={styles.city}>{worker.city}</p>
          </div>
          <div className={styles.priceContainer}>
            <span className={styles.priceLabel}>Cmimi:</span>
            <span className={styles.priceAmount}>
              {worker.startingPrice != null && worker.startingPrice !== 0
                ? `${worker.startingPrice}€`
                : 'Me marrëveshje'}
            </span>
          </div>
        </div>
        <p className={styles.category}>{worker.category}</p>
        <div className={styles.rating}>
          <span className={styles.stars}>{renderStars(worker.rating)}</span>
          <span className={styles.ratingValue}>{worker.rating}</span>
        </div>
        
        <div className={styles.buttonContainer} onClick={(e) => e.stopPropagation()}>
          <WhatsAppButton workerId={id || worker.uid} phoneNumber={worker.phoneNumber} workerName={worker.fullName}/>
    {!auth.currentUser &&  <button 
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
        </div>
      </div>
    </div>
  );
}

export default WorkerCard