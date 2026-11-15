import { Link } from "react-router-dom";
import styles from "../../Udhëzues/Udhezues.module.css"
import { BASE, CATEGORIES } from "../config.js";
import { GUIDES, FACTS } from "../data/index.js";
import { categoryPath, guidePath } from "../lib/helpers.js";

export function GuideCard({ g }) {
  return (
    <Link to={guidePath(g)} className={styles.card}>
      <h3 className={styles.cardTitle}>{g.title}</h3>
      <p className={styles.cardText}>{g.summary}</p>
      <ul className={styles.meta}>
        <li className={styles.chip}>{g.time}</li>
        <li className={styles.chip}>{g.level}</li>
      </ul>
    </Link>
  );
}

export function GuideCards({ guides }) {
  return (
    <div className={styles.cards}>
      {guides.map((g) => (
        <GuideCard key={g.slug} g={g} />
      ))}
    </div>
  );
}

export function Hub() {
  return (
    <section>
      <h2 className={styles.sectionTitle}>Zgjidh një temë</h2>
      <div className={styles.catGrid}>
        {CATEGORIES.map((c) => {
          const isFacts = c.id === "fakte";
          const count = isFacts ? FACTS.length : GUIDES.filter((g) => g.category === c.id).length;
          return (
            <Link key={c.id} to={categoryPath(c.id)} className={styles.catCard} data-cat={c.id}>
              <h3 className={styles.cardTitle}>{c.label}</h3>
              <p className={styles.cardText}>{c.blurb}</p>
              <ul className={styles.meta}>
                <li className={styles.chip}>{count} {isFacts ? "fakte" : "udhëzues"}</li>
              </ul>
            </Link>
          );
        })}
      </div>
      <h2 className={styles.sectionTitle}>Të gjithë udhëzuesit</h2>
      <GuideCards guides={GUIDES} />
    </section>
  );
}

export function CategoryIndex({ cat, guides }) {
  return (
    <section>
      <div className={styles.articleHeaderBlock}>
        <h1 className={styles.articleTitle}>{cat.label}</h1>
        <p className={styles.lede}>{cat.blurb}</p>
      </div>
      <GuideCards guides={guides} />
    </section>
  );
}

export function FactsGrid({ cat }) {
  return (
    <section>
      <div className={styles.articleHeaderBlock}>
        <h1 className={styles.articleTitle}>{cat.label}</h1>
        <p className={styles.lede}>{cat.blurb}</p>
      </div>
      <div className={styles.factGrid}>
        {FACTS.map((f) => (
          <div key={f.title} className={styles.fact} data-cat={f.tag}>
            <p className={styles.factStat}>{f.stat}</p>
            <h3 className={styles.cardTitle}>{f.title}</h3>
            <p className={styles.cardText}>{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SearchResults({ query, results }) {
  return (
    <section>
      <h2 className={styles.sectionTitle}>Rezultatet për «{query.trim()}»</h2>
      {results.length ? (
        <GuideCards guides={results} />
      ) : (
        <p className={styles.lede}>Nuk gjetëm asnjë udhëzues. Provo një fjalë tjetër.</p>
      )}
    </section>
  );
}

export function NotFound() {
  return (
    <section className={styles.notFound}>
      <h1 className={styles.articleTitle}>Kjo faqe nuk u gjet</h1>
      <p className={styles.lede}>Udhëzuesi që kërkon mund të jetë zhvendosur ose nuk ekziston më.</p>
      <Link to={BASE} className={styles.btn}>Shiko të gjithë udhëzuesit</Link>
    </section>
  );
}
