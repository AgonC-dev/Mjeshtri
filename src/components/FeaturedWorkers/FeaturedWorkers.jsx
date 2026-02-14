import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { collection, query, where, limit, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../api/firebase';
import WorkerCard from '../WorkerCard/WorkerCard'
import styles from './FeaturedWorkers.module.css'

// Mock data - in a real app, this would come from an API
const CATEGORIES = ['Të gjitha', 'Instalues', 'Elektricist', 'Moler', 'Mekanik'];

function FeaturedWorkers() {
const [ featuredWorkers, setFeaturedWorkers] = useState([]);
const [ loading, setLoading] = useState(true);
const [activeTab, setActiveTab] = useState('Të gjitha')
const navigate = useNavigate()

useEffect(() => {
  const fetchFeaturedWorkers = async () => {
   const workersRef = collection(db, "workers");
   let q;
  

    try {
      setLoading(true);
      if (activeTab === 'Të gjitha') {
      q = query(
        workersRef,
        where("isPro", "==", true),
        // where("isVerified", "==", true),
        limit(10)
      );
      } else {
        q = query(
          workersRef,
          where("category", "==", activeTab),
          where("isPro", "==", true),
          // where("isVerified", "==", true),
          limit(10)
        )
      }


      const querySnapshot = await getDocs(q);
      const allPros = querySnapshot.docs.map(doc => ({
        id: doc.id, ...doc.data()
      }))

      const shuffled = allPros.sort(() => 0.5 - Math.random()).slice(0,3)

      setFeaturedWorkers(shuffled);
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  fetchFeaturedWorkers()
}, [activeTab])



 return (
  <>
    <div className={styles.categoryNavWrapper}>
      <h2 className={styles.title}>Mjeshtër të Rekomanduar</h2>
      <div className={styles.categoryNav}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`${styles.categoryTab} ${activeTab === cat ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(cat)}
          >
            {activeTab === cat && <span className={styles.activeDot} />}
            {cat}
          </button>
        ))}
      </div>
    </div>

    <section className={styles.featuredWorkers}>
    <div className={styles.grid}>
  {loading ? (
    <div className={styles.loaderContainer}>
      <div className={styles.spinner}></div>
    </div>
  ) : featuredWorkers.length > 0 ? (
    featuredWorkers.map((worker, index) => (
      /* THE MAGIC IS HERE: Combine activeTab + id */
      <div 
        key={`${activeTab}-${worker.id}`} 
        className={styles.workerEntry}
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <WorkerCard
          worker={worker}
          onClick={() => navigate(`/worker/${worker.id}`)}
        />
      </div>
    ))
  ) : (
    <div className={styles.noResults}>Nuk u gjet asnjë mjeshtër.</div>
  )}
</div>
  
  {!loading && featuredWorkers.length > 0 && (
    <div className={styles.viewAll}>
      <button className={styles.viewAllButton} onClick={() => navigate('/workers')}>
        Shiko të gjithë mjeshtërit
      </button>
    </div>
  )}
</section>
  </>
);
}

export default FeaturedWorkers
