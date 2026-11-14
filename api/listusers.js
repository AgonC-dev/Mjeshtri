import { getAuth } from "firebase-admin/auth";
import "./lib/firebaseAdmin.js"; // runs initializeApp once

const ADMIN_UID = "mUc8sPZ3IURtFT3As8y0YN9Bsil2";
const PAGE_SIZE = 50;
const MAX_PAGE_TOKEN_LENGTH = 2000;

function fail(res, status, code, message) {
  return res.status(status).json({ success: false, code, message });
}

async function checkAuth(req) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return { error: "UNAUTHORIZED" };
  }

  const token = authHeader.split(" ")[1];

  try {
    // true = also reject tokens that were revoked
    const decodedToken = await getAuth().verifyIdToken(token, true);
    return { uid: decodedToken.uid };
  } catch (error) {
    return { error: "INVALID_TOKEN" };
  }
}

function isValidEmail(email) {
  if (typeof email !== "string") return false;
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Only return fields the admin panel needs (never password hash/salt)
function toSafeUser(user) {
  return {
    uid: user.uid,
    email: user.email ?? null,
    displayName: user.displayName ?? null,
    emailVerified: user.emailVerified,
    disabled: user.disabled,
    createdAt: user.metadata.creationTime,
    lastSignInAt: user.metadata.lastSignInTime ?? null,
    providers: user.providerData.map((p) => p.providerId),
  };
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  // 1. Method
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return fail(res, 405, "METHOD_NOT_ALLOWED", "Method not allowed.");
  }

  // 2. Verify Firebase token
  const { uid, error } = await checkAuth(req);

  if (!uid) {
    return fail(
      res,
      
      401,
      error === "INVALID_TOKEN" ? "INVALID_TOKEN" : "UNAUTHENTICATED",
      "Authentication required."
    );
  }

  // 3. Admin only
  if (uid !== ADMIN_UID) {
    console.warn("Non-admin tried to access admin users endpoint:", uid);
    return fail(res, 403, "FORBIDDEN", "Forbidden.");
  }

  // 4. Extract params (missing or empty both become "")
  const url = new URL(req.url, `https://${req.headers.host}`);
  const email = (url.searchParams.get("email") ?? "").trim().toLowerCase();
  const pageToken = (url.searchParams.get("pageToken") ?? "").trim();

  // 5. Both provided -> 400
  if (email && pageToken) {
    return fail(
      res,
      400,
      "INVALID_PARAMS",
      "Provide either email or pageToken, not both."
    );
  }

  try {
    // Mode A: look up one user by email
    if (email) {
      if (!isValidEmail(email)) {
        return fail(res, 400, "INVALID_EMAIL", "Please provide a valid email.");
      }

      const user = await getAuth().getUserByEmail(email);
      return res.status(200).json({ success: true, user: toSafeUser(user) });
    }

    // Mode B: list users, one page at a time
    if (pageToken.length > MAX_PAGE_TOKEN_LENGTH) {
      return fail(res, 400, "INVALID_PAGE_TOKEN", "Invalid page token.");
    }

    const result = await getAuth().listUsers(PAGE_SIZE, pageToken || undefined);

    return res.status(200).json({
      success: true,
      users: result.users.map(toSafeUser),
      nextPageToken: result.pageToken ?? null, // null = last page
    });
  } catch (err) {
    if (err?.code === "auth/user-not-found") {
      return fail(res, 404, "USER_NOT_FOUND", "No user with that email.");
    }

    if (err?.code === "auth/invalid-page-token") {
      return fail(res, 400, "INVALID_PAGE_TOKEN", "Invalid page token.");
    }

    console.error("Admin users endpoint error:", err);
    return fail(res, 500, "SERVER_ERROR", "Something went wrong.");
  }
}