// Pure JS: no JSX, no CSS imports. Node scripts (sitemap) and any future
// SSR / prerender step can import this file directly.

export const SITE = "https://gjejnjerin.com";

// ASCII only on purpose: "/udhëzues" gets percent-encoded in URLs and
// canonicals, which is a classic source of duplicate/mismatched URLs.
export const BASE = "/udhezues";

export const ROUTES = { electricians: "/electricians", plumbers: "/plumbers" };

export const CATEGORIES = [
  {
    id: "elektrike",
    label: "Elektrike",
    blurb:
      "Llamba, çelësa dhe siguresa: punët e vogla që mund t’i bësh vetë dhe shenjat që kërkojnë elektricist.",
    cta: { label: "Gjej elektricistë", to: ROUTES.electricians },
  },
  {
    id: "hidraulike",
    label: "Hidraulikë",
    blurb:
      "Rubineta që pikojnë, lavamanë të bllokuar dhe WC që rrjedh: rregullimet më të shpeshta hap pas hapi.",
    cta: { label: "Gjej hidraulikë", to: ROUTES.plumbers },
  },
  {
    id: "fakte",
    label: "Fakte interesante",
    blurb: "Gjëra të vogla për rrymën dhe ujin që ndoshta nuk i dije.",
    cta: null,
  },
];
