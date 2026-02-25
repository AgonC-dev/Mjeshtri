import { useState, useEffect, useRef } from 'react';
import { collection, onSnapshot, query, limit, orderBy } from 'firebase/firestore';
import WorkerCard from '../../components/WorkerCard/WorkerCard';
import styles from './MostWanted.module.css';
import { db } from '../../api/firebase';

function MostWanted() {
  const [workers, setWorkers] = useState([]);
  const [filter, setFilter] = useState('Gjitha');
  const [loading, setLoading] = useState(true);
  
  const prevScores = useRef({});
  const isFirstLoad = useRef(true); // Prevents arrows from showing on page refresh

  const categories = ['Gjitha', 'Elektricist', 'Instalues', 'Moler', 'Kopshtar'];

  const getScore = (w) => {
    let score = 0;
    if (w.isPro) score += 1000;
    if (w.isVerified) score += 200;
    score += (Number(w.reviewCount || 0) * 5);
    return score;
  };

  useEffect(() => {
    const q = query(
     collection(db, "workers"),
     orderBy("isPro", "desc"),
     orderBy("reviewCount", "desc"),
     limit(6));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveData = snapshot.docs.map(doc => {
        const data = { id: doc.id, ...doc.data() };
        const currentScore = getScore(data);
        const previousScore = prevScores.current[doc.id];
        
        let trend = 'stable';
        // Only calculate trend if this isn't the very first time we get data
        if (!isFirstLoad.current && previousScore !== undefined) {
          if (currentScore > previousScore) trend = 'rising';
          else if (currentScore < previousScore) trend = 'falling';
        }

        prevScores.current[doc.id] = currentScore;
        return { ...data, currentScore, trend };
      });

      setWorkers(liveData.sort((a, b) => b.currentScore - a.currentScore));
      setLoading(false);
      isFirstLoad.current = false; // After the first data pull, trends are active
    });

    return () => unsubscribe();
  }, []);

  const filtered = workers.filter(w => filter === 'Gjitha' || w.category === filter);

  const renderWorker = (worker, index, isElite) => (
    <div 
      key={worker.id} 
      className={isElite ? styles.eliteItem : styles.challengerItem} 
      data-rank={index + 1}
    >
      {/* GLOWING TREND INDICATOR */}
      {worker.trend !== 'stable' && (
        <div className={`${styles.trendIndicator} ${styles[worker.trend]}`}>
          <span className={styles.trendArrow}>
            {worker.trend === 'rising' ? '▲' : '▼'}
          </span>
          <span className={styles.trendText}>
            {worker.trend === 'rising' ? 'LIVE NGJITJE' : 'RËNIE'}
          </span>
        </div>
      )}

      <WorkerCard worker={worker} rank={index + 1} verifyIcon={true} />
    </div>
  );

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.topBar}>
          <div className={styles.titleSection}>

          <span className={styles.liveIndicator}>LIVE RANKING</span>

          <h1 className={styles.mainTitle}>Më të kërkuarit</h1>

        </div>
        <nav className={styles.filterPills}>
          {categories.map(cat => (
            <button 
              key={cat} 
              className={filter === cat ? styles.pillActive : styles.pill} 
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </nav>
      </header>

      <main className={styles.contentArea}>
        {loading ? (
          <div className={styles.loaderContainer}><div className={styles.spinner}></div></div>
        ) : (
          <div className={styles.gridContainer}>
            <div className={styles.sectionLabel}>Elite Tier</div>
            <div className={styles.mainGrid}>
              {filtered.slice(0, 3).map((w, i) => renderWorker(w, i, true))}
            </div>

            <div className={styles.sectionLabel} style={{ marginTop: '4rem' }}>Top Sfiduesit</div>
            <div className={styles.mainGrid}>
              {filtered.slice(3, 6).map((w, i) => renderWorker(w, i + 3, false))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default MostWanted;