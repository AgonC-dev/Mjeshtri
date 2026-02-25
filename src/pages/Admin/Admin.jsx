import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState, useRef } from "react";
import { auth, db } from "../../api/firebase";
import AdminWorkers from "../../components/AdminWorkers/AdminWorkers";
import { useNavigate } from "react-router-dom";
import styles from './Admin.module.css';
import AdminReports from "../../components/AdminReports/AdminReports";
import { doc, onSnapshot } from "firebase/firestore";
import AdminReviews from "../../components/AdminReviews/AdminReviews";
import AdminVerifications from "../../components/AdminVerifications/AdminVerifications";

async function hashPin(string) {
    const msgUint8 = new TextEncoder().encode(string); 
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("reports");
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState();
    const [pendingVerifications, setPendingVerifications] = useState(0);
    const [metaData, setMetaData] = useState({ 
        workerCount: 0, 
        proCount: 0, 
        contactCount: 0, 
        reportCount: 0, 
        totalReviews: 0 
    });
    
    const [pinVerified, setPinVerified] = useState(sessionStorage.getItem('admin_auth') === 'true');
    const [pinInput, setPinInput] = useState("");
    const inputRef = useRef(null);
    const ADMIN_PIN_HASH = "8c2cd4a7bcff84654004d26d74ae332c7e24d701db2e5433ef672c2daf4b499c" 
    
    const ADMIN_UID = "KMQyw2VBhUbzjKWPbV3A0ntO6Ho2";
    const navigate = useNavigate();
  
    useEffect(() => {
        if (!pinVerified && inputRef.current) {
            inputRef.current.focus();
        }
    }, [pinVerified]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser || currentUser.uid !== ADMIN_UID) {
                navigate('/');
                return;
            }
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [navigate]);

    useEffect(() => {
        if (!user) return; 
        const docRef = doc(db, "metadata", "globalStats");
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setMetaData(docSnap.data());
            }
        }, (err) => {
            console.error("Metadata error:", err);
        });
        return () => unsubscribe();
    }, [user]);

    const handlePinSubmit = async (e) => {
        e.preventDefault();
        const inputHash = await hashPin(pinInput)
        if (inputHash === ADMIN_PIN_HASH) {
            setPinVerified(true);
            sessionStorage.setItem('admin_auth', 'true');
        } else {
            alert("PIN i gabuar!");
            setPinInput("");
        }
    };

    const handleLogoutSession = () => {
        sessionStorage.removeItem('admin_auth');
        setPinVerified(false);
        setPinInput('')
    };

    if (loading) return <div className={styles.spinner}>Verifikimi i autoritetit...</div>;

    if (!pinVerified) {
        return (
            <div className={styles.pinOverlay}>
                <form className={styles.pinBox} onSubmit={handlePinSubmit}>
                    <div className={styles.lockIcon}>🔐</div>
                    <h3>Hyrja e Sigurt</h3>
                    <p>Shënoni PIN-in për të hapur panelin e kontrollit</p>
                    <input 
                        ref={inputRef}
                        type="password" 
                        placeholder="****"
                        value={pinInput}
                        onChange={(e) => setPinInput(e.target.value)}
                        className={styles.pinInput}
                    />
                    <button type="submit" className={styles.verifyBtn}>Hyr</button>
                </form>
            </div>
        );
    }

    return (
        <div className={styles.adminDashboardContainer}>
            <div className={styles.dashboardHeader}>
                <div className={styles.titleGroup}>
                    <h1>Paneli i Adminit</h1>
                    <button onClick={handleLogoutSession} className={styles.logoutBtn}>
                        Mbyll Sesionin 🔒
                    </button>
                </div>

                {/* NEW METRICS GRID */}
                <div className={styles.statsGrid} >
                    <div className={styles.statCard} onClick={() => setActiveTab('workers')}>
                        <span className={styles.statIcon}>📈</span>
                        <div className={styles.statInfo}>
                            <p>Totali i Kontakteve</p>
                            <h4>{metaData.contactCount || 0}</h4>
                        </div>
                    </div>
                    
                    <div className={styles.statCard} onClick={() => setActiveTab('reviews')}>
                        <span className={styles.statIcon}>⭐</span>
                        <div className={styles.statInfo}>
                            <p>Total Reviews</p>
                            <h4>{metaData.totalReviews || 0}</h4>
                        </div>
                    </div>
                    <div className={styles.statCard} onClick={() => setActiveTab('reports')}>
                        <span className={styles.statIcon}>🚩</span>
                        <div className={styles.statInfo}>
                            <p>Raportime</p>
                            <h4 style={{ color: metaData.reportCount > 0 ? '#ef4444' : 'inherit' }}>
                                {metaData.reportCount || 0}
                            </h4>
                        </div>
                    </div>
                    <div className={styles.statCard} onClick={() => setActiveTab('verifications')}>
                       <span className={styles.statIcon}>🆔</span>
                       <div className={styles.statInfo}>
                          <p>Verifikime në Pritje</p>
                          <h4 className={metaData.pendingVerificationCount > 0 ? styles.activeAlert : ""}>
                              {pendingVerifications}
                         </h4>
                      </div>
                   </div>
                </div>

                <div className={styles.progressSection}>
                    <div className={styles.progressHeader}>
                        <h3>Përbërja e Platformës</h3>
                        <span>{metaData.workerCount || 0} Mjeshtër</span>
                    </div>

                    <div className={styles.progressBarTrack}>
                        <div 
                            className={styles.progressSegmentPro} 
                            style={{ width: `${(metaData.proCount / metaData.workerCount) * 100 || 0}%` }}
                            title="Anëtarët PRO"
                        ></div>
                        <div 
                            className={styles.progressSegmentActive} 
                            style={{ width: `${((metaData.workerCount - metaData.proCount) / metaData.workerCount) * 100 || 0}%` }}
                            title="Anëtarët Basic"
                        ></div>
                    </div>

                    <div className={styles.progressLegend}>
                        <div className={styles.legendItem}>
                            <span className={`${styles.dot} ${styles.dotPro}`}></span>
                            <span>PRO ({metaData.proCount || 0})</span>
                        </div>
                        <div className={styles.legendItem}>
                            <span className={`${styles.dot} ${styles.dotBasic}`}></span>
                            <span>Basic ({(metaData.workerCount - metaData.proCount) || 0})</span>
                        </div>
                    </div>
                </div>
            </div>

            <nav className={styles.tabNavigation}>
                <button 
                    className={activeTab === "reports" ? styles.activeTab : ""} 
                    onClick={() => setActiveTab("reports")}
                >
                    🚩 Raportet
                </button>
                <button 
                    className={activeTab === "workers" ? styles.activeTab : ""} 
                    onClick={() => setActiveTab("workers")}
                >
                    🔍 Menaxho Mjeshtrit
                </button>
                <button 
                    className={activeTab === "verifications" ? styles.activeTab : ""} 
                    onClick={() => setActiveTab("verifications")}
                >
                    💎 Verifikimet Pro
                </button>
                <button 
                    className={activeTab === "reviews" ? styles.activeTab : ""} 
                    onClick={() => setActiveTab("reviews")}
                >
                    ⭐ Reviews
                </button>
            </nav>

            <div className={styles.tabContent}>
                {activeTab === "workers" && <AdminWorkers />}
                {activeTab === "reports" && <AdminReports user={user} />}
                {activeTab === "reviews" && <AdminReviews />}
                {activeTab === "verifications" && <AdminVerifications  setGlobalCount={setPendingVerifications}/>}
            </div>
        </div>
    );
}