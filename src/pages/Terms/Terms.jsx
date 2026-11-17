import styles from './Terms.module.css';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

// TODO: fill these in before publishing
const OPERATOR_NAME = '[Emri juaj ose i biznesit]';
const CONTACT_EMAIL = 'info@gjejmjeshtrin.ks'; // use your real, working email

export default function Terms() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.container}>
      <Helmet>
        <title>Kushtet e Përdorimit | Gjejnjerin</title>
        <meta name="description" content="Lexo kushtet e përdorimit të Gjejnjerin për të kuptuar rregullat, përgjegjësitë dhe kushtet e përdorimit të platformës." />
        <link rel="canonical" href="https://gjejnjerin.com/terms" />
        <meta name="robots" content="index, follow" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Kushtet e Përdorimit | Gjejnjerin" />
        <meta property="og:description" content="Kushtet dhe rregullat për përdorimin e platformës Gjejnjerin." />
        <meta property="og:url" content="https://gjejnjerin.com/terms" />
        <meta property="og:image" content="https://gjejnjerin.com/og-image.png" />

        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <h1 className={styles.title}>
        Kushtet e <span>Përdorimit</span>
      </h1>

      <div className={styles.contentSection}>
        <p className={styles.date}>Përditësuar së fundmi: Nëntor 2026</p>

        <p className={styles.leadText}>
          Mirë se vini në <strong>GjejNjerin.com</strong>. Këto Kushte
          Përdorimi rregullojnë përdorimin e platformës, e cila operohet nga{' '}
          {OPERATOR_NAME}. Duke e përdorur platformën ose duke krijuar llogari,
          ju pranoni këto kushte. Nëse nuk pajtoheni me to, ju lutemi mos e
          përdorni platformën.
        </p>

        <h3>1. Pranimi i Kushteve</h3>
        <p>
          Duke krijuar llogari ose duke përdorur shërbimet tona, ju konfirmoni
          se jeni mbi 18 vjeç dhe se keni aftësi ligjore për t’i pranuar këto
          kushte. Mënyra se si i përpunojmë të dhënat tuaja përshkruhet në{' '}
          <a href="/privacy">Politikën e Privatësisë</a>.
        </p>

        <h3>2. Roli i Platformës</h3>
        <p>
          GjejNjerin.com është një platformë ndërlidhëse që i lidh klientët me
          profesionistët (Ustahët). Ne nuk jemi punëdhënës, agjenci punësimi,
          përfaqësues apo garantues i cilësisë, sigurisë ose rezultatit të
          punës së kryer.
        </p>
        <p>
          Marrëveshjet për çmimin, kohën dhe realizimin e punës bëhen
          drejtpërdrejt mes klientit dhe Ustahut. Ne nuk jemi palë në to dhe
          nuk përpunojmë pagesa mes tyre.
        </p>

        <h3>3. Llogaria Juaj</h3>
        <p>
          Jeni përgjegjës për saktësinë e të dhënave që jepni dhe për ruajtjen e
          të dhënave të hyrjes në llogari. Çdo veprim përmes llogarisë suaj
          konsiderohet se është bërë prej jush. Na njoftoni menjëherë nëse
          dyshoni për përdorim të paautorizuar.
        </p>

        <h3>4. Përgjegjësia e Ustahut</h3>
        <p>
          Çdo Ustah është përgjegjës për saktësinë e të dhënave, përvojës,
          fotografive, çmimeve dhe shërbimeve të publikuara në profil, si dhe
          për zotërimin e licencave ose lejeve që kërkohen me ligj për
          shërbimet që ofron. Informacioni i rremë ose mashtrues mund të çojë
          në pezullim ose mbyllje të llogarisë.
        </p>
        <p>
          Nëse e përdorni funksionin e përshkrimeve me ndihmën e AI, ju mbeteni
          përgjegjës për tekstin që e publikoni. Kontrolloni që ai të jetë i
          saktë para se ta ruani.
        </p>

        <h3>5. Vlerësimet dhe Komentet</h3>
        <p>
          Klientët mund të lënë vlerësime bazuar në përvojën reale. Abuzimi me
          sistemin e vlerësimeve, manipulimi i tyre ose përmbajtja ofenduese
          nuk lejohet.
        </p>
        <p>
          Ne mund të fshijmë komente që përmbajnë gjuhë fyese, kërcënuese,
          shpifëse ose të pavërteta, ose që shkelin këto kushte.
        </p>

        <h3>6. Përmbajtja që Publikoni</h3>
        <p>
          Ju mbeteni pronar i përmbajtjes që ngarkoni (tekste, foto,
          vlerësime). Duke e publikuar, na jepni leje josheskluzive dhe pa
          pagesë ta shfaqim në platformë dhe ta përdorim për funksionimin e
          shërbimit. Garantoni se keni të drejtën ta publikoni dhe se ajo nuk
          cenon të drejtat e të tjerëve (p.sh. fotot e personave të tjerë ose
          të drejtat e autorit). Mund ta fshini përmbajtjen ose llogarinë në
          çdo kohë.
        </p>

        <h3>7. Sjellja e Ndaluar</h3>
        <ul>
          <li>Publikimi i informacionit të rremë ose mashtrues</li>
          <li>Përdorimi i platformës për aktivitete të paligjshme</li>
          <li>Ngacmimi, kërcënimi ose abuzimi me përdorues të tjerë</li>
          <li>Spam, mashtrime ose manipulim i sistemit</li>
          <li>
            Mbledhja automatike e të dhënave (scraping) ose tentimi për të
            penguar funksionimin apo sigurinë e platformës
          </li>
          <li>Përdorimi i të dhënave të tjerëve për qëllime të paautorizuara</li>
        </ul>

        <h3>8. Disponueshmëria e Platformës</h3>
        <p>
          Përpiqemi ta mbajmë platformën funksionale, por nuk garantojmë se do
          të jetë pa ndërprerje ose pa gabime. Mund ta ndryshojmë, ta
          ndërprejmë përkohësisht ose ta përmirësojmë platformën në çdo kohë.
        </p>

        <h3>9. Kufizimi i Përgjegjësisë</h3>
        <p>
          Në masën e lejuar me ligj, GjejNjerin.com nuk mban përgjegjësi për
          dëme, humbje financiare, mosmarrëveshje apo probleme që lindin nga
          marrëveshjet ose puna e kryer mes klientëve dhe Ustahëve, as për
          saktësinë e përmbajtjes që publikojnë përdoruesit.
        </p>
        <p>
          Kjo nuk e përjashton përgjegjësinë tonë për rastet kur ligji nuk lejon
          përjashtim, si dëmet e shkaktuara me dashje ose nga pakujdesia e
          rëndë, dhe nuk i cenon të drejtat që ju takojnë me ligj si
          konsumator.
        </p>

        <h3>10. Pezullimi dhe Mbyllja e Llogarisë</h3>
        <p>
          Mund ta pezullojmë ose ta mbyllim llogarinë tuaj nëse i shkelni këto
          kushte, nëse dyshojmë për mashtrim ose abuzim, ose për arsye sigurie.
          Kur është e arsyeshme, do t’ju njoftojmë për arsyen. Ju mund ta
          mbyllni llogarinë tuaj në çdo kohë duke na kontaktuar.
        </p>

        <h3>11. Ndryshimet në Kushte</h3>
        <p>
          Mund t’i përditësojmë këto Kushte Përdorimi herë pas here. Ndryshimet
          publikohen në këtë faqe me datën e përditësimit dhe hyjnë në fuqi
          pas publikimit. Vazhdimi i përdorimit të platformës pas ndryshimeve
          nënkupton pranimin e tyre.
        </p>

        <h3>12. Ligji i Aplikueshëm dhe Kontakti</h3>
        <p>
          Këto kushte rregullohen sipas legjislacionit në fuqi në Republikën e
          Kosovës. Mosmarrëveshjet synohet të zgjidhen fillimisht me
          bashkëbisedim; në mungesë të zgjidhjes, kompetente janë gjykatat e
          Republikës së Kosovës. Për pyetje na shkruani në{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </div>
    </div>
  );
}