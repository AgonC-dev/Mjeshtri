import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Hero from '../../components/Hero/Hero';
import CategoryGrid from '../../components/CategoryGrid/CategoryGrid'
import FeaturedWorkers from '../../components/FeaturedWorkers/FeaturedWorkers'
import styles from './Home.module.css'
import Modal from '../../components/Modal/Modal';
import Banner from '../../components/Banner/Banner';
import { db,functions } from '../../api/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isModalOpen = location.state?.modalOpen;
  const name = location.state?.name;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [metadata, setMetaData] = useState(null);
  const [showProModal, setShowProModal] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);

  useEffect(() => {
    const docRef = doc(db, "metadata", "globalStats")

    const fetchDoc = async () => {
       try {
         const docSnap = await getDoc(docRef);
         if (docSnap.exists()) {
           const data = docSnap.data();
           setMetaData(data);
           
           const hasSeenProModal = localStorage.getItem('proModalDismissed');
           if (data.workerCount < 50 && !hasSeenProModal) {
             setShowProModal(true);
           }
         }
       } catch (error) {
         console.error("Error fetching metadata:", error);
       }
    }
    
    fetchDoc()
  }, [])

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/workers?search=${encodeURIComponent(query)}`)
    } else {
      navigate('/workers')
    }
  }

  const handleCloseProModal = () => {
    localStorage.setItem('proModalDismissed', 'true');
    setShowProModal(false);
  }

  const makePro = async () => {
  if(isUpgrading) return;

  setIsUpgrading(true)
 
  try {
    const handlePro = httpsCallable(functions, "handleGetPro")
    const result = await handlePro();

    if(result.data?.success) {
      handleCloseProModal()
    }
  } catch (err) {
    console.error("Frontend registration error:", err);
    alert(err.message || "Ndodhi një gabim gjatë kalimit në PRO.");
  } finally {
    setIsUpgrading(false)
  }
   
  }

  return (
    <div className={styles.home}>
      <Hero onSearch={handleSearch} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <Banner />
      <CategoryGrid />
      <FeaturedWorkers />

      {/* --- NEW LIGHT THEME PRO MEMBERSHIP MODAL --- */}
      <Modal open={showProModal} onClose={handleCloseProModal}>
        <div className={styles.proModal}>
          
          {/* Animated Fireworks Background */}
          <div className={styles.fireworksContainer}>
            <div className={styles.firework}></div>
            <div className={styles.firework}></div>
            <div className={styles.firework}></div>
          </div>
          
          <div className={styles.proGlow}></div>
          
          <div className={styles.badgeContainer}>
            <span className={styles.proBadge}>PRO FALAS</span>
          </div>

          <header className={styles.modalHeader}>
            <h2 className={styles.dualTitle}>
              <span className={styles.partWhite}>OFTUAR PËR</span>
              <span className={styles.partGold}>50 TË PARËT</span>
            </h2>
            <p className={styles.modalSubtitle}>Urime! Ju kualifikoheni për anëtarësim Premium</p>
          </header>

          <div className={styles.proInfoBox}>
            <p>Si një ndër anëtarët tanë të parë, përfitoni të gjitha funksionet PRO plotësisht falas për dy muaj.</p>
            
            {metadata && (
              <div className={styles.counterContainer}>
                <div className={styles.progressBar}>
                  <div 
                    className={styles.progressFill} 
                    style={{ width: `${(metadata.workerCount / 50) * 100}%` }}
                  ></div>
                </div>
                <div className={styles.counterText}>
                  <strong>{metadata.workerCount}</strong> nga 50 vende të zëna
                </div>
              </div>
            )}
          </div>

          <button 
            className={styles.claimBtn} 
            disabled={isUpgrading}
            onClick={makePro}
          >
            {isUpgrading ? "Duke u procesuar..." : "Përfito Pro Tani"}
          </button>
          
          <button className={styles.closeBtn} onClick={handleCloseProModal}>
            Mbyll
          </button>
        </div>
      </Modal>

      {/* --- EXISTING SUCCESS MODAL --- */}
      <Modal 
        open={isModalOpen} 
        onClose={() => navigate("/", { replace: true, state: {} })}
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
              <span className={styles.partGreen}>{name}</span>
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
          <button className={styles.closeBtn} onClick={() => navigate("/", { replace: true, state: {} })}>
            Mbyll
          </button>
        </div>
      </Modal>
    </div>
  )
}

export default Home