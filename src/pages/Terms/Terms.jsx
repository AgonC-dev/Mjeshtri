import styles from './Terms.module.css';
import { useEffect } from 'react';

export default function Terms() {
  useEffect(() => {
    window.scroll(0, 0)
  }, []) 

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Kushtet e <span>Përdorimit</span></h1>
      
      <div className={styles.contentSection}>
        <p className={styles.date}>Përditësuar së fundmi: Shkurt 2026</p>
        
        <p className={styles.leadText}>
          Duke përdorur platformën Gjejmjeshtrin.ks, ju hyni në një komunitet që vlerëson punën, 
          ndershmërinë dhe mjeshtërinë profesionale.
        </p>

        <h3>1. Pranimi i Kushteve</h3>
        <p>Duke hapur një llogari në Gjejmjeshtrin.ks, ju pranoni të jeni pjesë e një rrjeti të bazuar te profesionalizmi. Çdo veprim në platformë duhet të jetë në përputhje me këto rregulla.</p>

        <h3>2. Verifikimi i Ustahëve</h3>
        <p>Çdo punëtor (Ustah) është përgjegjës për vërtetësinë e të dhënave, fotove të punës dhe certifikimeve të tij. Gjejmjeshtrin.ks mban të drejtën të mbyllë llogaritë që japin informacione të rreme apo mashtruese.</p>

        <h3>3. Pagesat dhe Shërbimet</h3>
        <p>Gjejmjeshtrin.ks është një platformë ndërlidhëse dhe jo punëdhënëse. Marrëveshja për çmimin, kohën dhe kryerjen e punës bëhet direkt dhe privatisht mes mjeshtrit dhe klientit.</p>
        
        <h3>4. Sjellja e Ndaluar</h3>
        <p>Nuk lejohet gjuha e urrejtjes, abuzimi me sistemin e vlerësimeve (reviews), apo përdorimi i platformës për qëllime jashtë sferës së mjeshtërisë dhe shërbimeve profesionale.</p>
      </div>
    </div>
  );
}