import styles from './Loading.module.css';

export default function Loading() {
      return (
        <div className={styles.loaderWrapper}>
          <div className={styles.pulseCircle}></div>
          <div className={styles.shimmerText}>Duke u ngarkuar...</div>
        </div>
      );
}