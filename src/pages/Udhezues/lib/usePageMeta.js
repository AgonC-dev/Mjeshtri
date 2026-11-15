import { useEffect } from "react";
import { SITE } from "../config.js";

function setTag(selector, tag, attrs, valueAttr, value) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    document.head.appendChild(el);
  }
  el.setAttribute(valueAttr, value);
}

// Client-side only: sets <head> after the page loads. It is not enough for
// SEO on its own, an SSR / prerender step should render the same buildMeta()
// output into the HTML that is sent to crawlers.
export function usePageMeta({ title, description, path, jsonLd, noindex }) {
  const ld = jsonLd ? JSON.stringify(jsonLd) : "";

  useEffect(() => {
    document.title = title;
    setTag('meta[name="description"]', "meta", { name: "description" }, "content", description);
    setTag('link[rel="canonical"]', "link", { rel: "canonical" }, "href", SITE + path);
    setTag('meta[name="robots"]', "meta", { name: "robots" }, "content", noindex ? "noindex" : "index,follow");

    document.getElementById("udhezues-jsonld")?.remove();
    if (ld) {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.id = "udhezues-jsonld";
      s.textContent = ld;
      document.head.appendChild(s);
    }
    return () => document.getElementById("udhezues-jsonld")?.remove();
  }, [title, description, path, ld, noindex]);
}
