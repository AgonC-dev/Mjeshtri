// Pure function: (category, slug) -> everything a <head> needs.
// Used by the client hook today, and by an SSR function or Next.js
// generateMetadata() later. No DOM, no React.
import { SITE, BASE } from "../config.js";
import { getCategory, getGuide } from "../data/index.js";
import { categoryPath, guidePath } from "./helpers.js";

export function buildMeta(categoryId, slug) {
  const cat = categoryId ? getCategory(categoryId) : null;
  const guide = slug ? getGuide(categoryId, slug) : null;

  // Unknown category or guide. An SSR layer should also send HTTP 404 here.
  if ((categoryId && !cat) || (slug && !guide)) {
    return {
      status: 404,
      title: "Faqja nuk u gjet | Gjejnjerin",
      description: "Kjo faqe nuk ekziston.",
      path: BASE,
      noindex: true,
      jsonLd: null,
    };
  }

  if (guide) {
    const url = SITE + guidePath(guide);

    const article = {
      "@type": "Article",
      "@id": `${url}#article`,
      headline: guide.title,
      description: guide.summary,
      inLanguage: "sq",
      mainEntityOfPage: url,
      publisher: { "@type": "Organization", name: "Gjejnjerin", url: SITE },
    };
    if (guide.published) article.datePublished = guide.published;
    if (guide.updated || guide.published) {
      article.dateModified = guide.updated || guide.published;
    }

    const breadcrumbs = {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Udhëzues", item: SITE + BASE },
        {
          "@type": "ListItem",
          position: 2,
          name: getCategory(guide.category).label,
          item: SITE + categoryPath(guide.category),
        },
        { "@type": "ListItem", position: 3, name: guide.title, item: url },
      ],
    };

    return {
      status: 200,
      title: `${guide.title} | Gjejnjerin`,
      description: guide.summary,
      path: guidePath(guide),
      noindex: false,
      jsonLd: { "@context": "https://schema.org", "@graph": [article, breadcrumbs] },
    };
  }

  if (cat) {
    return {
      status: 200,
      title: `${cat.label}: udhëzues praktikë | Gjejnjerin`,
      description: cat.blurb,
      path: categoryPath(cat.id),
      noindex: false,
      jsonLd: null,
    };
  }

  return {
    status: 200,
    title: "Udhëzues për shtëpinë: elektrike dhe hidraulikë | Gjejnjerin",
    description: "Udhëzues hap pas hapi për punë të vogla në shtëpi.",
    path: BASE,
    noindex: false,
    jsonLd: null,
  };
}
