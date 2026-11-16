
import { useEffect, useMemo, useState } from "react";
import { auth } from "../../api/firebase";
import styles from "./VercelAnalytics.module.css";

const API_URL = "/api/admin/analytics";

const RANGES = [
  { label: "7 days", value: 7 },
  { label: "30 days", value: 30 },
  { label: "90 days", value: 90 },
];

function formatNumber(value) {
  const number = Number(value);

  if (!Number.isFinite(number)) return "—";

  return new Intl.NumberFormat().format(number);
}

function getRows(value) {
  if (Array.isArray(value)) return value;

  if (Array.isArray(value?.data)) return value.data;
  if (Array.isArray(value?.results)) return value.results;

  return [];
}

function getMetric(item, preferred = "pageviews") {
  if (!item || typeof item !== "object") return 0;

  const candidates = [
    preferred,
    preferred === "pageviews" ? "pageViews" : "uniqueVisitors",
    "count",
    "value",
    "total",
  ];

  for (const key of candidates) {
    const value = item[key];

    if (value !== undefined && value !== null) {
      const number = Number(value);

      if (Number.isFinite(number)) return number;
    }
  }

  return 0;
}

function getLabel(item, dimension) {
  if (!item || typeof item !== "object") return "Unknown";

  const candidates = [
    dimension,
    "label",
    "name",
    "key",
    "value",
    "date",
    "day",
  ];

  for (const key of candidates) {
    const value = item[key];

    if (typeof value === "string" || typeof value === "number") {
      return String(value);
    }
  }

  return "Unknown";
}

function getTotal(data, metric) {
  if (Array.isArray(data)) {
    return data.length ? getMetric(data[0], metric) : null;
  }

  if (data && typeof data === "object") {
    const value = data[metric];

    if (value !== undefined && value !== null) {
      const number = Number(value);
      return Number.isFinite(number) ? number : null;
    }
  }

  return null;
}

function formatDay(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
  });
}

function MetricCard({ title, value, description }) {
  return (
    <div className={styles.metricCard}>
      <span className={styles.metricTitle}>{title}</span>

      <strong className={styles.metricValue}>
        {formatNumber(value)}
      </strong>

      <span className={styles.metricDescription}>
        {description}
      </span>
    </div>
  );
}

