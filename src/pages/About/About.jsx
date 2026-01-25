import styles from './About.module.css';

export default function About() {
  return (
    <div className={styles.container}>
      <h1 className={styles.heroTitle}>Misioni ynë: <span>Mjeshtri.ks</span></h1>
      <p className={styles.leadText}>
        Në një treg ku koha është flori, ne kemi krijuar urën lidhëse mes mjeshtrit profesionist dhe klientit që ka nevojë për zgjidhje.
      </p>
      
      <div className={styles.contentSection}>
        <h2>Pse Mjeshtri.ks?</h2>
        <p>
          Ideja lindi nga një nevojë e thjeshtë: vështirësia për të gjetur një mjeshtër të besueshëm në Kosovë pa pasur nevojë të pyesësh të gjithë rrethin shoqëror. Ne besojmë se teknologjia duhet t'u shërbejë njerëzve të punës.
        </p>
        
        <div className={styles.gridFeatures}>
          <div className={styles.feature}>
            <h3>Për Mjeshtrit</h3>
            <p>Një hapësirë ku puna juaj vlerësohet dhe ku klientët ju gjejnë direkt, pa ndërmjetës.</p>
          </div>
          <div className={styles.feature}>
            <h3>Për Klientët</h3>
            <p>Siguri, transparencë dhe mundësia për të zgjedhur më të mirin për shtëpinë apo biznesin tuaj.</p>
          </div>
        </div>
      </div>
    </div>
  );
}