import classes from './Price.module.css';
import { Helmet } from 'react-helmet-async';

export default function PricingPage() {
  return (
    <main className={classes.container}>
      <Helmet>
  <title>Çmimet dhe Planet PRO | Gjejnjerin</title>
  <meta name="description" content="Zbulo planet dhe përfitimet e Gjejnjerin PRO. Përmirëso profilin tënd profesional dhe prezanto shërbimet e tua para klientëve." />
  <link rel="canonical" href="https://gjejnjerin.com/pricing" />
  <meta name="robots" content="index, follow" />

  <meta property="og:type" content="website" />
  <meta property="og:title" content="Çmimet dhe Planet PRO | Gjejnjerin" />
  <meta property="og:description" content="Zbulo përfitimet e Gjejnjerin PRO dhe përmirëso prezantimin e shërbimeve të tua." />
  <meta property="og:url" content="https://gjejnjerin.com/pricing" />
  <meta property="og:image" content="https://gjejnjerin.com/og-image.png" />

  <meta name="twitter:card" content="summary_large_image" />
</Helmet>
      <section className={classes.card}>
        <h1 className={classes.title}>PRO Membership</h1>
        <p className={classes.subtitle}>
          Zhblloko të gjitha mundësitë dhe rrit biznesin tënd 🚀
        </p>

        <div className={classes.priceBox}>
          <span className={classes.price}>€14.99</span>
          <span className={classes.period}>/muaj</span>
        </div>

        <ul className={classes.features}>
          <li>🚀 Renditje Prioritare në kërkime.</li>
          <li>💎 Distinktiv i Verifikuar</li>
          <li>🖼️ Portofolio pa limit</li>
          <li>🔗 Link publik i profilit</li>
          <li>⚡ Distinktiv "Reagim i shpejtë"</li>
          <li>⭐ Shfaqje PRO në profil</li>
        </ul>

        <h3 className={classes.sectionTitle}>Paneli i Performancës</h3>

        <ul className={classes.features}>
          <li>📊 Statistika LIVE (klikime, interesim)</li>
          <li>⭐ Reputacion & vlerësime</li>
          <li>🎯 Shkalla e konvertimit</li>
          <li>🕒 Aktiviteti i fundit</li>
          <li>🔒 Të dhëna private vetëm për ju</li>
        </ul>

        <button className={classes.button}>
          Vazhdo te pagesa
        </button>
      </section>
    </main>
  );
}