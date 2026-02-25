import styles from './Loading.module.css';

export default function Loading() {
  return (
    <div className={styles.loaderWrapper}>
      <div className={styles.animationContainer}>
        {/* Unaza kryesore rrotulluese */}
        <div className={styles.mainRing}></div>
        
        {/* Unaza e dytë me drejtim të kundërt */}
        <div className={styles.innerRing}></div>
        
        {/* Qendra pulsuese */}
        <div className={styles.core}>
          <div className={styles.coreGlow}></div>
        </div>
        
        {/* Grimcat lëvizëse (Orbiting dots) */}
        <div className={styles.particle}></div>
        <div className={styles.particleTwo}></div>
      </div>
      
      <div className={styles.textContainer}>
        <span className={styles.shimmerText}>MJESHTRI</span>
        <div className={styles.progressBar}>
          <div className={styles.progressFill}></div>
        </div>
        <span className={styles.subText}>Duke përgatitur ambientin...</span>
      </div>
    </div>
  );
}