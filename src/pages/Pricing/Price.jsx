import classes from './price.module.css';

export default function PricingPage() {
  return (
    <main className={classes.container}>
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
          <li>🚀 Renditje Prioritare në kërkime</li>
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