import { Link } from "react-router-dom";
import Logo from "../../../assets/Logo2.png";
import styles from "../../Udhëzues/Udhezues.module.css"
import { BASE, ROUTES, CATEGORIES } from "../config.js";
import { categoryPath, guidePath, cx } from "../lib/helpers.js";

// asH1: only one <h1> per page. Pages that render their own <h1>
// (article, category, not found) pass asH1={false}.
export function Hero({ q, setQ, asH1 }) {
  const Title = asH1 ? "h1" : "p";
  return (
    <header className={styles.hero}>
      <div className={styles.heroContent}>
        <Link to="/">
          <img src={Logo} alt="Gjejnjerin" />
        </Link>
        <Title className={styles.title}>Udhëzues për shtëpinë</Title>
        <p className={styles.heroLede}>
          Hap pas hapi, me skema të qarta: si ta rregullosh vetë punën e vogël dhe kur ia vlen të thërrasësh specialist.
        </p>
      </div>
      <div className={styles.heroAction}>
        <div className={styles.search} role="search">
          <label htmlFor="udhezues-search" className={styles.srOnly}>Kërko udhëzues</label>
          <input
            id="udhezues-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Kërko udhëzues..."
          />
        </div>
      </div>
    </header>
  );
}

export function Tabs({ cat }) {
  return (
    <div className={styles.tabsContainer}>
      <nav className={styles.tabs} aria-label="Kategoritë">
        <Link to={BASE} className={cx(styles.tab, !cat && styles.tabActive)} aria-current={!cat ? "page" : undefined}>
          Të gjitha
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c.id}
            to={categoryPath(c.id)}
            className={cx(styles.tab, cat && cat.id === c.id && styles.tabActive)}
            aria-current={cat && cat.id === c.id ? "page" : undefined}
            data-cat={c.id}
          >
            {c.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

export function Sidebar({ cat, guides, activeSlug }) {
  return (
    <aside className={styles.sidebar} aria-label={`Udhëzues ${cat.label}`}>
      <p className={styles.sideTitle}>{cat.label}</p>
      <ul className={styles.sideList}>
        {guides.map((g) => (
          <li key={g.slug}>
            <Link
              to={guidePath(g)}
              className={cx(styles.sideLink, activeSlug === g.slug && styles.sideLinkActive)}
              aria-current={activeSlug === g.slug ? "page" : undefined}
            >
              <span>{g.title}</span>
              <span className={styles.sideTime}>{g.time}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export function Band() {
  return (
    <section className={styles.band}>
      <div>
        <h2 className={styles.bandTitle}>Nuk e bën dot vetë?</h2>
        <p>Gjej një profesionist në qytetin tënd dhe krahaso përvojën e tyre.</p>
      </div>
      <div className={styles.bandBtns}>
        <Link to={ROUTES.electricians} className={cx(styles.btn, styles.btnAmber)}>
          Gjej elektricistë
        </Link>
        <Link to={ROUTES.plumbers} className={cx(styles.btn, styles.btnTeal)}>
          Gjej hidraulikë
        </Link>
      </div>
    </section>
  );
}
