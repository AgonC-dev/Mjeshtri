import styles from './Privacy.module.css';
import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

// TODO: fill these in before publishing
const CONTROLLER_NAME = '[Emri juaj ose i biznesit]';
const CONTROLLER_ADDRESS = '[Adresa, Qyteti, Kosovë]';
const CONTACT_EMAIL = 'info@gjejmjeshtrin.ks'; // use your real, working email

export default function Privacy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={styles.container}>
      <Helmet>
        <title>Politika e Privatësisë | Gjejnjerin</title>
        <meta name="description" content="Lexo politikën e privatësisë së Gjejnjerin dhe mëso si mbledhim, përdorim dhe mbrojmë të dhënat personale të përdoruesve." />
        <link rel="canonical" href="https://gjejnjerin.com/privacy" />
        <meta name="robots" content="index, follow" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Politika e Privatësisë | Gjejnjerin" />
        <meta property="og:description" content="Informohu rreth mbledhjes, përdorimit dhe mbrojtjes së të dhënave personale në Gjejnjerin." />
        <meta property="og:url" content="https://gjejnjerin.com/privacy" />
        <meta property="og:image" content="https://gjejnjerin.com/og-image.png" />

        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <h1 className={styles.title}>
        Politika e <span>Privatësisë</span>
      </h1>

      <div className={styles.contentSection}>
        <p className={styles.leadText}>
          Mirë se vini në <strong>GjejNjerin.com</strong>. Ne e respektojmë
          privatësinë tuaj dhe i përpunojmë të dhënat personale në përputhje me
          Ligjin Nr. 06/L-082 për Mbrojtjen e të Dhënave Personale të Republikës
          së Kosovës. Kjo politikë shpjegon çfarë të dhënash mbledhim, pse i
          mbledhim, me kë i ndajmë dhe cilat janë të drejtat tuaja.
        </p>

        <h3>1. Kontrolluesi i të Dhënave</h3>
        <p>
          Kontrollues i të dhënave tuaja personale është {CONTROLLER_NAME},
          me adresë {CONTROLLER_ADDRESS}. Kontakti:{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>

        <h3>2. Të Dhënat që Mbledhim</h3>
        <p>
          <strong>Të dhënat që na jepni ju</strong> (kur krijoni llogari ose
          profil si Ustah):
        </p>
        <ul>
          <li>Emri dhe mbiemri</li>
          <li>Adresa e email-it dhe të dhënat e hyrjes në llogari</li>
          <li>Numri i telefonit</li>
          <li>Lokacioni (qyteti / zona)</li>
          <li>Kategoria e shërbimit, përvoja dhe çmimi fillestar</li>
          <li>Përshkrimi i profilit dhe fotoja e profilit (nëse i ngarkoni)</li>
          <li>Vlerësimet dhe komentet që lini për Ustahët</li>
          <li>Mesazhet që na dërgoni drejtpërdrejt</li>
        </ul>
        <p>
          <strong>Të dhëna që mblidhen automatikisht:</strong>
        </p>
        <ul>
          <li>Adresa IP, lloji i pajisjes, shfletuesi dhe sistemi operativ</li>
          <li>Faqet që vizitoni, kohëzgjatja e vizitës dhe të dhëna për
            shpejtësinë e ngarkimit të faqeve</li>
        </ul>
        <p>
          Vizitorët që nuk krijojnë llogari mund ta shfletojnë platformën pa na
          dhënë të dhëna personale, përveç të dhënave automatike të përmendura
          më sipër.
        </p>

        <h3>3. Pse i Përpunojmë të Dhënat dhe Mbi Çfarë Baze Ligjore</h3>
        <ul>
          <li>
            <strong>Ofrimi i shërbimit (kontrata):</strong> krijimi dhe
            menaxhimi i llogarisë, shfaqja e profilit tuaj në rezultatet e
            kërkimit dhe në Live Ranking, lidhja e klientëve me Ustahët.
          </li>
          <li>
            <strong>Interesi ynë legjitim:</strong> siguria e platformës,
            parandalimi i mashtrimeve, spamit dhe abuzimeve, kufizimi i
            kërkesave të tepërta (rate limiting) dhe përmirësimi teknik i
            platformës.
          </li>
          <li>
            <strong>Pëlqimi juaj:</strong> analitika përmes Google Analytics.
            Ajo aktivizohet vetëm nëse e pranoni në banerin e cookies.
          </li>
          <li>
            <strong>Detyrimet ligjore:</strong> kur na kërkohet nga një organ
            kompetent sipas ligjit.
          </li>
        </ul>
        <p>
          Nuk i përdorim të dhënat tuaja për marketing pa pëlqimin tuaj dhe nuk
          marrim vendime plotësisht automatike që ju prekin ligjërisht.
        </p>

        <h3>4. Numri i Telefonit i Ustahëve</h3>
        <p>
          Numri i telefonit i Ustahëve shfaqet publikisht në profilin e tyre, që
          klientët t’i kontaktojnë drejtpërdrejt. Duke e shtuar numrin në
          profil, ju pranoni që ai të jetë i dukshëm për të gjithë vizitorët e
          platformës. Nëse nuk dëshironi, mos e shtoni ose na kërkoni ta
          heqim.
        </p>

        <h3>5. Përshkrime të Gjeneruara me Ndihmën e AI</h3>
        <p>
          Platforma ofron një funksion që ju ndihmon ta shkruani përshkrimin e
          profilit tuaj me ndihmën e inteligjencës artificiale. Kur e përdorni,
          të dhënat që i keni futur për profilin (p.sh. kategoria, përvoja,
          çmimi) i dërgohen ofruesit të shërbimit të AI (OpenAI) vetëm për të
          gjeneruar tekstin. Ju vendosni nëse do ta përdorni tekstin e
          propozuar.
        </p>

        <h3>6. Cookies dhe Mjetet e Analitikës</h3>
        <p>Ne përdorim këto mjete:</p>
        <ul>
          <li>
            <strong>Cookies dhe ruajtje lokale të nevojshme:</strong> për
            funksionimin e llogarisë (hyrja në llogari) dhe për të ruajtur
            zgjedhjen tuaj për cookies. Këto nuk kërkojnë pëlqim.
          </li>
          <li>
            <strong>Google Analytics (Google LLC):</strong> mat se si e
            përdorin vizitorët faqen. Përdor cookies dhe identifikues online dhe
            ngarkohet <strong>vetëm pasi ta pranoni</strong>.
          </li>
          <li>
            <strong>Vercel Analytics:</strong> statistika të përgjithshme të
            vizitave (faqet e hapura, lloji i pajisjes dhe shfletuesit, vendi),
            pa ju ndjekur nëpër faqe të tjera.
          </li>
          <li>
            <strong>Vercel Speed Insights:</strong> mat shpejtësinë dhe
            performancën e faqes për ta përmirësuar përvojën tuaj.
          </li>
        </ul>
        <p>
          Zgjedhjen tuaj e ruajmë në shfletuesin tuaj. Mund ta ndryshoni në çdo
          kohë duke fshirë të dhënat e faqes në shfletues (Cookies dhe Site
          data), pas së cilës baneri shfaqet përsëri, ose duke na kontaktuar.
          Cookies tashmë të vendosura mund t’i fshini edhe përmes cilësimeve të
          shfletuesit tuaj.
        </p>

        <h3>7. Me Kë i Ndajmë të Dhënat</h3>
        <p>
          Nuk i shesim të dhënat tuaja. I ndajmë vetëm me ofrues shërbimesh që
          përpunojnë të dhëna në emrin tonë dhe vetëm për qëllimet e
          përshkruara më sipër:
        </p>
        <ul>
          <li>Google (Firebase: autentikimi dhe baza e të dhënave; Google Analytics)</li>
          <li>Vercel Inc. (hostimi i platformës, Analytics dhe Speed Insights)</li>
          <li>OpenAI (vetëm për funksionin e përshkrimeve me AI)</li>
          <li>Upstash (kufizimi i kërkesave të tepërta, bazuar në adresën IP)</li>
        </ul>
        <p>
          Të dhënat mund t’u jepen edhe organeve shtetërore kur kjo kërkohet
          me ligj. Të dhënat që i publikoni në profil (emri, telefoni, qyteti,
          kategoria, foto, vlerësime) janë të dukshme për vizitorët e
          platformës.
        </p>

        <h3>8. Transferimi Ndërkombëtar</h3>
        <p>
          Disa nga ofruesit e mësipërm mund t’i përpunojnë të dhënat jashtë
          Kosovës, përfshirë në Bashkimin Evropian dhe Shtetet e Bashkuara. Ne
          zgjedhim ofrues që zbatojnë masa mbrojtëse të njohura, si klauzolat
          standarde kontraktuale ose mekanizma të ngjashëm, në përputhje me
          ligjin.
        </p>

        <h3>9. Sa Kohë i Ruajmë të Dhënat</h3>
        <ul>
          <li>
            Të dhënat e llogarisë dhe të profilit ruhen derisa llogaria të jetë
            aktive. Pas fshirjes së llogarisë, i fshijmë ose anonimizojmë brenda
            një afati të arsyeshëm, përveç nëse ligji kërkon ruajtje më të
            gjatë.
          </li>
          <li>
            Të dhënat e analitikës ruhen sipas afateve të ofruesve përkatës
            (për Google Analytics, afati i konfiguruar në llogarinë tonë).
          </li>
          <li>
            Të dhënat për siguri dhe rate limiting ruhen vetëm për një kohë të
            shkurtër.
          </li>
        </ul>

        <h3>10. Siguria e të Dhënave</h3>
        <p>
          Ne përdorim masa teknike dhe organizative për të mbrojtur të dhënat
          tuaja nga aksesi i paautorizuar, ndryshimi, zbulimi apo humbja, si
          lidhje të enkriptuara (HTTPS) dhe kontroll të aksesit. Megjithatë,
          asnjë sistem online nuk është 100% i sigurt. Në rast cenimi të të
          dhënave që ju rrezikon, do të njoftojmë autoritetin dhe, kur
          kërkohet, ju.
        </p>

        <h3>11. Të Drejtat Tuaja</h3>
        <p>Sipas ligjit, ju keni të drejtë:</p>
        <ul>
          <li>Të kërkoni qasje në të dhënat tuaja</li>
          <li>Të kërkoni korrigjimin e të dhënave të pasakta</li>
          <li>Të kërkoni fshirjen e të dhënave dhe të llogarisë</li>
          <li>Të kërkoni kufizimin e përpunimit</li>
          <li>Të kundërshtoni përpunimin e bazuar në interes legjitim</li>
          <li>Të kërkoni bartshmërinë e të dhënave</li>
          <li>Ta tërhiqni pëlqimin në çdo kohë, pa cenuar ligjshmërinë e
            përpunimit të bërë më parë</li>
        </ul>
        <p>
          Për çdo kërkesë na shkruani në{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Do t’ju
          përgjigjemi brenda afatit ligjor. Nëse mendoni se të drejtat tuaja
          janë cenuar, keni të drejtë të paraqisni ankesë te Agjencia për
          Informim dhe Privatësi (AIP) e Republikës së Kosovës.
        </p>

        <h3>12. Fëmijët</h3>
        <p>
          Platforma nuk është e destinuar për persona nën moshën 18 vjeç dhe nuk
          mbledhim qëllimisht të dhëna nga ta. Nëse mendoni se një i mitur na ka
          dhënë të dhëna, na kontaktoni dhe do t’i fshijmë.
        </p>

        <h3>13. Ndryshimet në Politikë</h3>
        <p>
          Ne mund ta përditësojmë këtë politikë herë pas here, sidomos nëse
          shtojmë mjete të reja. Çdo ndryshim publikohet në këtë faqe me datën e
          përditësimit.
        </p>

        <div className={styles.date}>
          E përditësuar së fundmi: Nëntor 2026
        </div>
      </div>
    </div>
  );
}