import { useNavigate } from 'react-router-dom'
import WorkerCard from '../WorkerCard/WorkerCard'
import styles from './FeaturedWorkers.module.css'

// Mock data - in a real app, this would come from an API
const featuredWorkers = [
  {
    id: 1,
    name: 'Arben Krasniqi',
    category: 'Instalues',
    rating: 4.8,
    city: 'Prishtinë',
    phoneNumber: '38349123456',
    image: 'https://via.placeholder.com/200?text=Arben',
  },
  {
    id: 2,
    name: 'Blerim Berisha',
    category: 'Elektricist',
    rating: 4.9,
    city: 'Prizren',
    phoneNumber: '38349123457',
    image: 'https://via.placeholder.com/200?text=Blerim',
  },
  {
    id: 3,
    name: 'Driton Gashi',
    category: 'Klima/AC',
    rating: 4.7,
    city: 'Gjakovë',
    phoneNumber: '38349123458',
    image: 'https://via.placeholder.com/200?text=Driton',
  },
]

function FeaturedWorkers() {
  const navigate = useNavigate()

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
