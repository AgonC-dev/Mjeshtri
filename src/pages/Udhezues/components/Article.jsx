import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "../../Udhëzues/Udhezues.module.css"
import { BASE } from "../config.js";
import { getCategory } from "../data/index.js";
import { categoryPath, guidePath, cx } from "../lib/helpers.js";
import Figure from "./Figures.jsx";

export default function Article({ guide, siblings }) {
  const [done, setDone] = useState(() => new Set());
  const total = guide.steps.length;
  const pct = Math.round((done.size / total) * 100);
  const cat = getCategory(guide.category);
  const idx = siblings.findIndex((g) => g.slug === guide.slug);
  const prev = siblings[idx - 1];
  const next = siblings[idx + 1];

  const toggle = (i) =>
    setDone((s) => {
      const n = new Set(s);
      if (n.has(i)) n.delete(i);
      else n.add(i);
      return n;
    });

  return (
    <article className={styles.article}>
      <nav aria-label="Rruga" className={styles.crumbs}>
        <Link to={BASE}>Udhëzues</Link>
        <Link to={categoryPath(cat.id)}>{cat.label}</Link>
      </nav>

      <h1 className={styles.articleTitle}>{guide.title}</h1>
      <p className={styles.lede}>{guide.summary}</p>

      <ul className={styles.meta} style={{ marginBottom: "28px" }}>
        <li className={styles.chip}>{guide.time}</li>
        <li className={styles.chip}>{guide.level}</li>
        <li className={styles.chip}>{total} hapa</li>
      </ul>

      <div className={styles.warning} role="note">
        <div>
          <strong className={styles.warningTitle}>Siguria para së gjithash</strong>
          <p>{guide.warning}</p>
        </div>
      </div>

      <section className={styles.block}>
        <h2 className={styles.blockTitle}>Çfarë të duhet</h2>
        <ul className={styles.tools}>
          {guide.tools.map((t) => (
            <li key={t} className={styles.tool}>{t}</li>
          ))}
        </ul>
      </section>

      <Figure id={guide.figure} />

      <section className={styles.block}>
        <h2 className={styles.blockTitle}>Hapat</h2>
        <div
          className={styles.progress}
          role="progressbar"
          aria-label="Hapat e kryer"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={done.size}
        >
          <span className={styles.progressBar} style={{ width: `${pct}%` }} />
        </div>
        <p className={styles.progressText}>{done.size} nga {total} hapa të kryer</p>

        <ol className={styles.steps}>
          {guide.steps.map(([t, d], i) => {
            const id = `${guide.slug}-${i}`;
            return (
              <li key={id} className={cx(styles.step, done.has(i) && styles.stepDone)}>
                <span className={styles.stepNum} aria-hidden="true">{i + 1}</span>
                <div>
                  <h3 className={styles.stepTitle}>{t}</h3>
                  <p>{d}</p>
                  <label className={styles.check} htmlFor={id}>
                    <input id={id} type="checkbox" checked={done.has(i)} onChange={() => toggle(i)} />
                    E kam bërë
                  </label>
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className={styles.block}>
        <h2 className={styles.blockTitle}>Këshilla</h2>
        <ul className={styles.tips}>
          {guide.tips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </section>

      <aside className={styles.pro}>
        <h2 className={styles.proTitle}>Kur duhet të thërrasësh specialist</h2>
        <p>{guide.pro}</p>
        {cat.cta && (
          <Link to={cat.cta.to} className={cx(styles.btn, styles.btnAccent)}>
            {cat.cta.label}
          </Link>
        )}
      </aside>

      <nav className={styles.pager} aria-label="Udhëzues të tjerë">
        {prev ? (
          <Link to={guidePath(prev)} className={styles.pagerLink}>
            <span>Më parë</span>
            {prev.title}
          </Link>
        ) : <span />}
        {next && (
          <Link to={guidePath(next)} className={cx(styles.pagerLink, styles.pagerNext)}>
            <span>Më pas</span>
            {next.title}
          </Link>
        )}
      </nav>
    </article>
  );
}
