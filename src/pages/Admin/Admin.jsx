
import { onAuthStateChanged } from "firebase/auth";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { auth, db } from "../../api/firebase";
import {
  collection,
  doc,
  onSnapshot,
  getDocs,
  query,
  where,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

import AdminWorkers from "../../components/AdminWorkers/AdminWorkers";
import AdminReports from "../../components/AdminReports/AdminReports";
import AdminReviews from "../../components/AdminReviews/AdminReviews";
import AdminVerifications from "../../components/AdminVerifications/AdminVerifications";
import styles from "./Admin.module.css";

const ADMIN_UID = "mUc8sPZ3IURtFT3As8y0YN9Bsil2";
const ADMIN_PIN_HASH =
  "8c2cd4a7bcff84654004d26d74ae332c7e24d701db2e5433ef672c2daf4b499c";

const COLORS = ["#2563eb", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"];

const COLLECTIONS = [
  { id: "workers", label: "Mjeshtrit", icon: "🛠️" },
  { id: "contactSessions", label: "Kontaktet", icon: "📞" },
  { id: "reviews", label: "Reviews", icon: "⭐" },
  { id: "reviewRequest", label: "Kërkesat për review", icon: "✉️" },
  { id: "reports", label: "Raportet", icon: "🚩" },
  { id: "verificationRequests", label: "Verifikimet", icon: "🪪" },
];

const NAV = [
  { id: "overview", label: "Overview", icon: "📊" },
  { id: "analytics", label: "Analytics", icon: "📈" },
  { id: "workers", label: "Mjeshtrit", icon: "🛠️" },
  { id: "contacts", label: "Kontaktet", icon: "📞" },
  { id: "reviewRequests", label: "Review Requests", icon: "✉️" },
  { id: "reviews", label: "Reviews", icon: "⭐" },
  { id: "reports", label: "Raportet", icon: "🚩" },
  { id: "verifications", label: "Verifikimet", icon: "🪪" },
  { id: "categorySugg", label: "Category Suggestions", icon: "📊" },
  { id: "explorer", label: "Data Explorer", icon: "🗃️" },
];

const panelStyle = {
  background: "var(--admin-card, #ffffff)",
  border: "1px solid var(--admin-border, #e5e7eb)",
  borderRadius: 14,
  padding: 18,
  minWidth: 0,
};

const mutedStyle = {
  color: "var(--admin-muted, #64748b)",
  fontSize: 13,
};

const buttonStyle = {
  border: "1px solid var(--admin-border, #e2e8f0)",
  background: "var(--admin-card, #fff)",
  color: "var(--admin-text, #0f172a)",
  borderRadius: 9,
  padding: "9px 12px",
  cursor: "pointer",
  fontSize: 13,
};

function timestampMs(value) {
  if (!value) return 0;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value?.seconds === "number") return value.seconds * 1000;
  if (typeof value === "number") return value;
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
}

function dateLabel(value) {
  const ms = timestampMs(value);
  if (!ms) return "—";
  return new Date(ms).toLocaleDateString("sq-AL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function dateTimeLabel(value) {
  const ms = timestampMs(value);
  if (!ms) return "—";
  return new Date(ms).toLocaleString("sq-AL", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function normalize(value) {
  return String(value ?? "").trim().toLowerCase();
}

function countBy(items, getter) {
  const result = {};
  items.forEach((item) => {
    const key = getter(item) || "Pa të dhëna";
    result[key] = (result[key] || 0) + 1;
  });
  return Object.entries(result)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function isWithinDays(item, days) {
  const ms = timestampMs(item.createdAt);
  const now = Date.now();
  return ms > 0 && ms >= now - days * 86400000 && ms <= now;
}

function percentage(numerator, denominator) {
  if (!denominator) return "0.0";
  return ((numerator / denominator) * 100).toFixed(1);
}

function isOpenStatus(value) {
  const status = normalize(value);
  return [
    "pending",
    "open",
    "new",
    "in_review",
    "in review",
    "waiting",
    "submitted",
  ].includes(status);
}

function StatCard({ icon, label, value, hint, onClick, tone = "#2563eb" }) {
  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) onClick();
      }}
      style={{
        ...panelStyle,
        cursor: onClick ? "pointer" : "default",
        transition: "transform .15s ease, box-shadow .15s ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div style={mutedStyle}>{label}</div>
          <div
            style={{
              fontSize: 29,
              lineHeight: 1.25,
              fontWeight: 800,
              marginTop: 8,
              overflowWrap: "anywhere",
            }}
          >
            {value}
          </div>
          {hint && <div style={{ ...mutedStyle, marginTop: 7 }}>{hint}</div>}
        </div>
        <div
          style={{
            width: 43,
            height: 43,
            flexShrink: 0,
            borderRadius: 12,
            display: "grid",
            placeItems: "center",
            background: `${tone}15`,
            fontSize: 21,
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ title, description, action }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 12,
        flexWrap: "wrap",
        marginBottom: 16,
      }}
    >
      <div>
        <h2 style={{ margin: 0, fontSize: 21 }}>{title}</h2>
        {description && (
          <p style={{ ...mutedStyle, margin: "6px 0 0", lineHeight: 1.6 }}>
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

function Badge({ children, color = "#64748b" }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "4px 8px",
        borderRadius: 99,
        background: `${color}15`,
        color,
        fontSize: 11,
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      {children || "Pa status"}
    </span>
  );
}

function SimpleTable({ columns, rows, emptyMessage = "Nuk ka të dhëna." }) {
  return (
    <div style={{ overflowX: "auto", width: "100%" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          textAlign: "left",
          fontSize: 13,
        }}
      >
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                style={{
                  padding: "11px 10px",
                  borderBottom: "1px solid var(--admin-border, #e5e7eb)",
                  color: "var(--admin-muted, #64748b)",
                  fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{ padding: 22, textAlign: "center", color: "#64748b" }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={row.id || index}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    style={{
                      padding: "12px 10px",
                      borderBottom: "1px solid var(--admin-border, #f1f5f9)",
                      verticalAlign: "top",
                      maxWidth: 280,
                      overflowWrap: "anywhere",
                    }}
                  >
                    {column.render
                      ? column.render(row)
                      : String(row[column.key] ?? "—")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

async function hashPin(value) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const noteRef = useRef(null);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pinVerified, setPinVerified] = useState(
    () => sessionStorage.getItem("admin_auth") === "true"
  );
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState([]);
  const [globalStats, setGlobalStats] = useState({});
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [period, setPeriod] = useState("30");
  const [categorySuggestions, setCategorySuggestions] = useState([]);
const [loadingSuggestions, setLoadingSuggestions] = useState(false);
const [suggestionError, setSuggestionError] = useState("");

  const [selectedCollection, setSelectedCollection] = useState("contactSessions");
  const [refreshError, setRefreshError] = useState("");
  const [records, setRecords] = useState({
    workers: [],
    contactSessions: [],
    reviews: [],
    reviewRequest: [],
    reports: [],
    verificationRequests: [],
  });
  const [loaded, setLoaded] = useState({});
  const [loadErrors, setLoadErrors] = useState({});

  useEffect(() => {
    if (!pinVerified) inputRef.current?.focus();
    try {
      const saved = JSON.parse(localStorage.getItem("Adminnotes") || "[]");
      setAdminNotes(Array.isArray(saved) ? saved : []);
    } catch {
      setAdminNotes([]);
    }
  }, [pinVerified]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser || currentUser.uid !== ADMIN_UID) {
        setUser(null);
        setLoading(false);
        navigate("/");
        return;
      }
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, [navigate]);



  useEffect(() => {
    if (!user) return undefined;

    const unsubscribers = [];

    unsubscribers.push(
      onSnapshot(
        doc(db, "metadata", "globalStats"),
        (snapshot) => {
          setGlobalStats(snapshot.exists() ? snapshot.data() : {});
        },
        (error) => setRefreshError(`Global stats: ${error.message}`)
      )
    );

    COLLECTIONS.forEach(({ id }) => {
      unsubscribers.push(
        onSnapshot(
          collection(db, id),
          (snapshot) => {
            const items = snapshot.docs.map((item) => ({
              id: item.id,
              ...item.data(),
            }));

            setRecords((previous) => ({ ...previous, [id]: items }));
            setLoaded((previous) => ({ ...previous, [id]: true }));
            setLoadErrors((previous) => ({ ...previous, [id]: "" }));
          },
          (error) => {
            setLoadErrors((previous) => ({
              ...previous,
              [id]: error.message,
            }));
          }
        )
      );
    });

    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, [user]);

  async function loadCategorySuggestions() {
  setLoadingSuggestions(true);
  setSuggestionError("");

  try {
    const suggestionsQuery = query(
      collection(db, "categorySuggestions"),
      where("status", "==", "pending")
    );

    const snapshot = await getDocs(suggestionsQuery);

    const suggestions = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data(),
    }));

    suggestions.sort((a, b) => {
      const dateA = a.createdAt?.toMillis?.() ?? 0;
      const dateB = b.createdAt?.toMillis?.() ?? 0;
      return dateB - dateA;
    });

    setCategorySuggestions(suggestions);
  } catch (error) {
    console.error("Error loading category suggestions:", error);
    setSuggestionError("Sugjerimet nuk mundën të ngarkohen.");
  } finally {
    setLoadingSuggestions(false);
  }
}


useEffect(() => {
  loadCategorySuggestions();
}, []);

  const workers = records.workers;
  const contacts = records.contactSessions;
  const reviews = records.reviews;
  const reviewRequests = records.reviewRequest;
  const reports = records.reports;
  const verifications = records.verificationRequests;

  const workerById = useMemo(
    () => new Map(workers.map((worker) => [worker.id, worker])),
    [workers]
  );

  const contactById = useMemo(
    () => new Map(contacts.map((contact) => [contact.id, contact])),
    [contacts]
  );

  const analytics = useMemo(() => {
    const activeWorkers = workers.filter((worker) => worker.isActive === true);
    const verifiedWorkers = workers.filter((worker) => worker.isVerified === true);
    const proWorkers = workers.filter((worker) => worker.isPro === true);
    const availableWorkers = workers.filter((worker) => worker.isAvailable === true);
    const featuredWorkers = workers.filter((worker) => worker.isFeatured === true);

    const pendingVerifications = verifications.filter((item) =>
      isOpenStatus(item.status)
    );
    const openReports = reports.filter((item) => isOpenStatus(item.status));
    const pendingReviewRequests = reviewRequests.filter((item) =>
      isOpenStatus(item.status)
    );
    const pendingReviews = reviews.filter((item) => isOpenStatus(item.status));

    const verifiedReviews = reviews.filter((item) => item.isVerified === true);
    const suspiciousReviews = reviews.filter(
      (item) => item.isDifferentDevice === true
    );
    const ratings = reviews
      .map((review) => Number(review.rating))
      .filter((rating) => Number.isFinite(rating) && rating >= 1 && rating <= 5);

    const averageRating = ratings.length
      ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
      : 0;

    const recentContacts = contacts.filter((item) => isWithinDays(item, Number(period)));
    const recentReviews = reviews.filter((item) => isWithinDays(item, Number(period)));
    const recentReports = reports.filter((item) => isWithinDays(item, Number(period)));
    const recentWorkers = workers.filter((item) => isWithinDays(item, Number(period)));

    const contactsWithReview = contacts.filter((contact) =>
      reviews.some(
        (review) =>
          review.workerId &&
          contact.workerId &&
          review.workerId === contact.workerId &&
          (
            (review.customerPhone && contact.customerPhone &&
              normalize(review.customerPhone) === normalize(contact.customerPhone)) ||
            (review.reviewerFingerprint && contact.fingerPrint &&
              review.reviewerFingerprint === contact.fingerPrint)
          )
      )
    );

    const contactsByWorker = countBy(contacts, (item) => {
      const worker = workerById.get(item.workerId);
      return worker?.fullName || item.workerId || "Mjeshtër i panjohur";
    }).slice(0, 10);

    const workerPerformance = workers.map((worker) => {
      const workerContacts = contacts.filter((item) => item.workerId === worker.id);
      const workerReviews = reviews.filter((item) => item.workerId === worker.id);
      const workerReports = reports.filter(
        (item) => item.reportedUserId === worker.id
      );
      const workerRequests = reviewRequests.filter(
        (item) => item.workerId === worker.id
      );
      const numericRatings = workerReviews
        .map((item) => Number(item.rating))
        .filter((rating) => Number.isFinite(rating) && rating >= 1 && rating <= 5);

      return {
        id: worker.id,
        name: worker.fullName || worker.searchName || worker.id,
        city: worker.city || "Pa qytet",
        category: worker.category || "Pa kategori",
        isPro: worker.isPro === true,
        isVerified: worker.isVerified === true,
        contacts: workerContacts.length,
        reviews: workerReviews.length,
        reports: workerReports.length,
        reviewRequests: workerRequests.length,
        rating: numericRatings.length
          ? numericRatings.reduce((sum, rating) => sum + rating, 0) /
            numericRatings.length
          : Number(worker.avgRating) || 0,
        active: worker.isActive === true,
      };
    });

    const timeline = Array.from({ length: Number(period) === 7 ? 7 : 30 }, (_, index) => {
      const days = Number(period) === 7 ? 7 : 30;
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - (days - index - 1));
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const inDay = (item) => {
        const ms = timestampMs(item.createdAt);
        return ms >= date.getTime() && ms < nextDate.getTime();
      };

      return {
        date: date.toLocaleDateString("sq-AL", {
          day: "2-digit",
          month: "short",
        }),
        Kontakte: contacts.filter(inDay).length,
        Reviews: reviews.filter(inDay).length,
        Raporte: reports.filter(inDay).length,
        Regjistrime: workers.filter(inDay).length,
      };
    });

    return {
      activeWorkers,
      verifiedWorkers,
      proWorkers,
      availableWorkers,
      featuredWorkers,
      pendingVerifications,
      openReports,
      pendingReviewRequests,
      pendingReviews,
      verifiedReviews,
      suspiciousReviews,
      averageRating,
      recentContacts,
      recentReviews,
      recentReports,
      recentWorkers,
      contactsWithReview,
      contactsByWorker,
      workerPerformance,
      timeline,
      cityBreakdown: countBy(workers, (item) => item.city || "Pa qytet"),
      categoryBreakdown: countBy(workers, (item) => item.category || "Pa kategori"),
      reportCategories: countBy(reports, (item) => item.category || "Pa kategori"),
      reportStatuses: countBy(reports, (item) => item.status || "Pa status"),
      reviewStatuses: countBy(reviews, (item) => item.status || "Pa status"),
      verificationStatuses: countBy(
        verifications,
        (item) => item.status || "Pa status"
      ),
      ratingsBreakdown: [5, 4, 3, 2, 1].map((rating) => ({
        name: `${rating} ⭐`,
        value: ratings.filter((value) => value === rating).length,
      })),
      topWorkers: [...workerPerformance]
        .sort((a, b) => b.contacts - a.contacts)
        .slice(0, 10),
      highestRated: [...workerPerformance]
        .filter((worker) => worker.reviews > 0)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 10),
      mostReported: [...workerPerformance]
        .filter((worker) => worker.reports > 0)
        .sort((a, b) => b.reports - a.reports)
        .slice(0, 10),
      contactRate: percentage(contactsWithReview.length, contacts.length),
      reviewVerificationRate: percentage(verifiedReviews.length, reviews.length),
      activeRate: percentage(activeWorkers.length, workers.length),
      proRate: percentage(proWorkers.length, workers.length),
      verifiedRate: percentage(verifiedWorkers.length, workers.length),
      totalRatings: ratings.length,
    };
  }, [workers, contacts, reviews, reviewRequests, reports, verifications, workerById, period]);

  useEffect(() => {
    setLoaded((previous) => previous);
  }, []);

  const handlePinSubmit = async (event) => {
    event.preventDefault();
    setPinError("");

    try {
      const inputHash = await hashPin(pinInput);
      if (inputHash === ADMIN_PIN_HASH) {
        sessionStorage.setItem("admin_auth", "true");
        setPinVerified(true);
        setPinInput("");
      } else {
        setPinError("PIN-i është i gabuar.");
        setPinInput("");
      }
    } catch {
      setPinError("Nuk u verifikua PIN-i. Provo përsëri.");
    }
  };

  const logoutSession = () => {
    sessionStorage.removeItem("admin_auth");
    setPinVerified(false);
    setPinInput("");
    setActiveTab("overview");
  };

  const addNote = () => {
    const value = noteRef.current?.value?.trim();
    if (!value) return;

    const note = {
      text: value,
      timestamp: new Date().toLocaleString("sq-AL", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updated = [note, ...adminNotes];
    setAdminNotes(updated);
    localStorage.setItem("Adminnotes", JSON.stringify(updated));
    if (noteRef.current) noteRef.current.value = "";
  };

  const deleteNote = (index) => {
    const updated = adminNotes.filter((_, i) => i !== index);
    setAdminNotes(updated);
    localStorage.setItem("Adminnotes", JSON.stringify(updated));
  };

  const exportCsv = useCallback((items, filename) => {
    if (!items.length) {
      window.alert("Nuk ka të dhëna për eksport.");
      return;
    }

    const keys = [...new Set(items.flatMap((item) => Object.keys(item)))];
    const valueToText = (value) => {
      if (value == null) return "";
      if (typeof value?.toDate === "function") return value.toDate().toISOString();
      if (typeof value === "object") return JSON.stringify(value);
      return String(value);
    };
    const escapeCsv = (value) =>
      `"${valueToText(value).replace(/"/g, '""')}"`;

    const csv = [
      keys.map(escapeCsv).join(","),
      ...items.map((item) => keys.map((key) => escapeCsv(item[key])).join(",")),
    ].join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }, []);

  const goTo = (tab) => {
    setActiveTab(tab);
    setSearch("");
    setStatusFilter("all");
  };

  const explorerRows = useMemo(() => {
    const items = records[selectedCollection] || [];
    const term = normalize(search);

    return items.filter((item) => {
      const matchesSearch =
        !term ||
        Object.entries(item).some(([key, value]) => {
          if (key === "storagePath") return false;
          if (value && typeof value === "object") {
            return normalize(dateLabel(value)).includes(term);
          }
          return normalize(value).includes(term);
        });

      const matchesStatus =
        statusFilter === "all" ||
        normalize(item.status) === normalize(statusFilter);

      return matchesSearch && matchesStatus;
    });
  }, [records, selectedCollection, search, statusFilter]);

  const allStatuses = useMemo(
    () => [
      ...new Set(
        (records[selectedCollection] || [])
          .map((item) => item.status)
          .filter(Boolean)
      ),
    ],
    [records, selectedCollection]
  );

  const recentActivity = useMemo(() => {
    const combined = [
      ...contacts.map((item) => ({
        ...item,
        activityType: "Kontakt",
        activityName: item.customerName || "Klient",
      })),
      ...reviews.map((item) => ({
        ...item,
        activityType: "Review",
        activityName: item.customerName || "Klient",
      })),
      ...reports.map((item) => ({
        ...item,
        activityType: "Raport",
        activityName: item.title || item.reporterName || "Raport",
      })),
      ...workers.map((item) => ({
        ...item,
        activityType: "Mjeshtër",
        activityName: item.fullName || "Mjeshtër i ri",
      })),
      ...verifications.map((item) => ({
        ...item,
        activityType: "Verifikim",
        activityName: item.workerName || item.searchName || "Verifikim",
      })),
    ];

    return combined
      .sort((a, b) => timestampMs(b.createdAt) - timestampMs(a.createdAt))
      .slice(0, 12);
  }, [contacts, reviews, reports, workers, verifications]);

  if (loading) {
    return <div className={styles.spinner}>Duke verifikuar autoritetin...</div>;
  }

  if (!user) return null;

  if (!pinVerified) {
    return (
      <div className={styles.pinOverlay}>
        <form className={styles.pinBox} onSubmit={handlePinSubmit}>
          <div className={styles.lockIcon}>🔐</div>
          <h3>Hyrja e Sigurt</h3>
          <p>Shënoni PIN-in për të hapur panelin e kontrollit.</p>
          <input
            ref={inputRef}
            type="password"
            autoComplete="current-password"
            placeholder="Shkruaj PIN-in"
            value={pinInput}
            onChange={(event) => setPinInput(event.target.value)}
            className={styles.pinInput}
            required
          />
          {pinError && (
            <p role="alert" style={{ color: "#dc2626", fontSize: 13 }}>
              {pinError}
            </p>
          )}
          <button type="submit" className={styles.verifyBtn}>
            Hyr në panel
          </button>
        </form>
      </div>
    );
  }

  const collectionName =
    COLLECTIONS.find((item) => item.id === selectedCollection)?.label ||
    selectedCollection;

  const sectionTitle = NAV.find((item) => item.id === activeTab)?.label || "Admin";

  return (
    <div className={styles.adminDashboardContainer}>
      <header className={styles.dashboardHeader}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
            marginBottom: 22,
          }}
        >
          <div className={styles.titleGroup}>
            <div>
              <h1>Gjejnjerin Control Center</h1>
              <p style={mutedStyle}>
                Marketplace intelligence · Operacione · Trust & Safety
              </p>
            </div>
            <button onClick={logoutSession} className={styles.logoutBtn}>
              Mbyll sesionin 🔒
            </button>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              type="button"
              style={buttonStyle}
              onClick={() => setIsNotesOpen(true)}
            >
              📌 Shënimet ({adminNotes.length})
            </button>
            <button
              type="button"
              style={buttonStyle}
              onClick={() => exportCsv(recentActivity, "gjejnjerin-activity.csv")}
            >
              ⬇ Eksporto aktivitetin
            </button>
          </div>
        </div>

        {refreshError && (
          <div
            role="alert"
            style={{
              ...panelStyle,
              borderColor: "#fca5a5",
              color: "#b91c1c",
              marginBottom: 16,
            }}
          >
            {refreshError}
          </div>
        )}

        {Object.entries(loadErrors).some(([, error]) => error) && (
          <div
            style={{
              ...panelStyle,
              borderColor: "#fbbf24",
              marginBottom: 16,
            }}
          >
            <strong>Vëmendje: disa koleksione nuk u ngarkuan.</strong>
            <p style={mutedStyle}>
              Kontrollo Firestore Security Rules dhe lejet e llogarisë admin.
            </p>
            {Object.entries(loadErrors)
              .filter(([, error]) => error)
              .map(([name, error]) => (
                <div key={name} style={{ fontSize: 12, marginTop: 5 }}>
                  <strong>{name}:</strong> {error}
                </div>
              ))}
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))",
            gap: 12,
          }}
        >
          <StatCard
            icon="🛠️"
            label="Mjeshtër gjithsej"
            value={workers.length}
            hint={`${analytics.activeWorkers.length} aktivë · ${analytics.availableWorkers.length} të disponueshëm`}
            onClick={() => goTo("workers")}
          />
          <StatCard
            icon="💎"
            label="Anëtarë PRO"
            value={analytics.proWorkers.length}
            hint={`${analytics.proRate}% e mjeshtërve`}
            onClick={() => goTo("workers")}
            tone="#8b5cf6"
          />
          <StatCard
            icon="📞"
            label="Kontaktet gjithsej"
            value={contacts.length}
            hint={`${analytics.recentContacts.length} në ${period} ditët e fundit`}
            onClick={() => goTo("contacts")}
            tone="#059669"
          />
          <StatCard
            icon="⭐"
            label="Reviews gjithsej"
            value={reviews.length}
            hint={`Mesatarja e regjistruar: ${analytics.averageRating.toFixed(2)} / 5`}
            onClick={() => goTo("reviews")}
            tone="#d97706"
          />
          <StatCard
            icon="🚩"
            label="Raporte të hapura"
            value={analytics.openReports.length}
            hint={`${reports.length} raporte gjithsej`}
            onClick={() => goTo("reports")}
            tone="#dc2626"
          />
          <StatCard
            icon="🪪"
            label="Verifikime në pritje"
            value={analytics.pendingVerifications.length}
            hint={`${analytics.verifiedWorkers.length} mjeshtër të verifikuar`}
            onClick={() => goTo("verifications")}
            tone="#7c3aed"
          />
        </div>
      </header>

      <nav
        className={styles.tabNavigation}
        aria-label="Admin navigation"
        style={{ marginTop: 22, display: "flex", flexWrap: "wrap", gap: 7 }}
      >
        {NAV.map((item) => {
          const active = activeTab === item.id;
          let badgeCount = null;

          if (item.id === "reports") badgeCount = analytics.openReports.length;
          if (item.id === "verifications")
            badgeCount = analytics.pendingVerifications.length;
          if (item.id === "reviewRequests")
            badgeCount = analytics.pendingReviewRequests.length;

          return (
            <button
              key={item.id}
              type="button"
              className={active ? styles.activeTab : ""}
              onClick={() => goTo(item.id)}
            >
              {item.icon} {item.label}
              {badgeCount > 0 && (
                <span
                  style={{
                    display: "inline-block",
                    marginLeft: 6,
                    padding: "2px 6px",
                    borderRadius: 99,
                    background: "#fee2e2",
                    color: "#b91c1c",
                    fontSize: 11,
                  }}
                >
                  {badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <main className={styles.tabContent} style={{ minWidth: 0 }}>
        {activeTab === "overview" && (
          <div style={{ display: "grid", gap: 18 }}>
            <SectionTitle
              title="Marketplace overview"
              description="Një pamje e shpejtë e aktivitetit, rritjes dhe çështjeve që kërkojnë vëmendje."
              action={
                <select
                  value={period}
                  onChange={(event) => setPeriod(event.target.value)}
                  style={buttonStyle}
                  aria-label="Periudha e analizës"
                >
                  <option value="7">7 ditët e fundit</option>
                  <option value="30">30 ditët e fundit</option>
                </select>
              }
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 14,
              }}
            >
              <div style={panelStyle}>
                <div style={mutedStyle}>Aktiviteti gjatë periudhës</div>
                <h2 style={{ fontSize: 28, margin: "8px 0" }}>
                  {analytics.recentContacts.length +
                    analytics.recentReviews.length +
                    analytics.recentReports.length}
                </h2>
                <p style={mutedStyle}>
                  Kontakte + reviews + raporte të krijuara në periudhën e zgjedhur.
                </p>
              </div>
              <div style={panelStyle}>
                <div style={mutedStyle}>Përqindja e mjeshtërve aktivë</div>
                <h2 style={{ fontSize: 28, margin: "8px 0" }}>
                  {analytics.activeRate}%
                </h2>
                <p style={mutedStyle}>
                  {analytics.activeWorkers.length} nga {workers.length} mjeshtër
                  kanë isActive = true.
                </p>
              </div>
              <div style={panelStyle}>
                <div style={mutedStyle}>Review-t e verifikuara</div>
                <h2 style={{ fontSize: 28, margin: "8px 0" }}>
                  {analytics.reviewVerificationRate}%
                </h2>
                <p style={mutedStyle}>
                  {analytics.verifiedReviews.length} nga {reviews.length} reviews
                  kanë isVerified = true.
                </p>
              </div>
              <div style={panelStyle}>
                <div style={mutedStyle}>Mjeshtër me profil të verifikuar</div>
                <h2 style={{ fontSize: 28, margin: "8px 0" }}>
                  {analytics.verifiedRate}%
                </h2>
                <p style={mutedStyle}>
                  {analytics.verifiedWorkers.length} nga {workers.length} profile.
                </p>
              </div>
            </div>

            


            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
                gap: 16,
              }}
            >
              <div style={panelStyle}>
                <h3 style={{ marginTop: 0 }}>Aktiviteti ditor</h3>
                <p style={mutedStyle}>
                  Kontakte, reviews, raporte dhe regjistrime.
                </p>
                <div style={{ height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.timeline}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="Kontakte" stroke="#2563eb" />
                      <Line type="monotone" dataKey="Reviews" stroke="#10b981" />
                      <Line type="monotone" dataKey="Raporte" stroke="#ef4444" />
                      <Line type="monotone" dataKey="Regjistrime" stroke="#8b5cf6" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div style={panelStyle}>
                <h3 style={{ marginTop: 0 }}>Basic vs PRO</h3>
                <p style={mutedStyle}>Ndarja e mjeshtërve sipas planit.</p>
                <div style={{ height: 240 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "PRO", value: analytics.proWorkers.length },
                          {
                            name: "Basic",
                            value: Math.max(0, workers.length - analytics.proWorkers.length),
                          },
                        ]}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={4}
                      >
                        {[0, 1].map((index) => (
                          <Cell key={index} fill={COLORS[index]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div style={panelStyle}>
              <SectionTitle
                title="Qytetet me më shumë mjeshtër"
                description="Shpërndarja sipas fushës city të koleksionit workers."
              />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(155px, 1fr))",
                  gap: 10,
                }}
              >
                {analytics.cityBreakdown.slice(0, 8).map((city) => (
                  <div
                    key={city.name}
                    style={{
                      padding: 14,
                      borderRadius: 10,
                      background: "var(--admin-subtle, #f8fafc)",
                    }}
                  >
                    <div style={mutedStyle}>{city.name}</div>
                    <div style={{ fontSize: 24, fontWeight: 800, marginTop: 6 }}>
                      {city.value}
                    </div>
                    <div style={mutedStyle}>
                      {percentage(city.value, workers.length)}% e profileve
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={panelStyle}>
              <SectionTitle
                title="Qendra e vëmendjes"
                description="Çështje që mund të kërkojnë veprim nga administratori."
              />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: 12,
                }}
              >
                {[
                  {
                    title: "Raporte të hapura",
                    count: analytics.openReports.length,
                    color: "#dc2626",
                    tab: "reports",
                    desc: "Kontrollo ankesat e përdoruesve.",
                  },
                  {
                    title: "Verifikime në pritje",
                    count: analytics.pendingVerifications.length,
                    color: "#7c3aed",
                    tab: "verifications",
                    desc: "Kontrollo kërkesat e verifikimit.",
                  },
                  {
                    title: "Review requests në pritje",
                    count: analytics.pendingReviewRequests.length,
                    color: "#d97706",
                    tab: "reviewRequests",
                    desc: "Shiko kërkesat e pambyllura.",
                  },
                  {
                    title: "Reviews me sinjal pajisjeje",
                    count: analytics.suspiciousReviews.length,
                    color: "#b45309",
                    tab: "reviews",
                    desc: "isDifferentDevice = true; kërko kontekst.",
                  },
                ].map((item) => (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => goTo(item.tab)}
                    style={{
                      ...buttonStyle,
                      padding: 15,
                      textAlign: "left",
                      whiteSpace: "normal",
                    }}
                  >
                    <div style={{ color: item.color, fontWeight: 800 }}>
                      {item.count} · {item.title}
                    </div>
                    <p style={{ ...mutedStyle, marginBottom: 0 }}>{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div style={panelStyle}>
              <SectionTitle
                title="Aktiviteti më i fundit"
                description="Regjistrime, kontakte, reviews, raporte dhe verifikime."
              />
              <SimpleTable
                columns={[
                  { key: "activityType", label: "Lloji" },
                  { key: "activityName", label: "Përshkrimi" },
                  {
                    key: "workerId",
                    label: "Mjeshtri",
                    render: (item) => {
                      const worker = workerById.get(item.workerId);
                      return worker?.fullName || item.workerName || item.workerId || "—";
                    },
                  },
                  {
                    key: "createdAt",
                    label: "Data",
                    render: (item) => dateTimeLabel(item.createdAt),
                  },
                  {
                    key: "status",
                    label: "Statusi",
                    render: (item) => <Badge>{item.status || item.activityType}</Badge>,
                  },
                ]}
                rows={recentActivity}
              />
            </div>
          </div>
        )}

        {activeTab === "categorySugg" && (
  <section
    style={{
      padding: "24px",
      marginTop: "24px",
      background: "#fff",
      border: "1px solid #e5e7eb",
      borderRadius: "16px",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "12px",
        flexWrap: "wrap",
        marginBottom: "20px",
      }}
    >
      <div>
        <h2 style={{ margin: 0, color: "#111827" }}>
          Sugjerime për kategori
        </h2>

        <p style={{ margin: "6px 0 0", color: "#6b7280" }}>
          Kategoritë e propozuara nga punëtorët.
        </p>
      </div>

      <button
        type="button"
        onClick={loadCategorySuggestions}
        disabled={loadingSuggestions}
        style={{
          padding: "10px 16px",
          border: "none",
          borderRadius: "8px",
          background: "#004cff",
          color: "#fff",
          cursor: loadingSuggestions ? "wait" : "pointer",
        }}
      >
        {loadingSuggestions ? "Duke ngarkuar..." : "Rifresko"}
      </button>
    </div>

    {suggestionError && (
      <p style={{ color: "#dc2626" }}>
        {suggestionError}
      </p>
    )}

    {loadingSuggestions ? (
      <p style={{ color: "#6b7280" }}>
        Duke ngarkuar sugjerimet...
      </p>
    ) : !suggestionError && categorySuggestions.length === 0 ? (
      <p style={{ color: "#6b7280" }}>
        Nuk ka sugjerime të reja për momentin.
      </p>
    ) : (
      <div style={{ display: "grid", gap: "14px" }}>
        {categorySuggestions.map((suggestion) => (
          <article
            key={suggestion.id}
            style={{
              padding: "18px",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              minWidth: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <div style={{ minWidth: 0 }}>
                <h3
                  style={{
                    margin: "0 0 12px",
                    color: "#111827",
                    fontSize: "20px",
                  }}
                >
                  {suggestion.suggestedCategory || "Pa emër"}
                </h3>

                <p style={{ margin: "4px 0", color: "#374151" }}>
                  <strong>Punëtori:</strong>{" "}
                  {suggestion.workerName || "Nuk është dhënë"}
                </p>

                <p
                  style={{
                    margin: "4px 0",
                    color: "#374151",
                    overflowWrap: "anywhere",
                  }}
                >
                  <strong>Email:</strong>{" "}
                  {suggestion.workerEmail || "Nuk është dhënë"}
                </p>

                <p style={{ margin: "4px 0", color: "#374151" }}>
                  <strong>Qyteti:</strong>{" "}
                  {suggestion.city || "Nuk është dhënë"}
                </p>

                <p
                  style={{
                    margin: "8px 0 0",
                    color: "#6b7280",
                    fontSize: "13px",
                  }}
                >
                  {suggestion.createdAt?.toDate
                    ? suggestion.createdAt.toDate().toLocaleString()
                    : "Data nuk është e disponueshme"}
                </p>
              </div>

              <span
                style={{
                  padding: "6px 10px",
                  borderRadius: "20px",
                  background: "#fef3c7",
                  color: "#92400e",
                  fontSize: "12px",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                {suggestion.status === "pending"
                  ? "Në pritje"
                  : suggestion.status || "Pa status"}
              </span>
            </div>
          </article>
        ))}
      </div>
    )}
  </section>
)}

        {activeTab === "analytics" && (
          <div style={{ display: "grid", gap: 18 }}>
            <SectionTitle
              title="Advanced analytics"
              description="Analizë e aktivitetit, cilësisë së shërbimit dhe strukturës së marketplace-it."
              action={
                <select
                  value={period}
                  onChange={(event) => setPeriod(event.target.value)}
                  style={buttonStyle}
                >
                  <option value="7">7 ditë</option>
                  <option value="30">30 ditë</option>
                </select>
              }
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
                gap: 12,
              }}
            >
              <StatCard
                icon="📞"
                label="Kontaktet e periudhës"
                value={analytics.recentContacts.length}
              />
              <StatCard
                icon="⭐"
                label="Reviews të periudhës"
                value={analytics.recentReviews.length}
              />
              <StatCard
                icon="🛠️"
                label="Regjistrime të reja"
                value={analytics.recentWorkers.length}
              />
              <StatCard
                icon="🚩"
                label="Raporte të periudhës"
                value={analytics.recentReports.length}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 16,
              }}
            >
              <div style={panelStyle}>
                <h3 style={{ marginTop: 0 }}>Kategoritë e mjeshtërve</h3>
                <div style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.categoryBreakdown.slice(0, 10)} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" allowDecimals={false} />
                      <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#2563eb" radius={[0, 5, 5, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div style={panelStyle}>
                <h3 style={{ marginTop: 0 }}>Vlerësimet</h3>
                <p style={mutedStyle}>
                  Mesatarja e ratings numerike në koleksionin reviews.
                </p>
                <div style={{ height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.ratingsBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#f59e0b" radius={[5, 5, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div style={panelStyle}>
                <h3 style={{ marginTop: 0 }}>Kategoritë e raporteve</h3>
                <div style={{ height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.reportCategories.slice(0, 8)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#ef4444" radius={[5, 5, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div style={panelStyle}>
              <SectionTitle
                title="Mjeshtrit me më shumë kontakte"
                description="Renditje nga numri i contactSessions që lidhen me workerId."
                action={
                  <button
                    style={buttonStyle}
                    onClick={() => exportCsv(analytics.workerPerformance, "worker-performance.csv")}
                  >
                    Eksporto CSV
                  </button>
                }
              />
              <SimpleTable
                columns={[
                  { key: "name", label: "Mjeshtri" },
                  { key: "city", label: "Qyteti" },
                  { key: "category", label: "Kategoria" },
                  { key: "contacts", label: "Kontaktet" },
                  { key: "reviews", label: "Reviews" },
                  {
                    key: "rating",
                    label: "Mesatarja",
                    render: (item) => `${Number(item.rating).toFixed(2)} ⭐`,
                  },
                  {
                    key: "reports",
                    label: "Raporte",
                    render: (item) => (
                      <Badge color={item.reports ? "#dc2626" : "#64748b"}>
                        {item.reports}
                      </Badge>
                    ),
                  },
                  {
                    key: "isPro",
                    label: "Plani",
                    render: (item) => (
                      <Badge color={item.isPro ? "#7c3aed" : "#64748b"}>
                        {item.isPro ? "PRO" : "Basic"}
                      </Badge>
                    ),
                  },
                ]}
                rows={analytics.topWorkers}
              />
            </div>

            <div style={panelStyle}>
              <SectionTitle
                title="Mjeshtrit me vlerësimet më të larta"
                description="Shfaqen vetëm profilet që kanë të paktën një review të lidhur."
              />
              <SimpleTable
                columns={[
                  { key: "name", label: "Mjeshtri" },
                  { key: "city", label: "Qyteti" },
                  { key: "category", label: "Kategoria" },
                  {
                    key: "rating",
                    label: "Rating",
                    render: (item) => `${Number(item.rating).toFixed(2)} ⭐`,
                  },
                  { key: "reviews", label: "Numri i reviews" },
                  { key: "contacts", label: "Kontaktet" },
                ]}
                rows={analytics.highestRated}
              />
            </div>

            <div style={panelStyle}>
              <SectionTitle
                title="Raportet sipas statusit"
                description="Ndihmon për të parë ku grumbullohen raportet."
              />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {analytics.reportStatuses.map((item, index) => (
                  <div
                    key={item.name}
                    style={{
                      padding: 13,
                      borderRadius: 10,
                      background: "var(--admin-subtle, #f8fafc)",
                      minWidth: 125,
                    }}
                  >
                    <div style={mutedStyle}>{item.name}</div>
                    <strong style={{ fontSize: 24 }}>{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "workers" && <AdminWorkers />}

        {activeTab === "reports" && <AdminReports user={user} />}

        {activeTab === "reviews" && <AdminReviews />}

        {activeTab === "verifications" && (
          <AdminVerifications
            setGlobalCount={(count) => {
              if (typeof count === "number") return;
              // The live verificationRequests snapshot is the dashboard source of truth.
            }}
          />
        )}

        {activeTab === "contacts" && (
          <div style={{ display: "grid", gap: 18 }}>
            <SectionTitle
              title="Contact intelligence"
              description="Analizo kërkesat për kontakt, kërkesën për mjeshtër dhe lidhjet e mundshme me reviews."
              action={
                <button
                  style={buttonStyle}
                  onClick={() => exportCsv(contacts, "gjejnjerin-contact-sessions.csv")}
                >
                  ⬇ Eksporto kontaktet
                </button>
              }
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))",
                gap: 12,
              }}
            >
              <StatCard icon="📞" label="Contact sessions" value={contacts.length} />
              <StatCard
                icon="🔗"
                label="Me sinjal të përputhur review"
                value={analytics.contactsWithReview.length}
                hint="Përputhje sipas workerId dhe telefonit ose fingerprint-it."
              />
              <StatCard
                icon="📊"
                label="Përputhje / kontakte"
                value={`${analytics.contactRate}%`}
                hint="Sinjal eksplorues, jo normë e garantuar konvertimi."
              />
              <StatCard
                icon="🧾"
                label="Për review"
                value={contacts.filter((item) => item.usedForReview === true).length}
                hint="usedForReview = true."
              />
            </div>

            <div style={panelStyle}>
              <SectionTitle
                title="Mjeshtrit me më shumë kërkesa kontakti"
                description="Numri i session-eve sipas workerId."
              />
              <SimpleTable
                columns={[
                  { key: "name", label: "Mjeshtri" },
                  { key: "value", label: "Kontakte" },
                ]}
                rows={analytics.contactsByWorker}
              />
            </div>

            <div style={panelStyle}>
              <SectionTitle
                title="Të gjitha kontaktet"
                description="Regjistrat e contactSessions me lidhjen te profili i mjeshtrit."
              />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Kërko emër, telefon, worker ID ose fingerprint..."
                style={{ ...buttonStyle, width: "100%", marginBottom: 14, boxSizing: "border-box" }}
              />
              <SimpleTable
                columns={[
                  { key: "customerName", label: "Klienti" },
                  { key: "customerPhone", label: "Telefoni" },
                  {
                    key: "worker",
                    label: "Mjeshtri",
                    render: (item) =>
                      workerById.get(item.workerId)?.fullName || item.workerId || "—",
                  },
                  {
                    key: "createdAt",
                    label: "Data",
                    render: (item) => dateTimeLabel(item.createdAt),
                  },
                  {
                    key: "status",
                    label: "Statusi",
                    render: (item) => <Badge>{item.status}</Badge>,
                  },
                  {
                    key: "usedForReview",
                    label: "Review",
                    render: (item) =>
                      item.usedForReview ? (
                        <Badge color="#059669">Përdorur</Badge>
                      ) : (
                        <Badge>Jo</Badge>
                      ),
                  },
                  {
                    key: "fingerPrint",
                    label: "Fingerprint",
                    render: (item) => (
                      <span title={item.fingerPrint || ""}>
                        {item.fingerPrint
                          ? `${String(item.fingerPrint).slice(0, 10)}…`
                          : "—"}
                      </span>
                    ),
                  },
                ]}
                rows={contacts.filter((item) => {
                  const term = normalize(search);
                  return !term || [
                    item.customerName,
                    item.customerPhone,
                    item.workerId,
                    item.fingerPrint,
                    item.status,
                  ].some((value) => normalize(value).includes(term));
                })}
              />
            </div>
          </div>
        )}

        {activeTab === "reviewRequests" && (
          <div style={{ display: "grid", gap: 18 }}>
            <SectionTitle
              title="Review request operations"
              description="Ndiq kërkesat për review dhe lidhjet me kontaktet dhe reviews."
              action={
                <button
                  style={buttonStyle}
                  onClick={() =>
                    exportCsv(reviewRequests, "gjejnjerin-review-requests.csv")
                  }
                >
                  ⬇ Eksporto
                </button>
              }
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 12,
              }}
            >
              <StatCard
                icon="✉️"
                label="Kërkesa gjithsej"
                value={reviewRequests.length}
              />
              <StatCard
                icon="⏳"
                label="Të hapura"
                value={analytics.pendingReviewRequests.length}
                tone="#d97706"
              />
              <StatCard
                icon="⭐"
                label="Reviews gjithsej"
                value={reviews.length}
              />
              <StatCard
                icon="🔗"
                label="Me session të lidhur"
                value={reviewRequests.filter((item) => item.sessionId && contactById.has(item.sessionId)).length}
                hint="Lidhje direkte përmes sessionId."
              />
            </div>

            <div style={panelStyle}>
              <SectionTitle
                title="Kërkesat sipas statusit"
                description="Shpërndarja e reviewRequest.status."
              />
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {countBy(reviewRequests, (item) => item.status || "Pa status").map((item) => (
                  <div
                    key={item.name}
                    style={{
                      padding: 14,
                      borderRadius: 10,
                      background: "var(--admin-subtle, #f8fafc)",
                      minWidth: 120,
                    }}
                  >
                    <div style={mutedStyle}>{item.name}</div>
                    <strong style={{ fontSize: 24 }}>{item.value}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div style={panelStyle}>
              <SectionTitle
                title="Kërkesat për review"
                description="Përputhja me contactSessions bëhet përmes sessionId."
              />
              <SimpleTable
                columns={[
                  { key: "customerName", label: "Klienti" },
                  { key: "customerPhone", label: "Telefoni" },
                  { key: "workerName", label: "Mjeshtri" },
                  {
                    key: "workerId",
                    label: "Profili",
                    render: (item) => (
                      <span>
                        {workerById.get(item.workerId)?.fullName || item.workerId || "—"}
                      </span>
                    ),
                  },
                  {
                    key: "sessionId",
                    label: "Contact session",
                    render: (item) => (
                      <span>
                        {item.sessionId
                          ? contactById.has(item.sessionId)
                            ? "E lidhur ✓"
                            : "ID ekziston, por nuk u gjet session"
                          : "Pa sessionId"}
                      </span>
                    ),
                  },
                  {
                    key: "createdAt",
                    label: "Krijuar",
                    render: (item) => dateTimeLabel(item.createdAt),
                  },
                  {
                    key: "status",
                    label: "Statusi",
                    render: (item) => (
                      <Badge color={isOpenStatus(item.status) ? "#d97706" : "#059669"}>
                        {item.status}
                      </Badge>
                    ),
                  },
                ]}
                rows={[...reviewRequests].sort(
                  (a, b) => timestampMs(b.createdAt) - timestampMs(a.createdAt)
                )}
              />
            </div>
          </div>
        )}

        {activeTab === "explorer" && (
          <div style={{ display: "grid", gap: 18 }}>
            <SectionTitle
              title="Firestore Data Explorer"
              description="Kërko, filtro dhe eksporto regjistrat që administratori ka leje t'i lexojë."
              action={
                <button
                  style={buttonStyle}
                  onClick={() =>
                    exportCsv(explorerRows, `${selectedCollection}-export.csv`)
                  }
                >
                  ⬇ Eksporto rezultatet ({explorerRows.length})
                </button>
              }
            />

            <div style={panelStyle}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: 12,
                }}
              >
                <label style={{ display: "grid", gap: 6, fontSize: 13 }}>
                  Koleksioni
                  <select
                    value={selectedCollection}
                    onChange={(event) => {
                      setSelectedCollection(event.target.value);
                      setStatusFilter("all");
                      setSearch("");
                    }}
                    style={buttonStyle}
                  >
                    {COLLECTIONS.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.icon} {item.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label style={{ display: "grid", gap: 6, fontSize: 13 }}>
                  Kërko në regjistra
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Emër, ID, kategori..."
                    style={buttonStyle}
                  />
                </label>

                <label style={{ display: "grid", gap: 6, fontSize: 13 }}>
                  Statusi
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    style={buttonStyle}
                  >
                    <option value="all">Të gjitha statuset</option>
                    {allStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div style={{ ...mutedStyle, marginTop: 14 }}>
                {loaded[selectedCollection]
                  ? `${collectionName}: ${explorerRows.length} rezultate nga ${(records[selectedCollection] || []).length} regjistra të lexuar.`
                  : "Duke ngarkuar të dhënat..."}
              </div>
            </div>

            <div style={panelStyle}>
              <SimpleTable
                columns={[
                  {
                    key: "id",
                    label: "Document ID",
                    render: (item) => (
                      <code style={{ fontSize: 11 }}>{item.id}</code>
                    ),
                  },
                  {
                    key: "name",
                    label: "Emri / Titulli",
                    render: (item) =>
                      item.fullName ||
                      item.workerName ||
                      item.customerName ||
                      item.title ||
                      item.searchName ||
                      item.id,
                  },
                  {
                    key: "workerId",
                    label: "Worker ID",
                    render: (item) => item.workerId || item.reportedUserId || "—",
                  },
                  {
                    key: "status",
                    label: "Statusi",
                    render: (item) => <Badge>{item.status}</Badge>,
                  },
                  {
                    key: "createdAt",
                    label: "Krijuar",
                    render: (item) => dateTimeLabel(item.createdAt),
                  },
                  {
                    key: "details",
                    label: "Detajet",
                    render: (item) => (
                      <details>
                        <summary style={{ cursor: "pointer" }}>Shfaq fushat</summary>
                        <pre
                          style={{
                            whiteSpace: "pre-wrap",
                            overflowWrap: "anywhere",
                            maxWidth: 420,
                            fontSize: 11,
                          }}
                        >
                          {JSON.stringify(
                            Object.fromEntries(
                              Object.entries(item).filter(
                                ([key]) => key !== "storagePath"
                              )
                            ),
                            (key, value) => {
                              if (value && typeof value.toDate === "function") {
                                return value.toDate().toISOString();
                              }
                              return value;
                            },
                            2
                          )}
                        </pre>
                      </details>
                    ),
                  },
                ]}
                rows={explorerRows}
              />
            </div>
          </div>
        )}
      </main>

      {isNotesOpen && (
        <div
          className={styles.notesOverlay}
          onClick={() => setIsNotesOpen(false)}
        >
          <div
            className={styles.notesDrawer}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.drawerHeader}>
              <h3>Shënimet e Adminit 📌</h3>
              <button
                type="button"
                className={styles.closeDrawerBtn}
                onClick={() => setIsNotesOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className={styles.noteInputGroup}>
              <input
                ref={noteRef}
                type="text"
                placeholder="Shkruaj një shënim të ri..."
                className={styles.noteInput}
                onKeyDown={(event) => {
                  if (event.key === "Enter") addNote();
                }}
              />
              <button
                type="button"
                onClick={addNote}
                className={styles.noteSaveBtn}
              >
                Ruaj
              </button>
            </div>

            <ul className={styles.notesList}>
              {adminNotes.length === 0 ? (
                <p className={styles.noNotes}>Nuk ka shënime për momentin.</p>
              ) : (
                adminNotes.map((note, index) => (
                  <li key={`${note.timestamp}-${index}`} className={styles.noteItem}>
                    <div className={styles.noteContent}>
                      <span className={styles.noteText}>{note.text}</span>
                      <span className={styles.noteTime}>{note.timestamp}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteNote(index)}
                      className={styles.deleteNoteBtn}
                      aria-label="Fshi shënimin"
                    >
                      🗑️
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
