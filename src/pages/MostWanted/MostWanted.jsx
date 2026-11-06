import { useState, useEffect, useRef } from 'react';
import { collection, onSnapshot, query, limit, orderBy } from 'firebase/firestore';
import WorkerCard from '../../components/WorkerCard/WorkerCard';
import styles from './MostWanted.module.css';
import { db } from '../../api/firebase';
import { Helmet } from 'react-helmet-async';
import Logo from '../../assets/Logo2.png';

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

      <WorkerCard worker={worker}  verifyIcon={true} />
    </div>
  );

  return (
    <div className={styles.pageWrapper}>
      

<Helmet>
  <title>Renditja e Punëtorëve më të Mirë në Kosovë | Gjejnjerin</title>

  <meta
    name="description"
    content="Shiko renditjen live të profesionistëve më të dalluar në Gjejnjerin. Zbulo punëtorët kryesorë në Kosovë dhe gjej profesionistin e duhur për shërbimin që të nevojitet."
  />

  <link
    rel="canonical"
    href="https://gjejnjerin.com/wanted"
  />

  <meta name="robots" content="index, follow" />

  <meta property="og:type" content="website" />
  <meta
    property="og:title"
    content="Renditja e Punëtorëve më të Mirë në Kosovë | Gjejnjerin"
  />
  <meta
    property="og:description"
    content="Zbulo renditjen live të profesionistëve më të dalluar në Gjejnjerin dhe gjej punëtorin e duhur në Kosovë."
  />
  <meta
    property="og:url"
    content="https://gjejnjerin.com/wanted"
  />
  <meta
    property="og:image"
    content="https://gjejnjerin.com/og-image.png"
  />

  <meta name="twitter:card" content="summary_large_image" />
  <meta
    name="twitter:title"
    content="Renditja e Punëtorëve më të Mirë | Gjejnjerin"
  />
  <meta
    name="twitter:description"
    content="Shiko renditjen live të profesionistëve në Kosovë."
  />
  <meta
    name="twitter:image"
    content="https://gjejnjerin.com/og-image.png"
  />
</Helmet>
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