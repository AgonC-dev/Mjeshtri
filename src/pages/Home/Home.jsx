import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Hero from '../../components/Hero/Hero';
import CategoryGrid from '../../components/CategoryGrid/CategoryGrid'
import FeaturedWorkers from '../../components/FeaturedWorkers/FeaturedWorkers'
import styles from './Home.module.css'
import Modal from '../../components/Modal/Modal';
import Banner from '../../components/Banner/Banner';

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const isModalOpen = location.state?.modalOpen;
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/workers?search=${encodeURIComponent(query)}`)
    } else {
      navigate('/workers')
    }
  }

  return (
    <div className={styles.home}>
      <Hero onSearch={handleSearch} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Banner />
      <CategoryGrid />
      <FeaturedWorkers />
          <Modal 
  open={isModalOpen} 
  onClose={() => navigate("/dashboard")}
>
  <div className={styles.successModal}>
    <div className={styles.successGlow}></div>
    
    <div className={styles.iconCircle}>
      <svg viewBox="0 0 24 24" className={styles.checkIcon}>
        <path d="M4.1 12.7L9 17.6 19.9 6.7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>

    <header className={styles.modalHeader}>
      <h2 className={styles.dualTitle}>
        <span className={styles.partWhite}>MIRËSEVINI</span>
        <span className={styles.partGreen}>MBRET!</span>
      </h2>
      <p className={styles.modalSubtitle}>Llogaria juaj u krijua me sukses</p>
    </header>

    <div className={styles.successInfoBox}>
      <p>Tani mund të plotësoni profilin tuaj, të shtoni punët në portofol dhe të filloni të merrni kërkesa nga klientët.</p>
    </div>

    <button 
      className={styles.dashboardBtn} 
      onClick={() => navigate("/dashboard")}
    >
      Vazhdo te Paneli
    </button>
  </div>
</Modal>
    </div>

  )
}

export default Home
