// Pure helpers (no JSX, no CSS) so Node scripts can import them too.
import { BASE } from "../config.js";

export const cx = (...a) => a.filter(Boolean).join(" ");

export const normalize = (s) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

export const categoryPath = (id) => `${BASE}/${id}`;
export const guidePath = (g) => `${BASE}/${g.category}/${g.slug}`;
