import { collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where, increment } from "firebase/firestore";
import { db } from "../../api/firebase";
import { useState } from "react";
import styles from './AdminWorkers.module.css';

export default function AdminWorkers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  // State for controlling the Details Modal
  const [selectedWorker, setSelectedWorker] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    const term = searchTerm.trim().toLowerCase(); 
    if (!term) return;

    setLoading(true);

    try {
        const q = query(
            collection(db, "workers"),
            where("searchName", ">=", term),
            where("searchName", "<=", term + "\uf8ff")
        )

        const querySnapshot = await getDocs(q);
        const workers = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setResults(workers)
    } catch (err) {
      console.error("Search error:", err);
    } finally {
        setLoading(false)
    }
  }

 async function handleTogglePro(id, isPro) {
   try {
        const workerRef = doc(db, "workers", id); 
        const statsRef = doc(db, "metadata", "globalStats");

        await updateDoc(workerRef, { isPro: !isPro });
        await updateDoc(statsRef, {
          proCount: isPro ? increment(-1) : increment(1)
        });

        setResults(results.map(w => 
            w.id === id ? { ...w, isPro: !isPro } : w
        ));
        
        // Dynamic modal update if open
        if (selectedWorker && selectedWorker.id === id) {
          setSelectedWorker(prev => ({ ...prev, isPro: !isPro }));
        }
    } catch (e) {
        console.error("Gabim!", e);
    }
  }

  async function handleIsActive(id, isActive) {
    try {
      const workerRef = doc(db, "workers", id);
      await updateDoc(workerRef, {
        isActive: !isActive
      })

      setResults(results.map(w => 
            w.id === id ? { ...w, isActive: !isActive } : w
        ));

      if (selectedWorker && selectedWorker.id === id) {
        setSelectedWorker(prev => ({ ...prev, isActive: !isActive }));
      }
    } catch (err) {
      console.error("Gabim!", err);
    }
  }
  
  async function handleVerification(id , isVerified) {
     try {
       const workerRef = doc(db, "workers", id)
       await updateDoc(workerRef, {
        isVerified: !isVerified
       })

       setResults(results.map(w => 
            w.id === id ? { ...w, isVerified: !isVerified } : w
        ));

       if (selectedWorker && selectedWorker.id === id) {
         setSelectedWorker(prev => ({ ...prev, isVerified: !isVerified }));
       }
     } catch (err) {
       console.error("Gabim!", err);
     }
  }

async function handleDelete(worker) {
  const { id, isPro, fullName } = worker; 
  
  const confirmDelete = window.confirm(`A jeni i sigurt që dëshironi të fshini ${fullName}?`);
  if (!confirmDelete) return;

  try {
    const workerRef = doc(db, "workers", id);
    const statsRef = doc(db, "metadata", "globalStats");

    await deleteDoc(workerRef);

    const statsUpdate = {
      workerCount: increment(-1)
    };

    if (isPro) {
      statsUpdate.proCount = increment(-1);
    }

    await updateDoc(statsRef, statsUpdate);

    setResults(prevResults => prevResults.filter(w => w.id !== id));
    if (selectedWorker && selectedWorker.id === id) setSelectedWorker(null);
    alert('Mjeshtri u fshi me sukses');

  } catch (err) {
    console.error("Gabim gjatë fshirjes:", err); 
    alert("Nuk keni autorizim ose ndodhi një gabim.");
  }
}

