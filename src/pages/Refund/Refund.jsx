import styles from './Refund.module.css';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';


export default function Refund() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.container}>
      <Helmet>
  <title>Politika e Rimbursimit | Gjejnjerin</title>
  <meta name="description" content="Mëso rreth politikës së rimbursimit të Gjejnjerin, kushteve të anulimit dhe procedurave për kërkesat e rimbursimit." />
  <link rel="canonical" href="https://gjejnjerin.com/refund" />
  <meta name="robots" content="index, follow" />

  <meta property="og:type" content="website" />
  <meta property="og:title" content="Politika e Rimbursimit | Gjejnjerin" />
  <meta property="og:description" content="Informohu rreth kushteve dhe procedurave të rimbursimit në Gjejnjerin." />
  <meta property="og:url" content="https://gjejnjerin.com/refund" />
  <meta property="og:image" content="https://gjejnjerin.com/og-image.png" />

  <meta name="twitter:card" content="summary_large_image" />
</Helmet>
      <h1 className={styles.title}>
        Politika e <span>Rimbursimit</span>
      </h1>

      <div className={styles.contentSection}>
        <p className={styles.date}>
          Përditësuar së fundmi: Mars 2026
        </p>

        <p className={styles.leadText}>
          Mirë se vini në <strong>GjejNjerin.com</strong>.
          Kjo politikë shpjegon kur dhe si mund të kërkoni rimbursim për abonimin PRO.
        </p>

        <h3>1. Abonimi PRO</h3>
        <p>
          Abonimi PRO është një shërbim digjital që aktivizohet menjëherë pas pagesës
          dhe përfshin veçori premium në platformë.
        </p>

        <h3>2. Kur mund të kërkoni rimbursim</h3>
        <p>Rimbursimi është i mundur vetëm në këto raste:</p>
        <ul>
          <li>Pagesë e dyfishtë</li>
          <li>Gabim teknik gjatë transaksionit</li>
          <li>Shërbimi PRO nuk u aktivizua nga sistemi</li>
        </ul>

        <h3>3. Kur nuk ofrohet rimbursim</h3>
        <ul>
          <li>Ndryshim mendimi pas blerjes</li>
          <li>Mospërdorim i shërbimit PRO</li>
          <li>Përdorim i pjesshëm i abonimit</li>
        </ul>

        <h3>4. Abonimet</h3>
        <p>
          Abonimi PRO rinovohet çdo muaj. Ju mund ta anuloni në çdo kohë nga llogaria juaj.
        </p>

        <h3>5. Kontakt</h3>
        <p>
          Për kërkesa rimbursimi na kontaktoni në:
        </p>
        <p>
          <a href="mailto:info@gjejmjeshtrin.ks">
            info@gjejmjeshtrin.ks
          </a>
        </p>

        <p>
          Kërkesat shqyrtohen brenda 3–7 ditëve pune.
        </p>

        <div className={styles.date}>
          E përditësuar së fundmi: Mars 2026
        </div>
      </div>
    </div>
  );
}