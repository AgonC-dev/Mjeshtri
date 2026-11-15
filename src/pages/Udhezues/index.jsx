import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../Udhëzues/Udhezues.module.css";
import { getCategory, getGuide, getGuides, searchGuides } from "./data/index.js";
import { buildMeta } from "./lib/meta.js";
import { usePageMeta } from "./lib/usePageMeta.js";
import { cx } from "./lib/helpers.js";
import Article from "./components/Article.jsx";
import { Hero, Tabs, Sidebar, Band } from "./components/Layout.jsx";
import {
  Hub,
  CategoryIndex,
  FactsGrid,
  SearchResults,
  NotFound,
} from "./components/Listings.jsx";

// Routes (react-router v6), all pointing at this one component:
//   /udhezues
//   /udhezues/:category
//   /udhezues/:category/:slug
export default function Udhezues() {
  const { category, slug } = useParams();
  const [q, setQ] = useState("");

  const cat = category ? getCategory(category) : null;
  const guide = slug ? getGuide(category, slug) : null;
  const invalid = Boolean((category && !cat) || (slug && !guide));
  const catGuides = cat ? getGuides(cat.id) : [];
  const results = useMemo(() => searchGuides(q), [q]);

  usePageMeta(buildMeta(category, slug));

  // New page = start at the top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category, slug]);

  const searching = results !== null;
  const showSidebar = Boolean(cat && cat.id !== "fakte" && !searching && !invalid);

  // Pages that render their own <h1> make the hero title a <p>
  const heroIsH1 = searching || (!cat && !invalid);

  let content;
  if (searching) {
    content = <SearchResults query={q} results={results} />;
  } else if (invalid) {
    content = <NotFound />;
  } else if (guide) {
    content = <Article key={guide.slug} guide={guide} siblings={catGuides} />;
  } else if (cat && cat.id === "fakte") {
    content = <FactsGrid cat={cat} />;
  } else if (cat) {
    content = <CategoryIndex cat={cat} guides={catGuides} />;
  } else {
    content = <Hub />;
  }

  return (
    <div className={styles.page} data-cat={cat ? cat.id : "elektrike"}>
      <div className={styles.tape} aria-hidden="true" />
      <Hero q={q} setQ={setQ} asH1={heroIsH1} />
      <Tabs cat={cat} />

      <div className={cx(styles.layout, showSidebar && styles.layoutSide)}>
        {showSidebar && (
          <Sidebar cat={cat} guides={catGuides} activeSlug={guide ? guide.slug : null} />
        )}
        <main className={styles.main}>{content}</main>
      </div>

      <Band />
    </div>
  );
}
