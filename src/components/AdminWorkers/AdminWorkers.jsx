import { collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where, increment } from "firebase/firestore";
import { db } from "../../api/firebase";
import { useState } from "react";
import styles from './AdminWorkers.module.css';

export default function AdminWorkers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  
  

  const handleSearch = async  (e) => {
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
        // 2. Correct the reference (use doc, not collection)
        const workerRef = doc(db, "workers", id); 
        const statsRef = doc(db, "metadata", "globalStats");

        // 3. Await the update
        await updateDoc(workerRef, { isPro: !isPro });
        await updateDoc(statsRef, {
          proCount: isPro ? increment(-1) : increment(1)
        });

        // 4. THE UI MAGIC: Update your local results array
        setResults(results.map(w => 
            w.id === id ? { ...w, isPro: !isPro } : w
        ));
        
    } catch (e) {
        console.error("Gabim!", e);
    }
  }


  async function handleIsActive(id, isActive) {
    try {
      const workerRef = doc(db, "workers",id);
      await updateDoc(workerRef, {
        isActive: !isActive
      })

      setResults(results.map(w => 
            w.id === id ? { ...w, isActive: !isActive } : w
        ));
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
     } catch (err) {
       console.error("Gabim!", err);
     }
  }

 // 1. Pass the whole worker object instead of just the ID
async function handleDelete(worker) {
  const { id, isPro, fullName } = worker; // Destructure what we need
  
  const confirmDelete = window.confirm(`A jeni i sigurt që dëshironi të fshini ${fullName}?`);
  if (!confirmDelete) return;

  try {
    const workerRef = doc(db, "workers", id);
    const statsRef = doc(db, "metadata", "globalStats");

    // 1. Perform the deletion
    await deleteDoc(workerRef);

    // 2. Prepare the stats update
    const statsUpdate = {
      workerCount: increment(-1)
    };

    // If the deleted worker was PRO, we must decrement that too!
    if (isPro) {
      statsUpdate.proCount = increment(-1);
    }

    await updateDoc(statsRef, statsUpdate);

    // 3. Update UI
    setResults(prevResults => prevResults.filter(w => w.id !== id));
    alert('Mjeshtri u fshi me sukses');

  } catch (err) {
    console.error("Gabim gjatë fshirjes:", err); // Fixed: was 'error'
    alert("Nuk keni autorizim ose ndodhi një gabim.");
  }
}

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
      {/* 1. Map through results only if they exist */}
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
  </div>
</td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
      {/* 2. The Correct "If" Check: 
          Show 'No Results' ONLY if we searched, finished loading, and found nothing */}
      {!loading && searchTerm && results.length === 0 && (
        <p>Asnjë rezultat u gjet për "{searchTerm}"</p>
      )}
    </ul>
  </div>
);

}