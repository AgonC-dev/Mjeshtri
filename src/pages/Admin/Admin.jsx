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

// Importojmë komponentët e nevojshëm nga Recharts
import { 
    ResponsiveContainer, 
    PieChart, 
    Pie, 
    Cell, 
    BarChart, 
    Bar, 
    XAxis, 
    YAxis, 
    Tooltip, 
    Legend,
    CartesianGrid
} from 'recharts';

async function hashPin(string) {
    const msgUint8 = new TextEncoder().encode(string); 
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("reports");
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [adminNote, setAdminNote] = useState([])
    const [isNotesOpen, setIsNotesOpen] = useState(false)
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
    const noteRef = useRef(null)
    
    const ADMIN_PIN_HASH = "8c2cd4a7bcff84654004d26d74ae332c7e24d701db2e5433ef672c2daf4b499c"; 
    const ADMIN_UID = "mUc8sPZ3IURtFT3As8y0YN9Bsil2";
    const navigate = useNavigate();
    

  
    useEffect(() => {
        if (!pinVerified && inputRef.current) {
            inputRef.current.focus();
        }

        const note = localStorage.getItem('Adminnote')
        if (note) {
            try {
                setAdminNote(JSON.parse(note))
            } catch (e) {
               console.error("Gabim gjatë leximit të shënimeve:", e);
               setAdminNote([]);
            }
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
        const inputHash = await hashPin(pinInput);
        if (inputHash === ADMIN_PIN_HASH) {
            setPinVerified(true);
            sessionStorage.setItem('admin_auth', 'true');
        } else {
            alert("PIN i gabuar!");
            setPinInput("");
        }
    };

    const handleNote = () => {
    const newNoteText = noteRef.current.value.trim();
    
    if (!newNoteText) return;

    // Formato datën dhe orën aktuale (shembull: 23:40 - 16 Maj)
    const now = new Date();
    const formattedTime = now.toLocaleTimeString('sq-AL', { hour: '2-digit', minute: '2-digit' }) + ' - ' + 
                          now.toLocaleDateString('sq-AL', { day: 'numeric', month: 'short' });

    // Krijo objektin e ri të shënimit
    const newNoteObject = {
        text: newNoteText,
        timestamp: formattedTime
    };

    // Shto objektin në listë
    const updatedNotes = [...adminNote, newNoteObject];
    
    setAdminNote(updatedNotes);
    localStorage.setItem('Adminnotes', JSON.stringify(updatedNotes));
    
    noteRef.current.value = "";
};

    const deleteNote = (indexToDelete) => {
    const updatedNotes = adminNote.filter((_, index) => index !== indexToDelete);
    setAdminNote(updatedNotes);
    localStorage.setItem('Adminnotes', JSON.stringify(updatedNotes));
};

    const handleLogoutSession = () => {
        sessionStorage.removeItem('admin_auth');
        setPinVerified(false);
        setPinInput('');
    };

    // --- Përgatitja e të dhënave për Grafikët ---
    const basicCount = (metaData.workerCount - metaData.proCount) || 0;
    
    // Data për Pie Chart (Pro vs Basic)
    const workerTypeData = [
        { name: 'Mjeshtër PRO 💎', value: metaData.proCount || 0 },
        { name: 'Mjeshtër Basic 🛠️', value: basicCount < 0 ? 0 : basicCount }
    ];
    const COLORS = ['#2563eb', '#94a3b8']; // Blu e errët për Pro, Gri moderne për Basic

    // Data për Bar Chart (Interaksionet dhe Angazhimi në Platformë)
    const platformActivityData = [
        { name: 'Klikime Kontakti', Vlera: metaData.contactCount || 0, color: '#10b981' },
        { name: 'Komente (Reviews)', Vlera: metaData.totalReviews || 0, color: '#f59e0b' },
        { name: 'Raportime 🚩', Vlera: metaData.reportCount || 0, color: '#ef4444' }
    ];

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
                 {/* --- BUTONI MINIMALIST NË DASHBOARD --- */}


                {/* Stat Cards Row */}
                <div className={styles.statsGrid}>
                    <div className={styles.statCard} onClick={() => setActiveTab('workers')}>
                        <span className={styles.statIcon}>📈</span>
                        <div className={styles.statInfo}>
                            <p>Totali i Kontakteve</p>
                            <h4>{metaData.contactCount || 0}</h4>
                        </div>
                    </div>
                    <button 
    type="button" 
    className={styles.notesToggleBtn} 
    onClick={() => setIsNotesOpen(true)}
>
    📌 Shënimet 
    {adminNote.length > 0 && <span className={styles.notesCountBadge}>{adminNote.length}</span>}
</button>

{/* --- PANEL ANËSOR (DRAWER) QË HAPET VETËM KUR KLIKOHET --- */}
{isNotesOpen && (
    <div className={styles.notesOverlay} onClick={() => setIsNotesOpen(false)}>
        <div className={styles.notesDrawer} onClick={(e) => e.stopPropagation()}>
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
                    type="text" 
                    ref={noteRef} 
                    placeholder="Shkruaj një shënim të ri..." 
                    className={styles.noteInput}
                />
                <button type="button" onClick={handleNote} className={styles.noteSaveBtn}>
                    Ruaj
                </button>
            </div>
            
            <ul className={styles.notesList}>
                {adminNote.length === 0 ? (
                    <p className={styles.noNotes}>Nuk ka asnjë shënim për momentin.</p>
                ) : (
                    adminNote.map((note, index) => (
                        <li key={index} className={styles.noteItem}>
                            <div className={styles.noteContent}>
                                <span className={styles.noteText}>{note.text}</span>
                                <span className={styles.noteTime}>{note.timestamp}</span>
                            </div>
                            <button 
                                type="button" 
                                onClick={() => deleteNote(index)} 
                                className={styles.deleteNoteBtn}
                            >
                                ❌
                            </button>
                        </li>
                    ))
                )}
            </ul>
        </div>
    </div>
)}
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
                          <h4 className={pendingVerifications > 0 ? styles.activeAlert : ""}>
                              {pendingVerifications}
                         </h4>
                      </div>
                   </div>
                </div>

                {/* SECTION: SEKSIONI I RI I GRAFIKËVE (CHARTS VISUALIZATION) */}
                <div className={styles.chartsSectionGrid}>
                    
                    {/* Grafiku 1: Ndarja e Përdoruesve */}
                    <div className={styles.chartHolderCard}>
                        <h3>Raporti i Regjistrimeve</h3>
                        <p className={styles.chartSub}>Ndarja ndërmjet llogarive Premium dhe Standard</p>
                        <div className={styles.chartWrapper}>
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={workerTypeData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {workerTypeData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => [`${value} Mjeshtër`, 'Sasia']} />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className={styles.chartSummaryText}>
                            Total: <strong>{metaData.workerCount || 0}</strong> mjeshtër të regjistruar.
                        </div>
                    </div>

                    {/* Grafiku 2: Aktiviteti i Përgjithshëm */}
                    <div className={styles.chartHolderCard}>
                        <h3>Aktiviteti Global në Platformë</h3>
                        <p className={styles.chartSub}>Interaksionet kryesore të ekzekutuara nga klientët</p>
                        <div className={styles.chartWrapper}>
                            <ResponsiveContainer width="100%" height={200}>
                                <BarChart data={platformActivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                                    <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                                    <Tooltip cursor={{ fill: '#f8fafc' }} />
                                    <Bar dataKey="Vlera" radius={[4, 4, 0, 0]}>
                                        {platformActivityData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>
            </div>

            <nav className={styles.tabNavigation}>
                <button className={activeTab === "reports" ? styles.activeTab : ""} onClick={() => setActiveTab("reports")}>
                    🚩 Raportet
                </button>
                <button className={activeTab === "workers" ? styles.activeTab : ""} onClick={() => setActiveTab("workers")}>
                    🔍 Menaxho Mjeshtrit
                </button>
                <button className={activeTab === "verifications" ? styles.activeTab : ""} onClick={() => setActiveTab("verifications")}>
                    💎 Verifikimet Pro
                </button>
                <button className={activeTab === "reviews" ? styles.activeTab : ""} onClick={() => setActiveTab("reviews")}>
                    ⭐ Reviews
                </button>
            </nav>

            <div className={styles.tabContent}>
                {activeTab === "workers" && <AdminWorkers />}
                {activeTab === "reports" && <AdminReports user={user} />}
                {activeTab === "reviews" && <AdminReviews />}
                {activeTab === "verifications" && <AdminVerifications setGlobalCount={setPendingVerifications} />}
            </div>
        </div>
    );
}