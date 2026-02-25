import { collection, getDocs, query, where, orderBy, limit, doc, updateDoc, serverTimestamp, increment } from "firebase/firestore";
import { useEffect, useState } from "react";
import StorageImage from "../StorageImage";
import { db } from "../../api/firebase";
import styles from "./AdminVerifications.module.css";

export default function AdminVerifications({setGlobalCount}) {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (setGlobalCount) {
            setGlobalCount(results.length);
        }
    }, [results, setGlobalCount]);
     
    const fetchRequests = async () => {
        setLoading(true);
        try {
            const q = query(
                collection(db, "verificationRequests"),
                where("status", "==", "pending"),
                orderBy("createdAt", "desc"),
                limit(50)
            );
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(d => ({
                id: d.id,
                ...d.data()
            }));
            setResults(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        const term = searchTerm.trim().toLowerCase();
        if (!term) {
            fetchRequests();
            return;
        }

        setLoading(true);
        try {
            const q = query(
                collection(db, "verificationRequests"),
                where("status", "==", "pending"),
                where("searchName", ">=", term),
                where("searchName", "<=", term + "\uf8ff"),
                limit(20)
            );
            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setResults(data);
        } catch (err) {
            console.error("Search error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, type, currCount) => {
        const confirmAction = window.confirm(`A jeni i sigurt që dëshironi të ${type === 'APPROVE' ? 'pranoni' : 'refuzoni'} këtë kërkesë?`);
        if (!confirmAction) return;

        const workerRef = doc(db, "workers", id);
        const requestRef = doc(db, "verificationRequests", id);

        try {
            if (type === "APPROVE") {
                await Promise.all([
                    updateDoc(workerRef, { isVerified: true, verificationRejected: false }),
                    updateDoc(requestRef, { status: "approved", updatedAt: serverTimestamp() })
                ]);
                alert("Mjeshtri u verifikua!");
            } else if (type === "REJECT") {
                await Promise.all([
                    updateDoc(workerRef, { isVerified: false, verificationRejected: true, rejectedAt: serverTimestamp() }),
                    updateDoc(requestRef, { 
                        status: "rejected", 
                        rejectionCount: increment(1),
                        updatedAt: serverTimestamp() 
                    })
                ]);
                alert("Kërkesa u refuzua.");
            }
            setResults(prev => prev.filter(req => req.id !== id));
        } catch (error) {
            console.error("Error:", error);
            alert("Gabim: " + error.message);
        }
    };

    return (
        <div className={styles.adminSection}>
            <header className={styles.tableHeader}>
                <h1 className={styles.title}>Kërkesat për Verifikim</h1>
                <div className={styles.controlsRow}>
                    <p className={styles.subText}>Kërkesa në pritje: <strong>{results.length}</strong></p>
                    <form className={styles.searchBox} onSubmit={handleSearch}>
                        <input 
                            type="text" 
                            placeholder="Kërko mjeshtrin..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit">Kërko</button>
                    </form>
                </div>
            </header>

            <div className={styles.tableContainer}>
                {loading ? (
                    <div className={styles.noResults}>Duke u ngarkuar...</div>
                ) : results.length > 0 ? (
                    <table className={styles.adminTable}>
                        <thead>
                            <tr>
                                <th>Punëtori</th>
                                <th>Dokumenti (ID)</th>
                                <th>Data</th>
                                <th>Statusi</th>
                                <th>Veprimet</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((req) => (
                                <tr key={req.id} className={styles.pendingRow}>
                                    <td className={styles.userCell}>
                                        <span className={styles.workerName}>{req.workerName}</span>
                                        <span className={styles.subText}>ID: {req.uid}</span>
                                        {/* REJECTION FLAG */}
                                        {req.rejectionCount > 0 && (
                                            <div className={styles.badgeWarning} style={{marginTop: '8px'}}>
                                                ⚠️ Refuzuar {req.rejectionCount}x më parë
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <StorageImage path={req.storagePath} className={styles.idThumbnail} />
                                    </td>
                                    <td className={styles.subText}>
                                        {req.createdAt?.toDate ? req.createdAt.toDate().toLocaleDateString() : 'Sot'}
                                    </td>
                                    <td>
                                        <span className={styles.badgeWarning}>Në Shqyrtim</span>
                                    </td>
                                    <td className={styles.actionButtons}>
                                        <button 
                                            className={styles.approveBtn}
                                            onClick={() => handleAction(req.id, 'APPROVE')}
                                        >
                                            Prano
                                        </button>
                                        <button 
                                            className={styles.deleteBtn}
                                            onClick={() => handleAction(req.id, 'REJECT', req.rejectionCount)}
                                        >
                                            Refuzo
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className={styles.noResults}>Nuk ka kërkesa të reja.</div>
                )}
            </div>
        </div>
    );
}