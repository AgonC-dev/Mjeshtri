
import { getAuth } from "firebase-admin/auth";
import "../lib/firebaseAdmin.js";

const ADMIN_UID = "mUc8sPZ3IURtFT3As8y0YN9Bsil2";

const VERCEL_API = "https://api.vercel.com";
const ALLOWED_RANGES = [7, 30, 90];
const REQUEST_TIMEOUT = 10000;

function fail(res, status, code, message) {
  return res.status(status).json({
    success: false,
    code,
    message,
  });
}

async function checkAuth(req) {
  const authHeader = req.headers.authorization;

  if (typeof authHeader !== "string") {
    return { error: "UNAUTHENTICATED" };
  }

  const match = authHeader.match(/^Bearer ([^\s]+)$/);

  if (!match) {
    return { error: "UNAUTHENTICATED" };
  }

  try {
    const decodedToken = await getAuth().verifyIdToken(match[1], true);

    return { uid: decodedToken.uid };
  } catch {
    return { error: "INVALID_TOKEN" };
  }
}

function getDateRange(days) {
  const until = new Date();
  const since = new Date(until);

  since.setUTCDate(since.getUTCDate() - days);

  return {
    since: since.toISOString(),
    until: until.toISOString(),
  };
}

async function fetchVercelAnalytics(endpoint, params) {
  const url = new URL(`${VERCEL_API}${endpoint}`);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.VERCEL_ACCESS_TOKEN}`,
      Accept: "application/json",
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    console.error("Vercel Analytics API error:", {
      status: response.status,
      endpoint,
      // Don't log the access token.
    });

    throw new Error("VERCEL_API_ERROR");
  }

  if (!data) {
    throw new Error("INVALID_VERCEL_RESPONSE");
  }

  return data;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  // 1. Method
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");

    return fail(
      res,
      405,
      "METHOD_NOT_ALLOWED",
      "Method not allowed."
    );
  }

  // 2. Firebase authentication
  const { uid, error } = await checkAuth(req);

  if (!uid) {
    return fail(
      res,
      401,
      error === "INVALID_TOKEN" ? "INVALID_TOKEN" : "UNAUTHENTICATED",
      "Authentication required."
    );
  }

  // 3. Admin authorization
  if (uid !== ADMIN_UID) {
    console.warn("Unauthorized analytics access attempt:", uid);

    return fail(
      res,
      403,
      "FORBIDDEN",
      "Forbidden."
    );
  }

  // 4. Check environment variables
  const {
    VERCEL_ACCESS_TOKEN,
    VERCEL_PROJECT_ID,
    VERCEL_TEAM_ID,
  } = process.env;

  if (!VERCEL_ACCESS_TOKEN || !VERCEL_PROJECT_ID) {
    console.error("Missing Vercel Analytics environment variables.");

    return fail(
      res,
      500,
      "CONFIGURATION_ERROR",
      "Analytics configuration is incomplete."
    );
  }

  // 5. Validate requested date range
  const url = new URL(req.url, "http://localhost");
  const rangeParam = url.searchParams.get("range") ?? "30";
  const range = Number(rangeParam);

  if (!ALLOWED_RANGES.includes(range)) {
    return fail(
      res,
      400,
      "INVALID_RANGE",
      "Range must be 7, 30, or 90 days."
    );
  }

  const { since, until } = getDateRange(range);

  // Shared parameters
  const commonParams = {
    projectId: VERCEL_PROJECT_ID,
    since,
    until,
    ...(VERCEL_TEAM_ID && {
      teamId: VERCEL_TEAM_ID,
    }),
  };

  try {
    // 6. Fetch all analytics datasets concurrently
    const [
      totals,
      daily,
      topPages,
      topCountries,
      topReferrers,
    ] = await Promise.all([
      // Total page views and visitors
      fetchVercelAnalytics(
        "/v1/query/web-analytics/visits/count",
        commonParams
      ),

      // Daily traffic for charts
      fetchVercelAnalytics(
        "/v1/query/web-analytics/visits/aggregate",
        {
          ...commonParams,
          by: "day",
          limit: 100,
        }
      ),

      // Most visited pages
      fetchVercelAnalytics(
        "/v1/query/web-analytics/visits/aggregate",
        {
          ...commonParams,
          by: "requestPath",
          limit: 10,
        }
      ),

      // Visitor countries
      fetchVercelAnalytics(
        "/v1/query/web-analytics/visits/aggregate",
        {
          ...commonParams,
          by: "country",
          limit: 10,
        }
      ),

      // Traffic sources
      fetchVercelAnalytics(
        "/v1/query/web-analytics/visits/aggregate",
        {
          ...commonParams,
          by: "referrerHostname",
          limit: 10,
        }
      ),
    ]);

    // 7. Return analytics
    return res.status(200).json({
      success: true,
      range,
      period: {
        since,
        until,
      },
      analytics: {
        totals: totals.data,
        daily: daily.data,
        topPages: topPages.data,
        topCountries: topCountries.data,
        topReferrers: topReferrers.data,
      },
    });
  } catch (err) {
    console.error("Admin analytics endpoint error:", err);

    return fail(
      res,
      502,
      "ANALYTICS_UNAVAILABLE",
      "Unable to retrieve analytics data."
    );
  }
}
