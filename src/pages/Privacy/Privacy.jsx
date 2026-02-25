import styles from './Privacy.module.css';
import { useEffect } from 'react';

export default function Privacy() {
  useEffect(() => {
    window.scroll(0, 0)
  }, []) 

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Politika e <span>Privatësisë</span></h1>
      
      <div className={styles.contentSection}>
        <p className={styles.leadText}>
          Siguria e të dhënave tuaja është prioriteti ynë kryesor te Gjejmjeshtrin.ks. 
          Ne jemi të përkushtuar të mbrojmë privatësinë e çdo Ustahi dhe klienti.
        </p>

        <h3>Mbledhja e të Dhënave</h3>
        <p>Ne mbledhim vetëm informacionet e nevojshme për t'ju lidhur me klientët: Emrin, Numrin e Telefonit, Lokacionin dhe Kategorinë e punës suaj.</p>

        <h3>Si i përdorim të dhënat?</h3>
        <ul>
          <li>Për të shfaqur profilin tuaj te klientët potencialë nëpërmjet kërkimit dhe Live Ranking.</li>
          <li>Për t'ju dërguar njoftime rreth vlerësimeve të reja apo kërkesave për punë.</li>
          <li>Për të përmirësuar përvojën tuaj teknike në platformë.</li>
        </ul>

        <h3>Mbrojtja e Numrit të Telefonit</h3>
        <p>Numri juaj i telefonit shfaqet vetëm te përdoruesit që kërkojnë shërbimet tuaja. Ne kurrë nuk do t'i shesim apo t'i ndajmë të dhënat tuaja personale me palët e treta për qëllime marketingu.</p>
        
        <div className={styles.date}>E përditësuar së fundmi: Shkurt 2026</div>
      </div>
    </div>
  );
}