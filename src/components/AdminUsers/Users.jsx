import { useState, useEffect, useCallback } from "react";
import { auth } from "../../api/firebase";
import styles from "./Users.module.css";

const ENDPOINT = "/api/listusers"; // change to your real route

async function request(query = "") {
  const user = auth.currentUser;
  if (!user) {
    const err = new Error("NO_USER");
    err.code = "NO_USER";
    throw err;
  }

  const token = await user.getIdToken();

  const res = await fetch(`${ENDPOINT}${query}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  // If the server returned HTML or nothing, don't crash on res.json()
  const data = await res.json().catch(() => ({}));

  if (!res.ok || !data.success) {
    const err = new Error(data.message || "REQUEST_FAILED");
    err.status = res.status;
    err.code = data.code;
    throw err;
  }

  return data;
}

function getErrorMessage(err) {
  if (err.code === "NO_USER") return "Ju lutem kyçuni përsëri.";
  if (err.status === 401) return "Sesioni ka skaduar. Kyçuni përsëri.";
  if (err.status === 403) return "Nuk keni leje për këtë faqe.";
  if (err.status === 404) return "Nuk u gjet asnjë përdorues me këtë email.";
  if (err.status === 400) return "Kërkesa nuk është e vlefshme. Kontrolloni emailin.";
  if (err.status >= 500) return "Gabim në server. Provoni përsëri më vonë.";
  return "Nuk u lidh me serverin. Kontrolloni internetin.";
}

function formatDate(value) {
  if (!value) return "Asnjëherë";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("sq-AL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getInitial(user) {
  const source = user.displayName || user.email || "?";
  return source.trim().charAt(0).toUpperCase();
}

function UserCard({ user, index, onCopy, copied }) {
  return (
    <article className={styles.card} style={{ "--i": index }}>
      <div className={styles.avatar}>{getInitial(user)}</div>

      <div className={styles.info}>
        <h3 className={styles.name}>{user.displayName || "Pa emër"}</h3>
        <p className={styles.email}>{user.email || "Pa email"}</p>

        <div className={styles.meta}>
          <span>Regjistruar: {formatDate(user.createdAt)}</span>
          <span>Hyrja e fundit: {formatDate(user.lastSignInAt)}</span>
        </div>

        <div className={styles.badges}>
          <span
            className={`${styles.badge} ${
              user.emailVerified ? styles.badgeGreen : styles.badgeGray
            }`}
          >
            {user.emailVerified ? "Email i verifikuar" : "Pa verifikuar"}
          </span>

          {user.disabled && (
            <span className={`${styles.badge} ${styles.badgeRed}`}>I çaktivizuar</span>
          )}

          {user.providers.map((provider) => (
            <span key={provider} className={`${styles.badge} ${styles.badgeBlue}`}>
              {provider}
            </span>
          ))}
        </div>
      </div>

      <button
        type="button"
        className={styles.copyBtn}
        onClick={() => onCopy(user.uid)}
        title="Kopjo UID"
      >
        {copied ? "U kopjua ✓" : "Kopjo UID"}
      </button>
    </article>
  );
}

function SkeletonCard() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeletonCircle} />
      <div className={styles.skeletonLines}>
        <div className={styles.skeletonLine} />
        <div className={`${styles.skeletonLine} ${styles.skeletonShort}`} />
      </div>
    </div>
  );
}

export default function Users() {
  const [users, setUsers] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  const [emailInput, setEmailInput] = useState("");
  const [searchedEmail, setSearchedEmail] = useState(""); // "" = list mode
  const [searchResult, setSearchResult] = useState(null);

  const [copiedUid, setCopiedUid] = useState("");

  const loadFirstPage = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await request();
      setUsers(data.users);
      setNextPageToken(data.nextPageToken);
    } catch (err) {
      console.error("Load users error:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFirstPage();
  }, [loadFirstPage]);

  const loadMore = async () => {
    if (!nextPageToken || loadingMore) return;

    setLoadingMore(true);
    setError("");

    try {
      const data = await request(`?pageToken=${encodeURIComponent(nextPageToken)}`);
      setUsers((prev) => [...prev, ...data.users]);
      setNextPageToken(data.nextPageToken);
    } catch (err) {
      console.error("Load more error:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoadingMore(false);
    }
  };

  const clearSearch = () => {
    setEmailInput("");
    setSearchedEmail("");
    setSearchResult(null);
    setError("");
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    const email = emailInput.trim();

    if (!email) {
      clearSearch();
      return;
    }

    setSearching(true);
    setError("");
    setSearchResult(null);
    setSearchedEmail(email);

    try {
      const data = await request(`?email=${encodeURIComponent(email)}`);
      setSearchResult(data.user);
    } catch (err) {
      console.error("Search user error:", err);
      setError(getErrorMessage(err));
    } finally {
      setSearching(false);
    }
  };

  const handleCopy = async (uid) => {
    try {
      await navigator.clipboard.writeText(uid);
      setCopiedUid(uid);
      setTimeout(() => setCopiedUid(""), 1500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const isSearchMode = searchedEmail !== "";

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Përdoruesit</h1>
          <p className={styles.subtitle}>
            {isSearchMode
              ? `Rezultati për "${searchedEmail}"`
              : `${users.length} përdorues të ngarkuar`}
          </p>
        </div>

        <form className={styles.searchForm} onSubmit={handleSearch}>
          <input
            type="email"
            className={styles.searchInput}
            placeholder="Kërko sipas emailit..."
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            maxLength={254}
          />

          <button type="submit" className={styles.primaryBtn} disabled={searching}>
            {searching ? <span className={styles.spinner} /> : "Kërko"}
          </button>

          {isSearchMode && (
            <button type="button" className={styles.ghostBtn} onClick={clearSearch}>
              Pastro
            </button>
          )}
        </form>
      </header>

      {error && (
        <div className={styles.error} role="alert">
          <span>⚠️ {error}</span>
          {!isSearchMode && (
            <button type="button" className={styles.ghostBtn} onClick={loadFirstPage}>
              Provo përsëri
            </button>
          )}
        </div>
      )}

      {/* SEARCH MODE */}
      {isSearchMode && (
        <div className={styles.list}>
          {searching && <SkeletonCard />}

          {!searching && searchResult && (
            <UserCard
              user={searchResult}
              index={0}
              onCopy={handleCopy}
              copied={copiedUid === searchResult.uid}
            />
          )}
        </div>
      )}

      {/* LIST MODE */}
      {!isSearchMode && (
        <>
          <div className={styles.list}>
            {loading && Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}

            {!loading &&
              users.map((user, i) => (
                <UserCard
                  key={user.uid}
                  user={user}
                  index={i % 50} // restart the stagger on each new page
                  onCopy={handleCopy}
                  copied={copiedUid === user.uid}
                />
              ))}

            {!loading && !error && users.length === 0 && (
              <p className={styles.empty}>Nuk u gjet asnjë përdorues.</p>
            )}
          </div>

          {!loading && nextPageToken && (
            <div className={styles.loadMoreWrap}>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={loadMore}
                disabled={loadingMore}
              >
                {loadingMore ? <span className={styles.spinner} /> : "Ngarko më shumë"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}