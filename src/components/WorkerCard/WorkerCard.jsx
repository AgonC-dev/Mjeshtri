import { useNavigate, useParams } from 'react-router-dom'
import WhatsAppButton from '../WhatsAppButton/WhatsAppButton'
import styles from './WorkerCard.module.css'
import MapPin from '../../assets/Mappin.png';
import Verified from '../../assets/verified.png';

function WorkerCard({ worker }) {
const { id } = useParams();
const navigate = useNavigate();

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
        <img
          src={worker.profilePic || 'https://via.placeholder.com/200?text=Worker'}
          alt={worker.fullName}
          className={styles.image}
        />
       {worker.isPro && <img src={Verified}  className={styles.verifiedBadge}/>} 
      </div>
      <div className={styles.content}>
        <h3 className={styles.name}>{worker.fullName}</h3>
       <div className={styles.priceCityCon}>
        <div className={styles.cityCon}>
          <img src={MapPin} className={styles.mappin}alt='mapPin' />
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
          <WhatsAppButton id={id || worker.uid} phoneNumber={worker.phoneNumber} />
        </div>
      </div>
    </div>
  )
}

export default WorkerCard