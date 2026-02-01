import { useState } from 'react';
import styles from './Help.module.css';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: "Si mund të marr vlerësime të reja?",
    answer: "Në panelin tuaj (Dashboard), klikoni butonin 'Kërko Vlerësim'. Sistemi do të gjenerojë një link unik të cilin mund t'ia dërgoni klientit tuaj në WhatsApp. Pasi ata të lënë vlerësimin, ai do të shfaqet automatikisht në profilin tuaj."
  },
  {
    question: "Çfarë përfshin statusi PRO?",
    answer: "Statusi PRO ju jep renditje prioritare në kërkime, një distinktiv verifikimi në profilin tuaj, dhe mundësinë për të ngarkuar foto të pakufizuara në portofolin tuaj të punës."
  },
  {
    question: "Si mund të ndryshoj të dhënat e mia?",
    answer: "Shkoni te 'Paneli' nga menuja kryesore. Aty mund të përditësoni emrin, kategorinë e punës, çmimin fillestar dhe foton e profilit."
  },
  {
    question: "Pse nuk po shfaqet profili im në listë?",
    answer: "Sigurohuni që keni plotësuar të paktën emrin, kategorinë dhe keni vendosur një foto profili. Profilet pa informacion bazë fshihen automatikisht nga listimi publik për të ruajtur cilësinë."
  },
  {
    question: "A kushton regjistrimi në Mjeshtri.ks?",
    answer: "Regjistrimi dhe përdorimi bazë i platformës është 100% falas për të gjithë mjeshtrit. Opsioni PRO është një zgjedhje opsionale për ata që duan më shumë shikueshmëri."
  }
];

export default function Help() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className={styles.helpContainer}>
      <header className={styles.header}>
    {/* Split color header */}
    <h1 className={styles.title}>Si mund t'ju <span>ndihmojmë?</span></h1>
    <p>Gjeni përgjigjet për pyetjet më të shpeshta rreth platformës sonë.</p>
  </header>

      <section className={styles.faqSection}>
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className={`${styles.faqItem} ${activeIndex === index ? styles.active : ''}`}
            onClick={() => toggleAccordion(index)}
          >
            <div className={styles.faqQuestion}>
              <h3>{faq.question}</h3>
              <span className={styles.icon}>{activeIndex === index ? '−' : '+'}</span>
            </div>
            <div className={styles.faqAnswer}>
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </section>
      <section className={styles.contactSupport}>
    <div className={styles.supportCard}>
      {/* Split color support card title */}
      <h3 className={styles.supportTitle}>Nuk gjetët atë që <span>kërkonit?</span></h3>
      <p>Na shkruani një mesazh dhe ekipi ynë do t'ju kthejë përgjigje sa më shpejt të jetë e mundur.</p>
      <div className={styles.supportButtons}>
        <Link to="/contact" className={styles.emailBtn}>Dërgo një Mesazh</Link>
      </div>
    </div>
  </section>
    </div>
  );
}