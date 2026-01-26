import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react';
import { collection, query, where, limit, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../api/firebase';
import WorkerCard from '../WorkerCard/WorkerCard'
import styles from './FeaturedWorkers.module.css'

// Mock data - in a real app, this would come from an API
function FeaturedWorkers() {
const [ featuredWorkers, setFeaturedWorkers] = useState([]);
const [ loading, setLoading] = useState(true);
const navigate = useNavigate()

useEffect(() => {
  const fetchFeaturedWorkers = async () => {
    try {
      const q = query(
        collection(db, "workers"),
        where("isPro", "==", true),
        limit(6)
      )


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
}, [])



  return (
    <section className={styles.featuredWorkers}>
      <h2 className={styles.title}>Mjeshtër të Rekomanduar</h2>
      <div className={styles.grid}>
        {featuredWorkers.map((worker) => (
          <WorkerCard
            key={worker.id}
            worker={worker}
            onClick={() => navigate(`/worker/${worker.id}`)}
          />
        ))}
      </div>
      <div className={styles.viewAll}>
        <button
          className={styles.viewAllButton}
          onClick={() => navigate('/workers')}
        >
          Shiko të gjithë mjeshtërit
        </button>
      </div>
    </section>
  )
}

export default FeaturedWorkers