function RankingList({ title, rows, dimension, metric = "pageviews" }) {
  const maxValue = Math.max(
    ...rows.map((item) => getMetric(item, metric)),
    1
  );

  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <h3>{title}</h3>
      </div>

      {rows.length === 0 ? (
        <p className={styles.emptyText}>No data available.</p>
      ) : (
        <div className={styles.rankingList}>
          {rows.map((item, index) => {
            const label = getLabel(item, dimension);
            const value = getMetric(item, metric);
            const width = (value / maxValue) * 100;

            return (
              <div className={styles.rankingItem} key={`${label}-${index}`}>
                <div className={styles.rankingInfo}>
                  <span className={styles.rankingLabel} title={label}>
                    {label}
                  </span>

                  <strong>{formatNumber(value)}</strong>
                </div>

                <div className={styles.progressTrack}>
                  <div
                    className={styles.progressBar}
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function DailyTraffic({ rows }) {
  const chartRows = useMemo(() => {
    return rows.map((item) => ({
      label: getLabel(item, "day"),
      value: getMetric(item, "pageviews"),
    }));
  }, [rows]);

  const maxValue = Math.max(
    ...chartRows.map((item) => item.value),
    1
  );

  return (
    <section className={styles.panel}>
      <div className={styles.panelHeader}>
        <div>
          <h3>Daily traffic</h3>
          <p>Page views over the selected period</p>
        </div>
      </div>

      {chartRows.length === 0 ? (
        <p className={styles.emptyText}>No daily data available.</p>
      ) : (
        <div className={styles.chart}>
          {chartRows.map((item, index) => {
            const height = Math.max(
              (item.value / maxValue) * 100,
              item.value > 0 ? 3 : 0
            );

            return (
              <div
                className={styles.chartColumn}
                key={`${item.label}-${index}`}
                title={`${item.label}: ${formatNumber(item.value)} views`}
              >
                <span className={styles.chartValue}>
                  {item.value > 0 ? formatNumber(item.value) : ""}
                </span>

                <div className={styles.chartBarArea}>
                  <div
                    className={styles.chartBar}
                    style={{ height: `${height}%` }}
                  />
                </div>

                <span className={styles.chartLabel}>
                  {formatDay(item.label)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default function AdminAnalytics({ auth }) {
  const [range, setRange] = useState(30);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadAnalytics() {
      setLoading(true);
      setError("");

      try {
        const user = auth?.currentUser;

        if (!user) {
          throw new Error("You must be logged in.");
        }

        const token = await user.getIdToken();

        const response = await fetch(`${API_URL}?range=${range}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Could not load analytics."
          );
        }

        if (!cancelled) {
          setAnalytics(data.analytics);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Something went wrong.");
          setAnalytics(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAnalytics();

    return () => {
      cancelled = true;
    };
  }, [auth, range, refreshKey]);

  const totals = analytics?.totals;

  const pageViews = getTotal(totals, "pageviews");
  const visitors = getTotal(totals, "visitors");

  const dailyRows = getRows(analytics?.daily);
  const pageRows = getRows(analytics?.topPages);
  const countryRows = getRows(analytics?.topCountries);
  const referrerRows = getRows(analytics?.topReferrers);

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <div>
          <span className={styles.eyebrow}>WEBSITE PERFORMANCE</span>
          <h1>Analytics</h1>
          <p>Understand how people discover and use Gjejnjerin.</p>
        </div>

        <div className={styles.headerActions}>
          <select
            className={styles.rangeSelect}
            value={range}
            onChange={(event) => setRange(Number(event.target.value))}
            disabled={loading}
            aria-label="Analytics date range"
          >
            {RANGES.map((item) => (
              <option key={item.value} value={item.value}>
                Last {item.label}
              </option>
            ))}
          </select>

          <button
            className={styles.refreshButton}
            type="button"
            onClick={() => setRefreshKey((current) => current + 1)}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
      </header>

      {error && (
        <div className={styles.errorBox} role="alert">
          <div>
            <strong>Analytics couldn't be loaded</strong>
            <p>{error}</p>
          </div>

          <button
            type="button"
            onClick={() => setRefreshKey((current) => current + 1)}
          >
            Try again
          </button>
        </div>
      )}

      {loading && !analytics ? (
        <div className={styles.loading}>
          <span className={styles.spinner} />
          <p>Loading website analytics...</p>
        </div>
      ) : analytics ? (
        <>
          <section className={styles.metricsGrid}>
            <MetricCard
              title="Page views"
              value={pageViews}
              description={`Last ${range} days`}
            />

            <MetricCard
              title="Unique visitors"
              value={visitors}
              description={`Last ${range} days`}
            />

            <MetricCard
              title="Pages tracked"
              value={pageRows.length}
              description="Pages with recorded traffic"
            />

            <MetricCard
              title="Countries"
              value={countryRows.length}
              description="Countries with recorded traffic"
            />
          </section>

          <DailyTraffic rows={dailyRows} />

          <section className={styles.rankingsGrid}>
            <RankingList
              title="Top pages"
              rows={pageRows}
              dimension="requestPath"
            />

            <RankingList
              title="Top countries"
              rows={countryRows}
              dimension="country"
            />

            <RankingList
              title="Top referrers"
              rows={referrerRows}
              dimension="referrerHostname"
            />
          </section>
        </>
      ) : !error ? (
        <div className={styles.emptyState}>
          <h3>No analytics available</h3>
          <p>There is no analytics data to display yet.</p>
        </div>
      ) : null}
    </main>
  );
}
