import { adminDb } from "./_lib/firebaseAdmin.js";

const SITE_URL = "https://gjejnjerin.com";

const STATIC_PAGES = [
  "/",
  "/workers",
  "/wanted",
  "/bashkohu",
  "/about",
  "/contact",
  "/pricing",
  "/help",
  "/privacy",
  "/terms",
  "/refund",
];

function isEligibleForIndexing(worker) {
  return (
    worker.isActive === true &&
    worker.verificationRejected !== true &&
    typeof worker.fullName === "string" &&
    worker.fullName.trim().length > 0 &&
    typeof worker.category === "string" &&
    worker.category.trim().length > 0 &&
    typeof worker.city === "string" &&
    worker.city.trim().length > 0
  );
}

function getLastModified(worker) {
  const timestamp = worker.updatedAt || worker.createdAt;

  if (!timestamp) return null;

  const date = timestamp.toDate
    ? timestamp.toDate()
    : new Date(timestamp);

  return Number.isNaN(date.getTime())
    ? null
    : date.toISOString().split("T")[0];
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export default async function handler(req, res) {
  try {
    const snapshot = await adminDb
      .collection("workers")
      .where("isActive", "==", true)
      .get();

    const urls = STATIC_PAGES.map((path) => ({
      loc: `${SITE_URL}${path}`,
    }));

    snapshot.forEach((doc) => {
      const worker = doc.data();

      if (!isEligibleForIndexing(worker)) return;

      const path =
        worker.isPro === true && worker.slug
          ? `/${worker.slug}`
          : `/worker/${doc.id}`;

      urls.push({
        loc: `${SITE_URL}${path}`,
        lastmod: getLastModified(worker),
      });
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ""}
  </url>`
  )
  .join("\n")}
</urlset>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");

    return res.status(200).send(xml);
  } catch (error) {
    console.error("Sitemap generation failed:", error);

    return res.status(500).send("Could not generate sitemap.");
  }
}