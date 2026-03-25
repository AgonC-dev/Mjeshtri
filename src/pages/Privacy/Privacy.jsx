import styles from './Privacy.module.css';
import { useEffect } from 'react';

export default function Privacy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Politika e <span>Privatësisë</span>
      </h1>

      <div className={styles.contentSection}>
        <p className={styles.leadText}>
          Mirë se vini në <strong>GjejNjerin.com</strong>. Ne e respektojmë privatësinë
          tuaj dhe jemi të përkushtuar për mbrojtjen e të dhënave personale të çdo
          përdoruesi, përfshirë Ustahët dhe Klientët.
          Duke përdorur platformën tonë, ju pranoni praktikat e përshkruara në këtë
          Politikë Privatësie.
        </p>

        <h3>1. Të Dhënat që Mbledhim</h3>
        <ul>
          <li>Emri dhe mbiemri</li>
          <li>Numri i telefonit</li>
          <li>Lokacioni (Qyteti / Zona)</li>
          <li>Kategoria e shërbimit</li>
          <li>Foto profili (nëse ngarkohet)</li>
          <li>Vlerësime dhe komente nga klientët</li>
          <li>Të dhëna teknike si IP adresa, pajisja dhe shfletuesi</li>
        </ul>
        <p>
          Ne mbledhim vetëm të dhëna që janë të nevojshme për funksionimin dhe
          përmirësimin e platformës.
        </p>

        <h3>2. Si i Përdorim të Dhënat Tuaja</h3>
        <ul>
          <li>Shfaqjen e profilit tuaj në rezultatet e kërkimit dhe Live Ranking</li>
          <li>Lidhjen e klientëve me profesionistët</li>
          <li>Dërgimin e njoftimeve për vlerësime ose kërkesa për punë</li>
          <li>Përmirësimin e sigurisë dhe performancës së platformës</li>
          <li>Parandalimin e mashtrimeve dhe abuzimeve</li>
        </ul>
        <p>
          Ne nuk i përdorim të dhënat tuaja për marketing pa pëlqimin tuaj.
        </p>

        <h3>3. Shfaqja e Numrit të Telefonit</h3>
        <p>
          Numri i telefonit i Mjeshtërve shfaqet si pjesë e shërbimit të platformës
          për t’u mundësuar klientëve kontakt direkt. Ne nuk i shesim apo
          shpërndajmë të dhënat tuaja personale tek palë të treta për qëllime marketingu.
        </p>

        <h3>4. Ruajtja dhe Siguria e të Dhënave</h3>
        <p>
          Ne përdorim masa teknike dhe organizative për të mbrojtur të dhënat tuaja
          nga aksesi i paautorizuar, ndryshimi, zbulimi apo humbja.
          Megjithatë, asnjë sistem online nuk është 100% i sigurt.
        </p>

        <h3>5. Cookies</h3>
        <p>
          Platforma mund të përdorë cookies për ruajtjen e sesionit,
          analiza statistikore dhe përmirësimin e eksperiencës së përdoruesit.
          Ju mund t’i çaktivizoni cookies përmes shfletuesit tuaj.
        </p>

        <h3>6. Të Drejtat Tuaja</h3>
        <ul>
          <li>Të kërkoni qasje në të dhënat tuaja</li>
          <li>Të kërkoni korrigjimin e tyre</li>
          <li>Të kërkoni fshirjen e llogarisë dhe të dhënave</li>
          <li>Të tërhiqni pëlqimin për përpunim të të dhënave</li>
        </ul>
        <p>
          Për çdo kërkesë mund të na kontaktoni në:{' '}
          <a href="mailto:info@gjejmjeshtrin.ks">
            info@gjejmjeshtrin.ks
          </a>
        </p>

        <h3>7. Fëmijët</h3>
        <p>
          Platforma nuk është e destinuar për persona nën moshën 18 vjeç.
        </p>

        <h3>8. Ndryshimet në Politikë</h3>
        <p>
          Ne mund ta përditësojmë këtë politikë herë pas here.
          Çdo ndryshim do të publikohet në këtë faqe me datën e përditësimit.
        </p>

        <div className={styles.date}>
          E përditësuar së fundmi: Mars 2026
        </div>
      </div>
    </div>
  );
}