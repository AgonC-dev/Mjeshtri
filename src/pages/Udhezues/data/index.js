import { CATEGORIES } from "../config.js";
import { normalize } from "../lib/helpers.js";
import { ELEKTRIKE_GUIDES } from "./elektrike.js";
import { HIDRAULIKE_GUIDES } from "./hidraulike.js";
import { FACTS } from "./facts.js";

export { FACTS };

export const GUIDES = [...ELEKTRIKE_GUIDES, ...HIDRAULIKE_GUIDES];

export const getCategory = (id) => CATEGORIES.find((c) => c.id === id) || null;

export const getGuides = (categoryId) =>
  GUIDES.filter((g) => g.category === categoryId);

export const getGuide = (categoryId, slug) =>
  GUIDES.find((g) => g.slug === slug && g.category === categoryId) || null;

// Returns null when the query is empty, so callers can tell
// "no search" apart from "search with no results".
export function searchGuides(query) {
  const n = normalize((query || "").trim());
  if (!n) return null;
  return GUIDES.filter((g) => normalize(`${g.title} ${g.summary}`).includes(n));
}
