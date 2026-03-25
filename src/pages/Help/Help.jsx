import { useState } from 'react';
import styles from './Help.module.css';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: "Si funksionon sistemi i vlerësimeve?",
    answer: "Sistemi ynë bazohet në vërtetësi. Në Dashboard, ju gjeneroni një link unik për vlerësim. Kur klienti klikon linkun, ai verifikohet përmes WhatsApp-it për të lënë vlerësimin. Kjo siguron që çdo yll në profilin tuaj të jetë nga një person real dhe punë e vërtetë."
  },
  {
    question: "Çfarë përfitimesh ka statusi PRO?",
    answer: "Anëtarët PRO renditen gjithmonë në krye të kërkimeve (Top Ranking), marrin distinktivin 'PRO' që rrit besimin te klientët, dhe shfaqen në faqen kryesore si 'Mjeshtër të Rekomanduar'. Gjithashtu, profilet PRO kanë akses në statistika të detajuara të shikueshmërisë."
  },
  {
    question: "Pse është i rëndësishëm verifikimi me WhatsApp?",
    answer: "Ne duam të shmangim vlerësimet e rreme. Duke përdorur WhatsApp, ne sigurohemi që personi që po ju vlerëson është një klient real. Ky proces rrit prestigjin tuaj dhe i jep siguri çdo klienti të ri që viziton profilin tuaj."
  },
  {
    question: "Si mund të shfaqem në faqen kryesore (Featured)?",
    answer: "Faqja kryesore është e rezervuar për Mjeshtrit PRO që kanë vlerësime pozitive aktive. Sistemi ynë përzgjedh automatikisht mjeshtrit më aktivë dhe me vlerësimet më të larta për t'i promovuar te vizitorët e rinj."
  },
  {
    question: "A mund të fshij një vlerësim që nuk më pëlqen?",
    answer: "Për të ruajtur integritetin e platformës, vlerësimet nuk mund të fshihen nga mjeshtri. Megjithatë, nëse mendoni se një vlerësim është abuziv ose i pavërtetë, mund të kontaktoni suportin tonë për një rishikim manual të rastit."
  },
  {
    question: "Si të bëhem pjesë e listës së të preferuarve (Favorites)?",
    answer: "Klientët mund t'ju shtojnë në listën e tyre të preferuar duke klikuar ikonën e zemrës në profilin tuaj. Kjo i lejon ata t'ju gjejnë shpejt pa pasur nevojë të kërkojnë përsëri në listën e madhe të mjeshtërve."
  },
  {
    question: "Sa kushton shërbimi?",
    answer: "Regjistrimi dhe krijimi i profilit është plotësisht FALAS. Ne besojmë në mbështetjen e mjeshtërve vendorë. Opsioni PRO është një investim minimal për ata që duan të rrisin xhiron e punës përmes reklamimit prioritar."
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