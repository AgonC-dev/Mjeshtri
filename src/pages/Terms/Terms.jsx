import styles from './Terms.module.css';
import { useEffect } from 'react';

export default function Terms() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        Kushtet e <span>Përdorimit</span>
      </h1>

      <div className={styles.contentSection}>
        <p className={styles.date}>Përditësuar së fundmi: Mars 2026</p>

        <p className={styles.leadText}>
          Mirë se vini në <strong>Gjejmjeshtrin.ks</strong>. Duke përdorur
          platformën tonë, ju pranoni këto Kushte Përdorimi. Nëse nuk pajtoheni
          me to, ju lutemi mos përdorni platformën.
        </p>

        <h3>1. Pranimi i Kushteve</h3>
        <p>
          Duke krijuar llogari ose duke përdorur shërbimet tona, ju konfirmoni
          se jeni mbi 18 vjeç dhe pranoni të respektoni të gjitha rregullat e
          platformës.
        </p>

        <h3>2. Roli i Platformës</h3>
        <p>
          Gjejmjeshtrin.ks është një platformë ndërlidhëse që lidh klientët me
          profesionistët (Ustahët). Ne nuk jemi punëdhënës, agjenci punësimi apo
          garantues i cilësisë së punës së kryer.
        </p>
        <p>
          Marrëveshjet për çmimin, kohën dhe realizimin e punës bëhen
          drejtpërdrejt mes klientit dhe Ustahut.
        </p>

        <h3>3. Përgjegjësia e Ustahëve</h3>
        <p>
          Çdo Ustah është përgjegjës për saktësinë e të dhënave, përvojës,
          fotografive dhe shërbimeve të publikuara në profil.
          Informacioni i rremë ose mashtrues mund të çojë në pezullim ose
          mbyllje të llogarisë.
        </p>

        <h3>4. Vlerësimet dhe Komentet</h3>
        <p>
          Klientët mund të lënë vlerësime bazuar në përvojën reale.
          Abuzimi me sistemin e reviews, manipulimi i vlerësimeve ose
          përmbajtja ofenduese nuk lejohet.
        </p>
        <p>
          Ne rezervojmë të drejtën të fshijmë komente që përmbajnë gjuhë
          fyese, kërcënuese ose të pavërteta.
        </p>

        <h3>5. Sjellja e Ndaluar</h3>
        <ul>
          <li>Publikimi i informacionit të rremë</li>
          <li>Përdorimi i platformës për aktivitete të paligjshme</li>
          <li>Abuzimi me përdorues të tjerë</li>
          <li>Spam, mashtrime ose manipulim i sistemit</li>
        </ul>

        <h3>6. Kufizimi i Përgjegjësisë</h3>
        <p>
          Gjejmjeshtrin.ks nuk mban përgjegjësi për dëme,
          humbje financiare, mosmarrëveshje apo probleme që lindin nga
          marrëveshjet mes klientëve dhe Ustahëve.
        </p>
        <p>
          Përdorimi i platformës bëhet me përgjegjësi të plotë nga përdoruesi.
        </p>

        <h3>7. Pezullimi dhe Mbyllja e Llogarisë</h3>
        <p>
          Ne rezervojmë të drejtën të pezullojmë ose mbyllim çdo llogari
          që shkel këto kushte, pa paralajmërim paraprak.
        </p>

        <h3>8. Ndryshimet në Kushtet</h3>
        <p>
          Gjejmjeshtrin.ks mund të përditësojë këto Kushte Përdorimi
          në çdo kohë. Ndryshimet hyjnë në fuqi menjëherë pas publikimit.
        </p>

        <h3>9. Ligji i Aplikueshëm</h3>
        <p>
          Këto kushte rregullohen sipas legjislacionit në fuqi në Republikën e Kosovës.
        </p>
      </div>
    </div>
  );
}