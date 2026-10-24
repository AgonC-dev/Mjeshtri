import { Link } from "react-router-dom";
import Logo from "../../../assets/Logo2.png";
import styles from "./Electric.module.css";

const BASE = "/udhezues";
const ROUTES = { electricians: "/electricians", plumbers: "/plumbers" };

const CATEGORY_ELEKTRIKE = {
  id: "elektrike",
  label: "Elektrike",
  blurb: "Llamba, çelësa dhe siguresa: punët e vogla që mund t’i bësh vetë dhe shenjat që kërkojnë elektricist.",
  cta: { label: "Gjej elektricistë", to: ROUTES.electricians },
};

const GUIDES_ELEKTRIKE = [
  {
    slug: "si-te-nderrosh-nje-llambe",
    category: "elektrike",
    title: "Si ta ndërrosh një llambë",
    summary: "Nga zgjedhja e fileto-s së duhur deri te vendosja e llambës së re, pa gabime dhe pa goditje.",
    time: "5 min",
    level: "E lehtë",
  },
  {
    slug: "drita-nuk-ndizet",
    category: "elektrike",
    title: "Drita nuk ndizet: gjej shkakun hap pas hapi",
    summary: "Tre kontrolle të thjeshta që zgjidhin shumicën e rasteve, dhe shenjat kur duhet të ndalosh.",
    time: "10-15 min",
    level: "E lehtë",
  },
  {
    slug: "si-te-nderrosh-celesin-e-drites",
    category: "elektrike",
    title: "Si ta ndërrosh një çelës drite",
    summary: "Si funksionon lidhja çelës–llambë dhe si ta ndërrosh një çelës të prishur në mënyrë të sigurt.",
    time: "20-30 min",
    level: "E mesme",
  },
  {
    slug: "siguresa-bie",
    category: "elektrike",
    title: "Siguresa bie: si ta rivendosësh pa rrezik",
    summary: "Pse bie siguresa, si ta gjesh pajisjen fajtore dhe kur të mos e ngresh më.",
    time: "5 min",
    level: "E lehtë",
  },
];

export default function ElektrikeView() {
  return (
    <div className={styles.page} data-cat="elektrike">
   

      {/* Hero Banner */}
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <Link to="/">
            <img src={Logo} alt="Logo" />
          </Link>
          <h1 className={styles.title}>Udhëzues për shtëpinë</h1>
          <p className={styles.heroLede}>
            Hap pas hapi, me skema të qarta: si ta rregullosh vetë punën e vogël dhe kur ia vlen të thërrasësh specialist.
          </p>
        </div>
        <div className={styles.heroAction}>
          {/* <div className={styles.search}>
            <span className={styles.srOnly}>Kërko udhëzues</span>
            <input type="text" placeholder="Kërko udhëzues..." />
          </div> */}
        </div>
      </header>

      {/* Tabs */}
      <div className={styles.tabsContainer}>
        <nav className={styles.tabs} aria-label="Kategoritë">
          <Link to={BASE} className={styles.tab}>Të gjitha</Link>
          <Link to={`${BASE}/elektrike`} className={`${styles.tab} ${styles.tabActive}`}>Elektrike</Link>
          <Link to={`${BASE}/hidraulike`} className={styles.tab}>Hidraulikë</Link>
          <Link to={`${BASE}/fakte`} className={styles.tab}>Fakte interesante</Link>
        </nav>
      </div>

      {/* Wide Layout Container */}
      <div className={styles.layoutSide}>
        <aside className={styles.sidebar} aria-label="Udhëzues Elektrike">
          <p className={styles.sideTitle}>Kategoria</p>
          <ul className={styles.sideList}>
            {GUIDES_ELEKTRIKE.map((g) => (
              <li key={g.slug}>
                <Link to={`${BASE}/${g.category}/${g.slug}`} className={styles.sideLink}>
                  <span>{g.title}</span>
                  <span className={styles.sideTime}>{g.time}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <main className={styles.main}>
          <div className={styles.articleHeaderBlock}>
            <h1 className={styles.articleTitle}>{CATEGORY_ELEKTRIKE.label}</h1>
            <p className={styles.lede}>{CATEGORY_ELEKTRIKE.blurb}</p>
          </div>

          <div className={styles.cards}>
            {GUIDES_ELEKTRIKE.map((g) => (
              <Link key={g.slug} to={`${BASE}/${g.category}/${g.slug}`} className={styles.card}>
                <div>
                  <h3 className={styles.cardTitle}>{g.title}</h3>
                  <p className={styles.cardText}>{g.summary}</p>
                </div>
                <ul className={styles.meta}>
                  <li className={styles.chip}>{g.time}</li>
                  <li className={styles.chip}>{g.level}</li>
                </ul>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}