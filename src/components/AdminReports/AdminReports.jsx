import React, { useEffect, useState } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  deleteDoc, 
  updateDoc,
  limit 
} from "firebase/firestore";
import { db } from "../../api/firebase";
import styles from './AdminReports.module.css';

export default function AdminReports({ user }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  // 1. Real-time Fetch Reports
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const docsRef = collection(db, "reports");
    const q = query(docsRef, orderBy("createdAt", "desc"),limit(20 ));

    // onSnapshot keeps the UI synced automatically when you resolve/delete
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const reportList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setResults(reportList);
      setLoading(false);
    }, (err) => {
      console.error("Gabim gjatë marrjes së të dhënave:", err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // 2. Toggle Status (Open <-> Resolved)
  const handleResolveReport = async (id, currentStatus) => {
    try {
      const reportRef = doc(db, "reports", id);
      const newStatus = currentStatus === "open" ? "resolved" : "open";
      await updateDoc(reportRef, { status: newStatus });
    } catch (err) {
      console.error("Gabim gjatë përditësimit:", err);
      alert("Dështoi ndryshimi i statusit.");
    }
  };

  // 3. Permanent Hard Delete
  const handlePermanentDelete = async (id) => {
    if (!window.confirm("A jeni i sigurt që dëshironi ta fshini këtë raport përgjithmonë nga baza e të dhënave?")) return;
    try {
      await deleteDoc(doc(db, "reports", id));
    } catch (err) {
      console.error("Gabim gjatë fshirjes:", err);
      alert("Dështoi fshirja e raportit.");
    }
  };

  // Filter logic for the UI
  const displayedReports = filterOpen 
    ? results.filter(r => r.status === 'open') 
    : results;

  if (loading) return <div className={styles.loader}>Duke ngarkuar raportet...</div>;

  return (
    <div className={styles.adminSection}>
      <div className={styles.tableHeader}>
        <h2 className={styles.title}>Menaxhimi i Raporteve</h2>
        
        {/* Toggle Switch to hide resolved reports */}
        <div className={styles.filterArea}>
          <label className={styles.filterLabel}>
            <input 
              type="checkbox" 
              checked={filterOpen} 
              onChange={() => setFilterOpen(!filterOpen)} 
            />
            Tregoni vetëm ato "Hapur"
          </label>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.adminTable}>
          <thead>
            <tr>
              <th>Raportuesi</th>
              <th>Subjekti (Mjeshtri)</th>
              <th>Kategoria & Statusi</th>
              <th>Mesazhi</th>
              <th>Data</th>
              <th>Veprimet</th>
            </tr>
          </thead>
          <tbody>
            {displayedReports.length > 0 ? (
              displayedReports.map((report) => (
                <tr 
                  key={report.id} 
                  className={report.status === "resolved" ? styles.resolvedRow : ""}
                >
                  {/* Column 1: Reporter Info */}
                  <td>
                    <div className={styles.nameCell}>
                      <strong>{report.reporterName}</strong>
                      <span className={styles.subText}>{report.reporterEmail}</span>
                      <span className={styles.idBadge}>ID: {report.reporterId?.slice(-6)}</span>
                    </div>
                  </td>

                  {/* Column 2: Reported Worker (If Problem) */}
                  <td>
                    {report.category === "Problem" ? (
                      <div className={styles.nameCell}>
                        <strong>{report.reportedUserName}</strong>
                        <span className={styles.idBadge}>UID: {report.reportedUserId?.slice(-6)}</span>
                      </div>
                    ) : (
                      <span className={styles.naText}>—</span>
                    )}
                  </td>

                  {/* Column 3: Category & Status */}
                  <td>
                    <div className={styles.badgeColumn}>
                      <span className={`${styles.badgeBasic} ${styles[report.category]}`}>
                        {report.category}
                      </span>
                      <span className={report.status === "open" ? styles.statusOpen : styles.statusResolved}>
                        {report.status === "open" ? "● Hapur" : "✓ Kryer"}
                      </span>
                    </div>
                  </td>

                  {/* Column 4: Message */}
                  <td className={styles.messageCell}>
                    <div className={styles.reportTitle}>{report.title}</div>
                    <div className={styles.messageScroll}>
                      {report.message}
                    </div>
                  </td>

                  {/* Column 5: Date */}
                  <td>
                    {report.createdAt?.seconds 
                      ? new Date(report.createdAt.seconds * 1000).toLocaleDateString('sq-AL')
                      : "Sot"}
                  </td>

                  {/* Column 6: Actions */}
                  <td className={styles.actionCell}>
                    <div className={styles.btnColumn}>
                     <a 
                       href={`https://mail.google.com/mail/?view=cm&fs=1&to=${report.reporterEmail}&su=${encodeURIComponent(`Re: ${report.title}`)}&body=${encodeURIComponent(
                       `Përshëndetje ${report.reporterName},\n\nNë lidhje me mesazhin tuaj:\n"${report.message}"\n\n----------------------\nShkruani përgjigjen këtu:`
                       )}`}
                       className={styles.replyBtn}
                       target="_blank"
                       rel="noopener noreferrer"
                     >
                       Përgjigju ✉️
                     </a>
                      <button 
                        onClick={() => handleResolveReport(report.id, report.status)} 
                        className={report.status === "open" ? styles.resolveBtn : styles.reopenBtn}
                      >
                        {report.status === "open" ? "Zgjidh" : "Rihap"}
                      </button>

                      <button 
                        onClick={() => handlePermanentDelete(report.id)} 
                        className={styles.deleteBtn}
                      >
                        Fshi 🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className={styles.noResults}>
                  {filterOpen ? "Nuk ka raporte të hapura. ✅" : "Nuk ka raporte në listë."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}