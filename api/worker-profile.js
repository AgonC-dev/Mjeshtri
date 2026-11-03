
import { adminDb } from "./lib/firebaseAdmin.js";
import { render } from "../dist-server/entry-server.js";
import { readFile } from "node:fs/promises";

// Convert Firestore timestamps and nested values into JSON-safe data.
function serialize(value) {
  if (value === null || value === undefined) return value;

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (typeof value?.toDate === "function") {
    return value.toDate().toISOString();
  }

  if (Array.isArray(value)) {
    return value.map(serialize);
  }

  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [
        key,
        serialize(val),
      ])
    );
  }

  return value;
}

// Only include fields that are needed on the public worker profile.
function getPublicWorker(workerDoc) {
  const data = workerDoc.data();

  const publicWorker = {
    id: workerDoc.id,
    fullName: data.fullName,
    category: data.category,
    city: data.city,
    bio: data.bio,
    phoneNumber: data.phoneNumber,
    profilePic: data.profilePic,
    portfolio: data.portfolio,
    experienceYears: data.experienceYears,
    isPro: data.isPro,
    isVerified: data.isVerified,
    showProStar: data.showProStar,
    rating: data.rating,
    startingPrice: data.startingPrice,
    quickResponse: data.quickResponse,
    slug: data.slug,
  };

  return serialize(publicWorker);
}

// Only expose fields that are intended to appear in public reviews.
function getPublicReview(reviewDoc) {
  const data = reviewDoc.data();

  return serialize({
    id: reviewDoc.id,
    customerName: data.customerName,
    rating: data.rating,
    comment: data.comment,
    createdAt: data.createdAt,
    isVerified: data.isVerified,
  });
}

function escapeJson(data) {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).send("Method not allowed");
  }

  try {
    const type = req.query.type;
    const key = req.query.id || req.query.slug;
    const requestedPath = req.query.path;

    if (!key || !requestedPath) {
      return res.status(400).send("Missing worker information");
    }

    let workerDoc;

    if (type === "id") {
      workerDoc = await adminDb
        .collection("workers")
        .doc(String(key))
        .get();

      if (!workerDoc.exists) {
        return res.status(404).send("Worker not found");
      }
    } else if (type === "slug") {
      const snapshot = await adminDb
        .collection("workers")
        .where("slug", "==", String(key))
        .limit(1)
        .get();

      if (snapshot.empty) {
        return res.status(404).send("Worker not found");
      }

      workerDoc = snapshot.docs[0];
    } else {
      return res.status(400).send("Invalid worker type");
    }

    const workerData = workerDoc.data();

    // Only publicly active workers can be rendered or indexed.
     if (
  workerData.isActive !== true ||
  workerData.isSuspend !== false ||
  !workerData.fullName ||
  !workerData.category ||
  !workerData.city
) {
  return res.status(404).send("Worker not found");
}

    // Custom slugs are reserved for PRO workers.
    if (type === "slug" && workerData.isPro !== true) {
      return res.status(404).send("Worker not found");
    }

    const reviewsSnapshot = await adminDb
      .collection("reviews")
      .where("workerId", "==", workerDoc.id)
      .where("status", "==", "approved")
      .orderBy("createdAt", "desc")
      .get();

    const initialData = serialize({
      worker: getPublicWorker(workerDoc),
      reviews: reviewsSnapshot.docs.map(getPublicReview),
    });

    const { appHtml, helmet } = render(
      String(requestedPath),
      initialData
    );

    let html = await readFile(
      new URL("../dist/index.html", import.meta.url),
      "utf8"
    );

    html = html.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>`
    );

    const helmetTitle = helmet?.title?.toString() || "";

const helmetTags = helmet
  ? [
      helmet.meta.toString(),
      helmet.link.toString(),
    ].join("")
  : "";

// Replace the default Vite title instead of creating a duplicate.
if (helmetTitle) {
  html = html.replace(
    /<title[^>]*>[\s\S]*?<\/title>/i,
    helmetTitle
  );
}

html = html.replace("</head>", `${helmetTags}</head>`);

    const hydrationScript = `
      <script>
        window.__GJEJNJERIN_SSR__ = true;
        window.__GJEJNJERIN_INITIAL_DATA__ = ${escapeJson(initialData)};
      </script>
    `;

    html = html.replace(
      "</body>",
      `${hydrationScript}</body>`
    );

    res.setHeader("Content-Type", "text/html; charset=utf-8");

    res.setHeader(
      "Cache-Control",
      "public, s-maxage=60, stale-while-revalidate=300"
    );

    return res.status(200).send(html);
  } catch (error) {
    console.error("Worker SSR error:", error);

    return res.status(500).send("Unable to render worker profile");
  }
}
