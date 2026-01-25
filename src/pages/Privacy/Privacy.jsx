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
        <p>Siguria e të dhënave tuaja është prioriteti ynë kryesor te Mjeshtri.ks.</p>

        <h3>Mbledhja e të Dhënave</h3>
        <p>Ne mbledhim vetëm informacionet e nevojshme për t'ju lidhur me klientët: Emrin, Numrin e Telefonit, Lokacionin dhe Kategorinë e punës suaj.</p>

        <h3>Si i përdorim të dhënat?</h3>
        <ul>
          <li>Për të shfaqur profilin tuaj te klientët potencialë.</li>
          <li>Për t'ju dërguar njoftime rreth kërkesave të reja për punë.</li>
          <li>Për të përmirësuar përvojën tuaj në platformë.</li>
        </ul>

        <h3>Mbrojtja e Numrit të Telefonit</h3>
        <p>Numri juaj i telefonit shfaqet vetëm te përdoruesit e regjistruar që kërkojnë shërbimet tuaja. Ne kurrë nuk do t'i shesim të dhënat tuaja te palët e treta.</p>
      </div>
    </div>
  );
}