import styles from './About.module.css';
import { useEffect } from 'react';

export default function About() {
  useEffect(() => {
    window.scroll(0, 0);
  }, [])

  return (
    <div className={styles.container}>
      <h1 className={styles.heroTitle}>Misioni ynë: <span>GjejNjerin</span></h1>
      <p className={styles.leadText}>
        Në një treg ku koha është flori, ne kemi krijuar urën lidhëse mes Njeriut profesionist dhe klientit që ka nevojë për zgjidhje të shpejta dhe të besueshme.
      </p>
      
      <div className={styles.contentSection}>
        <h2>Pse GjejNjerin.com</h2>
        <p>
          Ideja lindi nga një nevojë e thjeshtë: vështirësia për të gjetur një mjeshtër të besueshëm në Kosovë pa pasur nevojë të pyesësh të gjithë rrethin shoqëror. Ne besojmë se teknologjia duhet t'u shërbejë njerëzve të punës dhe të rrisë vlerën e zanatit.
        </p>
        
        <div className={styles.gridFeatures}>
          <div className={styles.feature}>
            <h3>Për Mjeshtrit</h3>
            <p>Një hapësirë ku puna juaj vlerësohet, ku renditja bëhet në mënyrë transparente dhe ku klientët ju gjejnë direkt.</p>
          </div>
          <div className={styles.feature}>
            <h3>Për Klientët</h3>
            <p>Siguri, transparencë dhe mundësia për të parë vlerësimet reale për të zgjedhur më të mirin për projektin tuaj.</p>
          </div>
        </div>
      </div>
    </div>
  );
}