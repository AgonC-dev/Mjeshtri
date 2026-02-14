import { Link } from 'react-router-dom';
import styles from './Footer.module.css';
import { useEffect } from 'react';
import Logo from '../../assets/FooterLogo.png'

function Footer() {



  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Brand Section */}
          <div className={styles.section}>
            <img src={Logo} className={styles.logoIcon} alt='Logo Icon'/>
            <p className={styles.description}>
              Platforma lider për gjetjen e mjeshtrit të duhur në Kosovë. Shërbime cilësore dhe të sigurta.
            </p>
          </div>

          {/* Links Section */}
          <div className={styles.section}>
            <h4>Navigimi</h4>
            <ul className={styles.links}>
              <li><Link to="/">Kryefaqja</Link></li>
              <li><Link to="/about">Rreth Nesh</Link></li>
              <li><Link to="/terms">Kushtet e Përdorimit</Link></li>
              <li><Link to="/privacy">Privatësia</Link></li>
            </ul>
          </div>

          {/* Contact Section */}
         <div className={styles.section}>
  <h4>Na Kontaktoni</h4>
  <p className={styles.contactText}>Keni pyetje apo nevojë për ndihmë?</p>
  <Link to="/contact" className={styles.contactBtn}>
    Dërgo Mesazh
  </Link>
  <div className={styles.socialInfo}>
    <span>info@mjeshtri.ks</span>
  </div>
</div>
        </div>

        <div className={styles.bottomBar}>
          <p className={styles.text}>
            © 2026 Mjeshtri.ks - Të gjitha të drejtat e rezervuara.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;