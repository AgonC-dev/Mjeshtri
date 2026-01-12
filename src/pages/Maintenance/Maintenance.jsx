import React from 'react';
import styles from './Maintenance.module.css';

const Maintenance = () => {
  return (
    <div className={styles.wrapper}>
      {/* Animated Background Elements */}
      <div className={styles.blob1}></div>
      <div className={styles.blob2}></div>
      <div className={styles.blob3}></div>
      
      <div className={styles.glassCard}>
        <div className={styles.iconWrapper}>
          <div className={styles.pulseRing}></div>
          <span className={styles.mainIcon}>🛠️</span>
        </div>

        <h1 className={styles.title}>
          {"Së shpejti...".split("").map((char, i) => (
            <span key={i} style={{ animationDelay: `${i * 0.1}s` }}>{char}</span>
          ))}
        </h1>

        <div className={styles.divider}></div>

        <p className={styles.description}>
          Mjeshtri po i mpreh mjetet! Jemi duke punuar për t'ju sjellë një eksperiencë më të shpejtë dhe më të sigurt.
        </p>

        <div className={styles.statusContainer}>
          <div className={styles.loadingBar}>
            <div className={styles.progressFill}></div>
          </div>
          <span className={styles.statusText}>Duke përditësuar sistemin...</span>
        </div>

        <footer className={styles.footer}>
          © 2026 Mjeshtri App • Faleminderit për durimin.
        </footer>
      </div>
    </div>
  );
};

export default Maintenance;