// Helper to format Firestore timestamps elegantly
const formatTimestamp = (timestamp) => {
  if (!timestamp) return "N/A";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleString('sq-AL', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

return (
  <div className={styles.adminWrapper}>
    <form onSubmit={handleSearch}>
      <input 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Shkruaj emrin e plotë..."
      />
      <button type="submit" disabled={loading}>
        {loading ? "Duke kërkuar..." : "Kërko"}
      </button>
    </form>

    <ul className={styles.resultsList}>
     <div className={styles.tableContainer}>
  <table className={styles.adminTable}>
    <thead>
      <tr>
        <th>Mjeshtri</th>
        <th>Kategoria</th>
        <th>Qyteti</th>
        <th>Statusi</th>
        <th>Veprimet</th>
      </tr>
    </thead>
    <tbody>
      {results.map((worker) => (
        <tr key={worker.id}>
          <td>
            <div className={styles.nameCell}>
              <strong>{worker.fullName}</strong>
              <span className={styles.workerEmail}>{worker.email}</span>
              <span>ID: {worker.id.substring(0, 5)}...</span>
              
              {/* Inline account timestamps at the end of the block */}
              <div className={styles.inlineMetaTime}>
                <span>📅 Krijuar: {formatTimestamp(worker.createdAt)}</span>
                {worker.isPro && worker.proSubscribedAt && (
                  <span className={styles.proTimeBadge}>✨ PRO që nga: {formatTimestamp(worker.proSubscribedAt)}</span>
                )}
              </div>
            </div>
          </td>
          <td>{worker.category}</td>
          <td>{worker.city || "N/A"}</td>
          <td>
            <span className={worker.isPro ? styles.badgePro : styles.badgeBasic}>
              {worker.isPro ? "PRO" : "Basic"}
            </span>
          </td>
          <td className={styles.actionCell}>
  <div className={styles.buttonGroup}>
    <button 
    onClick={() => handleVerification(worker.id, worker.isVerified)}
    className={`${styles.adminBtn} ${worker.isVerified ? styles.unverifyBtn : styles.verifyBtn}`}
    title={worker.isVerified ? "Hiqe Verifikimin" : "Verifiko Punëtorin"}
  >
    {worker.isVerified ? "🛡️ I Verifikuar" : "🔍 Verifiko"}
  </button>
    {/* PRO TOGGLE */}
    <button 
      onClick={() => handleTogglePro(worker.id, worker.isPro)}
      className={`${styles.adminBtn} ${worker.isPro ? styles.removeProBtn : styles.addProBtn}`}
      title={worker.isPro ? "Hiqe statusin PRO" : "Bëje PRO"}
    >
      {worker.isPro ? "⭐ Hiqe Pro" : "✨ Bëje Pro"}
    </button>

    {/* SUSPEND TOGGLE */}
    <button 
      onClick={() => handleIsActive(worker.id, worker.isActive)} 
      className={`${styles.adminBtn} ${worker.isActive ? styles.suspendBtn : styles.activateBtn}`}
    >
      {worker.isActive ? "🚫 Suspend" : "✅ Aktivizo"}
    </button>

    {/* DELETE */}
    <button 
      onClick={() => handleDelete(worker)} 
      className={`${styles.adminBtn} ${styles.deleteBtn}`}
    >
     🗑️ Fshij
    </button>

    {/* THREE DOTS / SEE DETAILS */}
    <button 
      onClick={() => setSelectedWorker(worker)}
      className={`${styles.adminBtn} ${styles.detailsBtn}`}
      title="Shiko Detajet e Plota"
    >
      •••
    </button>
  </div>
</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
      {!loading && searchTerm && results.length === 0 && (
        <p>Asnjë rezultat u gjet për "{searchTerm}"</p>
      )}
    </ul>

    {/* ADVANCED PROFILE DETAILS MODAL */}
    {selectedWorker && (
      <div className={styles.modalOverlay} onClick={() => setSelectedWorker(null)}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h2>Profili i Plotë i Mjeshtrit</h2>
            <button className={styles.closeModalBtn} onClick={() => setSelectedWorker(null)}>&times;</button>
          </div>
          
          <div className={styles.modalBody}>
            <div className={styles.infoSection}>
              <h3>🔑 Informacioni Bazik</h3>
              <div className={styles.infoGrid}>
                <div><strong>Emri i Plotë:</strong> {selectedWorker.fullName}</div>
                <div><strong>Slug:</strong> {selectedWorker.slug || "N/A"}</div>
                <div><strong>UID (Firebase):</strong> {selectedWorker.uid}</div>
                <div><strong>Email:</strong> {selectedWorker.email}</div>
                <div><strong>Numri i Telefonit:</strong> {selectedWorker.phoneNumber || "N/A"}</div>
                <div><strong>Qyteti:</strong> {selectedWorker.city || "N/A"}</div>
              </div>
            </div>

            <div className={styles.infoSection}>
              <h3>🛠️ Specifikacionet Profesionale</h3>
              <div className={styles.infoGrid}>
                <div><strong>Kategoria:</strong> {selectedWorker.category}</div>
                <div><strong>Përvoja:</strong> {selectedWorker.experienceYears} Vite</div>
                <div><strong>Çmimi Fillestar:</strong> {selectedWorker.startingPrice} €</div>
                <div><strong>Përgjigje e Shpejtë:</strong> {selectedWorker.quickResponse ? "Po" : "Jo"}</div>
                <div><strong>I Disponueshëm:</strong> {selectedWorker.isAvailable ? "Po ✅" : "Jo ❌"}</div>
              </div>
              <div className={styles.bioBlock}>
                <strong>Biografia / Përshkrimi:</strong>
                <p>{selectedWorker.bio || "Nuk ka biografi të shkruar..."}</p>
              </div>
            </div>

            <div className={styles.infoSection}>
              <h3>📊 Statistikat & Metrikat</h3>
              <div className={styles.infoGrid}>
                <div><strong>Vlerësimi Mesatar:</strong> ⭐ {selectedWorker.avgRating !== null ? selectedWorker.avgRating : "0"}</div>
                <div><strong>Numri i Rishikimeve:</strong> {selectedWorker.reviewCount}</div>
                <div><strong>Klikime në WhatsApp:</strong> {selectedWorker.whatsappRequests}</div>
                <div><strong>Rishikimi i Fundit më:</strong> {formatTimestamp(selectedWorker.lastReviewAt)}</div>
              </div>
            </div>

            <div className={styles.infoSection}>
              <h3>🛡️ Statusi Administrativ & Siguria</h3>
              <div className={styles.infoGrid}>
                <div><strong>Statusi i Llogarisë:</strong> {selectedWorker.isActive ? "Aktive ✅" : "E Suspenduar 🚫"}</div>
                <div><strong>I Verifikuar:</strong> {selectedWorker.isVerified ? "Po 🛡️" : "Jo 🔍"}</div>
                <div><strong>Verifikimi i Refuzuar:</strong> {selectedWorker.verificationRejected ? "Po ❌" : "Jo"}</div>
                <div><strong>Plan Anëtarësimi:</strong> {selectedWorker.isPro ? "PRO ⭐" : "Basic"}</div>
                <div><strong>Ylli PRO i Shfaqur:</strong> {selectedWorker.showProStar ? "Po" : "Jo"}</div>
                <div><strong>I Rekomanduar (Featured):</strong> {selectedWorker.isFeatured ? "Po 🔥" : "Jo"}</div>
                <div className={styles.fullWidthGridItem}><strong>Gjurmë Digjitale (Fingerprint):</strong> <code className={styles.codeSnippet}>{selectedWorker.lastFingerprint || "Pa të dhëna"}</code></div>
              </div>
            </div>

            <div className={styles.infoSection}>
              <h3>⏳ Historiku i Kohës</h3>
              <div className={styles.infoGrid}>
                <div><strong>Regjistrimi në Platformë:</strong> {formatTimestamp(selectedWorker.createdAt)}</div>
                <div><strong>Abonimi PRO:</strong> {formatTimestamp(selectedWorker.proSubscribedAt)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )}
  </div>
);
}