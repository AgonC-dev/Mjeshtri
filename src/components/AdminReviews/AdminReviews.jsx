import React, { useEffect, useState } from 'react';
import { 
    collection, 
    getDocs, 
    query, 
    orderBy, 
    where, 
    doc, 
    deleteDoc, 
    limit 
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { db, auth } from "../../api/firebase";
import styles from './AdminReviews.module.css';

export default function AdminReviews() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [notes, setNotes] = useState({}); 
    const [actionLoading, setActionLoading] = useState(null);
    
    // filterStatus: "all" or "pending"
    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {
        fetchRecentReviews();
    }, []);

    const fetchRecentReviews = async () => {
        setLoading(true);
        try {
            const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"), limit(50));
            const querySnapshot = await getDocs(q);
            const reviews = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setResults(reviews);
        } catch (err) {
            console.error("Error fetching reviews:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        const term = searchTerm.trim().toLowerCase();
        if (!term) {
            fetchRecentReviews();
            return;
        }

        setLoading(true);
        try {
            const q = query(
                collection(db, "reviews"),
                where("searchName", ">=", term),
                where("searchName", "<=", term + "\uf8ff")
            );
            const querySnapshot = await getDocs(q);
            const reviews = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setResults(reviews);
        } catch (err) {
            console.error("Search error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveReview = async (reviewId) => {
        const adminNote = notes[reviewId] || "";
        if (!window.confirm("Konfirmon që e ke verifikuar këtë rishikim?")) return;

        setActionLoading(reviewId);
        const functions = getFunctions();
        const approve = httpsCallable(functions, 'approveReview');

        try {
            await approve({ reviewId, note: adminNote });

            setResults(prev => prev.map(r => 
                r.id === reviewId ? { ...r, status: 'approved', isVerified: true, adminNote: adminNote } : r
            ));
            
            alert("Rishikimi u miratua!");
        } catch (err) {
            console.error("Approve error:", err);
            alert("Gabim: " + err.message);
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("A jeni i sigurt që dëshironi të fshini këtë koment?")) return;

        setActionLoading(reviewId); // Show loading while deleting
        try {
            await deleteDoc(doc(db, "reviews", reviewId));
            setResults(prev => prev.filter(r => r.id !== reviewId));
            alert("Komenti u fshi.");
        } catch (err) {
            console.error("Delete error:", err);
            alert("Dështoi fshirja.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleNoteChange = (id, value) => {
        setNotes(prev => ({ ...prev, [id]: value }));
    };

    // LOGIC FIX: Filter logic
    const displayedReviews = filterStatus === "pending" 
        ? results.filter(r => r.status !== "approved") 
        : results;

    return (
        <div className={styles.adminSection}>
            <div className={styles.tableHeader}>
                <h2 className={styles.title}>Moderimi i Komenteve</h2>
                
                <div className={styles.controlsRow}>
                    <form onSubmit={handleSearch} className={styles.searchBox}>
                        <input 
                            type="text" 
                            placeholder="Kërko mjeshtrin..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="submit">Kërko</button>
                    </form>

                    {/* LOGIC FIX: Proper toggle button */}
                    <button 
                        className={filterStatus === "pending" ? styles.filterBtnActive : styles.filterBtn}
                        onClick={() => setFilterStatus(prev => prev === "all" ? "pending" : "all")}
                    >
                        {filterStatus === "all" ? "Shiko Vetëm Në Pritje" : "Shiko Të Gjitha"}
                    </button>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.adminTable}>
                    <thead>
                        <tr>
                            <th>Klienti & Telefoni</th>
                            <th>Mjeshtri</th>
                            <th>Statusi</th>
                            <th>Vlerësimi & Komenti</th>
                            <th>Data</th>
                            <th>Veprimet</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedReviews.length > 0 ? (
                            displayedReviews.map((review) => (
                                <tr key={review.id} className={review.status === 'approved' ? '' : styles.pendingRow}>
                                    <td>
                                        <div className={styles.userCell}>
                                            <strong>{review.customerName}</strong>
                                            <a href={`tel:${review.customerPhone?.replace(/\s/g, '')}`} className={styles.callLink}>
                                                📞 {review.customerPhone}
                                            </a>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={styles.workerName}>{review.workerName}</span>
                                        <div className={styles.subText}>ID: {review.workerId?.substring(0, 8)}</div>
                                    </td>
                                    <td>
                                        <span className={review.status === 'approved' ? styles.badgeSuccess : styles.badgeWarning}>
                                            {review.status === 'approved' ? "I Miratuar ✅" : "Në Pritje ⏳"}
                                        </span>
                                    </td>
                                    <td className={styles.commentCell}>
                                        <div className={styles.ratingStars}>{"⭐".repeat(review.rating)}</div>
                                        <p className={styles.commentText}>{review.comment || "Pa koment"}</p>
                                        
                                        {review.status !== 'approved' ? (
                                            <input 
                                                type="text"
                                                className={styles.noteInput}
                                                placeholder="Shto shënim..."
                                                value={notes[review.id] || ""}
                                                onChange={(e) => handleNoteChange(review.id, e.target.value)}
                                            />
                                        ) : (
                                            review.adminNote && <div className={styles.savedNote}>📝 {review.adminNote}</div>
                                        )}
                                    </td>
                                    <td>
                                        {review.createdAt?.seconds 
                                            ? new Date(review.createdAt.seconds * 1000).toLocaleDateString('sq-AL')
                                            : "Sot"}
                                    </td>
                                    <td>
    <div className={styles.actionButtons}>
        {/* WhatsApp Direct Message Button */}
        <a 
            href={`https://wa.me/${review.customerPhone?.replace(/\D/g, '')}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.whatsappBtn}
        >
            💬 WhatsApp
        </a>

        {review.status !== 'approved' && (
            <button 
                onClick={() => handleApproveReview(review.id)}
                className={styles.approveBtn}
                disabled={actionLoading === review.id}
            >
                {actionLoading === review.id ? "..." : "Mirato"}
            </button>
        )}
        
        <button 
            onClick={() => handleDeleteReview(review.id)} 
            className={styles.deleteBtn}
            disabled={actionLoading === review.id}
        >
            Fshi
        </button>
    </div>
</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className={styles.noResults}>
                                    {loading ? "Duke u ngarkuar..." : "Nuk u gjet asnjë rishikim."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}