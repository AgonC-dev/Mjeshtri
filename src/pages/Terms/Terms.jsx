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
        <p className={styles.date}>Përditësuar së fundmi: Janar 2026</p>
        
        <h3>1. Pranimi i Kushteve</h3>
        <p>Duke hapur një llogari në Mjeshtri.ks, ju pranoni të jeni pjesë e një komuniteti të bazuar te ndershmëria dhe profesionalizmi.</p>

        <h3>2. Verifikimi i Punëtorëve</h3>
        <p>Çdo punëtor është përgjegjës për vërtetësinë e të dhënave dhe certifikimeve të tij. Mjeshtri.ks mban të drejtën të mbyllë llogaritë që japin informacione të rreme.</p>

        <h3>3. Pagesat dhe Shërbimet</h3>
        <p>Mjeshtri.ks është platformë ndërlidhëse. Marrëveshja për çmimin dhe kryerjen e punës bëhet direkt mes mjeshtrit dhe klientit.</p>
        
        <h3>4. Sjellja e Ndaluar</h3>
        <p>Nuk lejohet gjuha e urrejtjes, mashtrimi, apo përdorimi i platformës për qëllime jashtë sferës së mjeshtërisë dhe shërbimeve profesionale.</p>
      </div>
    </div>
  );
}