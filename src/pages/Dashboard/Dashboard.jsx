import { useState, useEffect, useRef } from "react";
import styles from "./Dashboard.module.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db, storage } from "../../api/firebase";
import imageCompression from 'browser-image-compression';
import PhoneInput from 'react-phone-input-2';
import ReviewModal from '../../components/ReviewModal/ReviewModal';
import 'react-phone-input-2/lib/style.css';
import {
  doc, getDoc, getDocs, updateDoc, serverTimestamp,
  query, collection, where, orderBy, addDoc,
  setDoc,
  increment,
  arrayUnion
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import { CheckCircle2 } from "lucide-react";
import { Power } from "lucide-react";
import Modal from "../../components/Modal/Modal";
import { getFunctions, httpsCallable } from "firebase/functions";
import VerificationSection from "../../components/VerificationSection/VerificationSection";
import Pro from "../../components/Pro/Pro";

const functions = getFunctions();
const DEFAULT_AVATARS = [
  "/avatars/Avatar-1.jpg", 
  "/avatars/Avatar-2.jpg", 
  "/avatars/Avatar-3.jpg", 
  "/avatars/Avatar-4.jpg", 
  "/avatars/Avatar-5.jpg", 
  "/avatars/Avatar-6.jpg", 
  "/avatars/Avatar-7.jpg", 
  "/avatars/Avatar-8.jpg", 
];

const cities = [
  "Prishtinë",
  "Prizren",
  "Gjakovë",
  "Mitrovicë",
  "Pejë",
  "Ferizaj",
  "Gjilan",
];
const categories = [
  'Instalues',
  'Elektricist',
  'Klima/AC',
  'Plastifikim',
  'Pastrim',
  'Kopshtar',
  'Mekanik',
  'Moler',
  'Murator',
  'Vullkanizer',
];

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState({ message: "", type: "" });
  const [form, setForm] = useState({
    name: "", category: "", yearsExperience: "", hourlyRate: "",
    phoneNumber: "", bio: "", isPro: false, isAvailable: true,
    profileUrl: "", portfolio: [], slug: "", isFeatured: false, showProStar: false,
    quickResponse: false, reviewCount: 0, avgRating: null
  });
  const [profileFile, setProfileFile] = useState(null);
  const [portfolioFiles, setPortfolioFiles] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [whatsappRequests, setWhatsappRequests] = useState(0);
  const [sessions, setSessions] = useState([]);
  const [activeTab, setActiveTab] = useState('main');
  const [idFile, setIdFile] = useState(null);
  const [idPreview, setIdPreview] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationFailed, setVerificationFailed] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState({
    review: false, pro: false, error: false, health: false, reviewsList: false, avatar: false,
  });

  const [isPending, setIsPending] = useState(false);

  const topRef = useRef();
  const initialDataRef = useRef(null);
  const MAX_FILE_SIZE = 3 * 1024 * 1024;
  const MAX_PORTFOLIO_IMG_NOPRO = 3;
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) { setLoading(false); return; }
      try {
        const docRef = doc(db, "workers", u.uid);
        const snap = await getDoc(docRef);
        let isActuallyVerified = false;
        if (snap.exists()) {
          const data = snap.data();
          setWhatsappRequests(data.whatsappRequests || 0);
          isActuallyVerified = !!data.isVerified;
          const initialForm = {
            name: data.fullName || "",
            category: data.category || "",
            yearsExperience: data.experienceYears || 0,
            phoneNumber: data.phoneNumber || "",
            hourlyRate: data.startingPrice ?? data.hourlyRate ?? "",
            bio: data.bio || "",
            city: data.city || "",
            isPro: !!data.isPro,
            profileUrl: data.profilePic || "",
            portfolio: data.portfolio || [],
            slug: data.slug || "",
            isAvailable: data.isAvailable !== false,
            isVerified: isActuallyVerified,
            isFeatured: data.isFeatured,
            showProStar: data.showProStar,
            quickResponse: data.quickResponse,
            reviewCount: data.reviewCount,
            avgRating: data.avgRating,
          };

          setForm(initialForm);
          initialDataRef.current = initialForm;
        }



        if (!isActuallyVerified) {
        const pendingRef = doc(db, "verificationRequests", u.uid);
        const pendingSnap = await getDoc(pendingRef);
        if (pendingSnap.exists()) {
          const status = pendingSnap.data().status;
          if (status === "pending") {
            setIsPending(true);
          } else if ( status === "rejected") {
            setIsPending(false);
            setVerificationFailed(true)
          }
        }
      }

        const q = query(collection(db, "reviews"), where("workerId", "==", u.uid), orderBy("createdAt", "desc"));
        const sessionQuery = query(collection(db, "contactSessions"), where("workerId", "==", u.uid), where("usedForReview", "==", false), orderBy("createdAt", "desc"));
        const [sessionSnap, revSnap] = await Promise.all([getDocs(sessionQuery), getDocs(q)]);
        setSessions(sessionSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setReviews(revSnap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) { console.error(err); } finally { setLoading(false); }
    });
    return () => unsub();
  }, []);

  const handlePhoneNum = (value) => { if (value !== form.phoneNumber) setIsDirty(true); setForm(p => ({...p, phoneNumber: value})); };
  const handleChange = (e) => { const { name, value, type, checked } = e.target; setIsDirty(true); setForm(p => ({...p, [name]: type === "checkbox" ? checked : value})); };
  
  const handleProfileSelect = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  // Check single file size
  if (file.size > 10 * 1024 * 1024) {
    setStatus({ message: "Foto është mbi 10MB", type: "error" });
    return;
  }

  setProfileFile(file);
  setIsDirty(true);
};

  const handleSelectDefaultAvatar = (url) => { setProfileFile(url); setForm(prev => ({ ...prev, profileUrl: url})); setIsDirty(true); };
  const handleDeleteProfile = () => { setProfileFile(null); setForm(prev => ({...prev, profileUrl: ''})); setIsDirty(true); };
  
  const handlePortfolioSelect = (e) => {
  const selectedFiles = Array.from(e.target.files || []);
  if (selectedFiles.length === 0) return;

  // 1. Filter out files over 10MB immediately
  const validSizeFiles = selectedFiles.filter(f => f.size <= 10 * 1024 * 1024);
  
  if (validSizeFiles.length < selectedFiles.length) {
    setStatus({ 
      message: "Disa foto u hoqën sepse ishin mbi 10MB.", 
      type: "error" 
    });
  }

  if (validSizeFiles.length === 0) return;

  // 2. Calculate limits
  const currentCount = portfolioFiles.length + (form.portfolio?.length || 0);
  const totalAfter = currentCount + validSizeFiles.length;

  // 3. Handle Non-PRO limits
  if (!form.isPro && totalAfter > MAX_PORTFOLIO_IMG_NOPRO) {
    setIsModalOpen(p => ({ ...p, pro: true }));
    
    const spaceLeft = MAX_PORTFOLIO_IMG_NOPRO - currentCount;
    if (spaceLeft > 0) {
      const allowedFiles = validSizeFiles.slice(0, spaceLeft);
      setPortfolioFiles(prev => [...prev, ...allowedFiles]);
      setIsDirty(true);
    }
    return;
  }

  // 4. If all good, add the files
  setPortfolioFiles(prev => [...prev, ...validSizeFiles]);
  setIsDirty(true);
};

  const handleDeleteExistingPortfolio = (url) => { setIsDirty(true); setForm(p => ({...p, portfolio: p.portfolio.filter(u => u !== url)})); };
  const handleDeleteNewPortfolio = (i) => setPortfolioFiles(p => p.filter((_, idx) => idx !== i));
  const handleProfileView = () => {
    if (!user) return;
    navigate(`/worker/${user.uid}`, {
      state: {
        workerData: {
          ...form,
          fullName: form.name,
          profilePic: profileFile ? URL.createObjectURL(profileFile) : form.profileUrl,
          experienceYears: form.yearsExperience
        }
      }
    });
  };

  // Add this to your Dashboard.js
const handleInstantSave = async (key, value) => {
  // 1. Update UI state immediately (Optimistic UI)
  setForm(prev => ({ ...prev, [key]: value }));

  // 2. Write ONLY this specific change to the database
  try {
    const docRef = doc(db, "workers", user.uid);
    await updateDoc(docRef, { 
      [key]: value,
      updatedAt: serverTimestamp() 
    });
    
    // Optional: Show a quick success toast
    setStatus({ message: "Ndryshimi u ruajt!", type: "success" });
    setTimeout(() => setStatus({ message: "", type: "" }), 2000);
    
  } catch (err) {
    console.error("Instant save failed:", err);
    // Rollback if DB update fails
    setForm(prev => ({ ...prev, [key]: !value }));
    setStatus({ message: "Gabim gjatë ruajtjes!", type: "error" });
  }
};

 const handleSave = async (e) => {
    if (e) e.preventDefault();
    if (!user) return;

    // Validation
    if (!form.phoneNumber || form.phoneNumber.length < 8) { 
        setIsModalOpen(p => ({ ...p, error: true })); 
        return; 
    }

    setSaving(true);
    setStatus({ message: "Duke u ruajtur...", type: "pending" });

    try {
        const updates = {
            fullName: form.name,
            searchName: form.name.toLowerCase().trim(),
            phoneNumber: form.phoneNumber,
            category: form.category,
            experienceYears: form.yearsExperience,
            startingPrice: Number(form.hourlyRate) || 0,
            bio: form.bio,
            city: form.city,
            updatedAt: serverTimestamp(),
            profilePic: form.profileUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=00ff85&color=fff`,
        };

        // Pro Slug Logic
        if (form.isPro) {
            const baseSlug = form.name.toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '');
            updates.slug = `${baseSlug}-${user.uid.substring(0, 4)}`;
        }

        // 1. Handle Profile Picture Compression (Optimized for Avatars)
        let profileUrl = form.profileUrl;
        let newPortfolioUrls = [];

        if (profileFile) {
            if (profileFile instanceof File) {
                const profileOptions = { 
                    maxSizeMB: 0.5,           // Target 500KB
                    maxWidthOrHeight: 512,   // Avatars don't need to be huge
                    useWebWorker: true 
                };
                const compressed = await imageCompression(profileFile, profileOptions);
                const path = `workers/${user.uid}/profile-${Date.now()}`;
                profileUrl = await uploadFile(path, compressed);
                updates.profilePic = profileUrl;
            } else {
                updates.profilePic = profileFile;
            }
            setProfileFile(null);
        }

        // 2. Handle Portfolio Compression (Optimized for HD viewing)
        if (portfolioFiles.length > 0) {
            const portfolioOptions = { 
                maxSizeMB: 0.8,          // Target 800KB
                maxWidthOrHeight: 1280,  // HD Resolution
                useWebWorker: true 
            };
            
            const uploadPromises = portfolioFiles.map(async (file) => {
              const compressed = await imageCompression(file, portfolioOptions);
              const path = `workers/${user.uid}/portfolio/${Date.now()}-${file.name}`;
              return uploadFile(path, compressed);
            })
           
            newPortfolioUrls = await Promise.all(uploadPromises)
            updates.portfolio = arrayUnion(...newPortfolioUrls)
            setPortfolioFiles([]);
        }

        await updateDoc(doc(db, "workers", user.uid), updates);
        setIsDirty(false);
        setStatus({ message: "U ruajt me sukses!", type: "success" });
        
        setForm(prev => ({
        ...prev,
        profileUrl: profileUrl, 
        portfolio: [...(prev.portfolio || []), ...newPortfolioUrls],
        slug: updates.slug || prev.slug
    }));

    } catch (err) {
        console.error(err);
        setStatus({ message: "Gabim gjatë ruajtjes.", type: "error" });
    } finally {
        setSaving(false);
    }
};

  const uploadFile = async (path, file) => {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    return getDownloadURL(snapshot.ref);
  };

  const disableAccount = async () => {
    if (!user) return;
    const newStatus = !form.isAvailable;
    await updateDoc(doc(db, "workers", user.uid), { isAvailable: newStatus });
    setForm(p => ({ ...p, isAvailable: newStatus }));
  };

  const getHealthStatus = () => {
    const clicks = whatsappRequests || 0;
    const revs = reviews.length || 0;
    if (revs > (clicks + 1) && revs > 3) return { label: "ANOMALI", color: "#ff4d4d", score: "Kritik", desc: "Shumë vlerësime pa klikime reale." };
    const ratio = revs / (clicks + 1);
    if (ratio > 0.7 && revs > 5) return { label: "ELITARE", color: "#00ff85", score: "Normal", desc: "Shkallë konvertimi e lartë!" };
    return { label: "I RREGULLT", color: "#00ff85", score: "Normal", desc: "Profili juaj është në rregull." };
  };
  const health = getHealthStatus();
  const baseUrl = window.location.origin;
  const personalLink = form.slug ? `${baseUrl}/${form.slug}` : `${baseUrl}/worker/${user?.uid}`;

  const handleIdSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIdFile(file)
      setIdPreview(URL.createObjectURL(file))
    }
  }

  const handleUploadVerification = async () => {
    if (!idFile) return setStatus({ message: "Ju lutem zgjidhni një dokument.", type: "error" });
     
    setIsVerifying(true);

    try {
      const storageRef = ref(storage, `verifications/${user.uid}/${Date.now()}_id`)
      await uploadBytes(storageRef, idFile);
      
      const requestRef = doc(db, "verificationRequests", user.uid);

      await setDoc(requestRef, {
      uid: user.uid,
      email: user.email,
      workerName: form.name,
      rejectionCount: increment(0),
      status: "pending",
      createdAt: serverTimestamp(),
      searchName: form.name.toLowerCase(),
      storagePath: storageRef.fullPath
    }, { merge: true });

    setIsPending(true);
    setStatus({ message: "Dokumenti u dërgua me sukses! Do të shqyrtohet së shpejti.", type: "success" });
 
    } catch (err) {
      console.error(err);
      setStatus({ message: "Gabim gjatë dërgimit.", type: "error" });
    } finally {
      setIsVerifying(false)
    }
  }

  const handleRetake = () => {
    
     setIdFile(null)
     setIdPreview(null)

     setVerificationFailed(false);
     setStatus({ type: '', message: '' });

     setActiveTab("verification")
    
    
  }

  const handleCancel = () => {
  if (initialDataRef.current) {
    // 1. Restore the form text/settings
    setForm(initialDataRef.current);

    // 2. Clear the "pending" files that haven't been uploaded yet
    setProfileFile(null);
    setPortfolioFiles([]);

    // 3. Hide the sticky footer
    setIsDirty(false);

    // 4. Clear any status messages
    setStatus({ message: "", type: "" });
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
};

  if (loading) return <Loading />;

  return (
    <div className={styles.dashboardContainer}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.logoSquare}>M</div>
          <h2>Mjeshtri<span>.ks</span></h2>
        </div>

        <div className={styles.profileBrief}>
          <div className={styles.avatarWrapper} onClick={() => setIsModalOpen(p => ({...p, avatar: true}))}>
            <img
              src={profileFile instanceof File ? URL.createObjectURL(profileFile) : (form.profileUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name || 'M')}&background=00ff85&color=fff`)}
              alt="Avatar"
            />
            <div className={styles.statusBadge} style={{backgroundColor: form.isAvailable ? '#00ff85' : '#ff4d4d'}} />
            <div className={styles.editOverlay}>✎</div>
          </div>
          <div className={styles.usernameCon}>
           <h3>{form.name || "Emri juaj"} </h3> 
             {form.isVerified &&  <CheckCircle2 
                size={25} 
                className={styles.verifiedBadge} 
                fill="#0095f6" // Instagram blue fill
                color="#fff"    // White checkmark
              /> }
          </div>
          
          <p>{form.category || "Kategoria"}</p>
          {form.isPro && <span className={styles.proBadge}>PRO</span>}
        </div>

        <nav className={styles.sideNav}>
          <button 
            className={activeTab === 'main' ? styles.navItemActive : styles.navItem} 
            onClick={() => setActiveTab('main')}
          >
            📊 Dashboard
          </button>
          
          <button className={styles.navItem} onClick={handleProfileView}>👁 Shiko Profilin</button>
          
          {/* NEW VERIFICATION BUTTON */}
          <button 
            className={activeTab === 'verification' ? styles.navItemActive : styles.navItem} 
            onClick={() => setActiveTab('verification')}
          >
            {form.isVerified ? "✅ I Verifikuar" : "🛡️ Verifikohu"}
          </button>

          <button className={styles.navItem} onClick={() => setActiveTab('pro')}>🚀 Bëhu PRO</button>
        </nav>

        <div className={styles.healthCard} onClick={() => setIsModalOpen(p => ({...p, health: true}))}>
          <div className={styles.healthLabel}>Statusi i Integritetit</div>
          <div className={styles.healthBar}>
            <div style={{ width: (reviews.length / (whatsappRequests + 1)) * 100 + '%', backgroundColor: health.color }} />
          </div>
          <span>{health.label}</span>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className={styles.mainContent}>
        {activeTab === 'main' ? (
          <>
            <header className={styles.topHeader}>
              <div className={styles.headerText}>
                <h1>Mirësevini, {form.name.split(' ')[0] || 'Mjeshtër'}!</h1>
                <p>Këtu mund të menaxhoni prezantimin tuaj profesional.</p>
              </div>
              <div className={styles.headerActions}>
  <button 
    onClick={disableAccount} 
    className={`${styles.powerBtn} ${form.isAvailable ? styles.btnOnline : styles.btnOffline}`}
    title={form.isAvailable ? "Çaktivizo" : "Aktivizo"}
  >
    <Power size={18} strokeWidth={2.5} />
    <span>{form.isAvailable ? "Online" : "Në Pushim"}</span>
  </button>
</div>
            </header>

            {/* Status Message */}
            {status.message && (
              <div className={`${styles.status} ${styles[status.type]}`}>
                {status.message}
              </div>
            )}

            {/* STATS ROW */}
            <div className={styles.statsGrid}>
              <div className={styles.statBox}>
                <span className={styles.statIcon}>💬</span>
                <div>
                  <div className={styles.statVal}>{whatsappRequests}</div>
                  <div className={styles.statTitle}>Klikime WhatsApp</div>
                </div>
              </div>
              <div className={styles.statBox} onClick={() => setIsModalOpen(p => ({...p, reviewsList: true}))}>
                <span className={styles.statIcon}>⭐</span>
                <div>
                  <div className={styles.statVal}>{reviews.length}</div>
                  <div className={styles.statTitle}>Vlerësime (Shih të gjitha)</div>
                </div>
              </div>
              <div className={styles.statBox}>
                <span className={styles.statIcon}>🛠️</span>
                <div>
                  <div className={styles.statVal}>{form.yearsExperience || '0'}+</div>
                  <div className={styles.statTitle}>Vite Përvojë</div>
                </div>
              </div>
            </div>

            {/* CORE EDITING AREA */}
            <div className={styles.editorGrid}>
              <section className={styles.glassCard}>
  <div className={styles.cardHeader}>
    <h3>Informacionet Kryesore</h3>
  </div>

  {/* RRESHTI 1: EMRI DHE WHATSAPP */}
  <div className={styles.inputRow}>
    <div className={styles.field}>
      <label>Emri i Plotë</label>
      <input name="name" value={form.name} onChange={handleChange} />
    </div>
    <div className={styles.field}>
      <label>WhatsApp</label>
      <PhoneInput
        country={'xk'}
        value={form.phoneNumber}
        onChange={handlePhoneNum}
        containerClass={styles.phoneContainer}
        inputClass={styles.phoneInput}
      />
    </div>
  </div>

  {/* RRESHTI 2: QYTETI DHE BIO */}
  <div className={styles.inputRow}>
    <div className={styles.field}>
      <label>Qyteti</label>
     <select name="city" value={form.city} onChange={handleChange} required className={styles.select}>
        <option value="">Zgjidh Qytetin</option>
          {cities.map((cit) => <option key={cit} value={cit}>{cit}
        </option>)}
      </select>
    </div>
    <div className={styles.field}>
      <label>Përshkrimi i punës (Bio)</label>
      <textarea 
        name="bio" 
        value={form.bio} 
        onChange={handleChange} 
        rows="1" // E bëjmë 1 rresht fillimisht që të rreshtohet me Qytetin
        placeholder="Shërbimet tuaja..."
        style={{ minHeight: '45px' }} 
      />
    </div>
  </div>
</section>

              <section className={styles.glassCard}>
                <div className={styles.cardHeader}>
                  <h3>Shërbimi & Pagesa</h3>
                </div>
                <div className={styles.inputRow}>
                  <div className={styles.field}>
                    <label>Kategoria</label>
                     <select name="category" value={form.category} onChange={handleChange}>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                     </select>
                  </div>
                  <div className={styles.field}>
                    <label>Çmimi Fillestar (€)</label>
                    <input name="hourlyRate" type="number" min="0" value={form.hourlyRate} onChange={handleChange} />
                  </div>
                </div>
                <div className={styles.field}>
                  <label>Vite Përvojë</label>
                  <input name="yearsExperience" value={form.yearsExperience} onChange={handleChange} />
                </div>
              
              </section>
            </div>
          </>
        ) : activeTab === 'verification' ? (
          /* --- VERIFICATION TAB CONTENT --- */
          <VerificationSection 
            isVerified={form.isVerified}
            isPending={isPending}
            status={status}
            idPreview={idPreview}
            idFile={idFile}
            isVerifying={isVerifying}
            verificationFailed={verificationFailed}
            onIdSelect={handleIdSelect}
            onUpload={handleUploadVerification}
            onRetake={handleRetake}
            setActiveTab={setActiveTab}
          />
 
        ) : activeTab === 'pro' ? (
           <Pro 
            isPro={form.isPro}
            onUpgradeClick={() => setIsModalOpen(p => ({ ...p, pro:true}))}
            form={form}
            onStatus={setStatus}
            handleChange={handleInstantSave}
            link={personalLink}
           />
        ) : null}
      </main>

      {/* RIGHT RAIL */}
      <aside className={styles.rightRail}>
        <div className={styles.railSection}>
          <div className={styles.railHeader}>
            <h3>Portofoli</h3>
            <label className={styles.addBtn}>
              +<input type="file" multiple onChange={handlePortfolioSelect} hidden />
            </label>
          </div>
          <div className={styles.portfolioScroll}>
            {form.portfolio.map((url, i) => (
              <div key={i} className={styles.portThumb}>
                <img src={url} alt="work" />
                <button onClick={() => handleDeleteExistingPortfolio(url)}>×</button>
              </div>
            ))}
            {portfolioFiles.map((f, i) => (
              <div key={i} className={styles.portThumb}>
                <img src={URL.createObjectURL(f)} alt="new" />
                <button onClick={() => handleDeleteNewPortfolio(i)}>×</button>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.railSection}>
          <div className={styles.railHeader}>
            <h3>Kontaktet e Fundit</h3>
            <button className={styles.reqBtn} onClick={() => setIsModalOpen(p => ({...p, review: true}))}>Kërko Vlerësim</button>
          </div>
          <div className={styles.sessionsList}>
            {sessions.length === 0 ? (
              <p className={styles.empty}>Nuk ka kontakte të reja.</p>
            ) : (
              sessions.map(s => (
                <div key={s.id} className={styles.sessionItem}>
                  <div className={styles.sessionInfo}>
                    <strong>{s.customerName || "Klient"}</strong>
                    <span>{s.createdAt?.toDate().toLocaleDateString('sq-AL')}</span>
                  </div>
                  <div className={styles.sessionStatus}>I pa vlerësuar</div>
                </div>
              ))
            )}
          </div>
        </div>
      </aside>

      {/* STICKY FOOTER */}
      {isDirty && (
        <div className={styles.stickyAction}>
          <p>Keni bërë ndryshime në profil.</p>
          <div className={styles.footerBtns}>
            <button onClick={handleCancel} className={styles.btnCancel}>Anulo</button>
            <button onClick={handleSave} className={styles.btnSave} disabled={saving}>
              {saving ? "Duke ruajtur..." : "Ruaj Ndryshimet"}
            </button>
          </div>
        </div>
      )}

      {/* MODALS */}
      <Modal open={isModalOpen.avatar} onClose={() => setIsModalOpen(p => ({...p, avatar: false}))}>
        <div className={styles.modalContent}>
          <h2>Ndrysho foton e profilit</h2>
          <div className={styles.avatarUploadArea}>
            <input type="file" id="avatar-upload-modal" accept="image/*" onChange={handleProfileSelect} hidden />
            <label htmlFor="avatar-upload-modal" className={styles.uploadBtn}>Ngarko foto të re</label>
            {form.profileUrl && (
              <button className={styles.deleteBtn} onClick={handleDeleteProfile}>Fshi foton aktuale</button>
            )}
          </div>
          <p>Ose zgjidh një ilustrim:</p>
          <div className={styles.avatarGridModal}>
            {DEFAULT_AVATARS.map((url, idx) => (
              <div
                key={idx}
                className={`${styles.avatarOptionModal} ${form.profileUrl === url ? styles.selected : ''}`}
                onClick={() => { handleSelectDefaultAvatar(url); setIsModalOpen(p => ({...p, avatar: false})); }}
              >
                <img src={url} alt={`avatar-${idx}`} />
              </div>
            ))}
          </div>
          <button className={styles.closeBtn} onClick={() => setIsModalOpen(p => ({...p, avatar: false}))}>Mbylle</button>
        </div>
      </Modal>

      <Modal open={isModalOpen.reviewsList} onClose={() => setIsModalOpen(p => ({...p, reviewsList: false}))}>
        <div className={styles.modalContent}>
          <h2>Vlerësimet e Klientëve</h2>
          <div className={styles.reviewsModalList}>
            {reviews.length === 0 ? (
              <p className={styles.empty}>Nuk ka vlerësime ende.</p>
            ) : (
              reviews.map(r => (
                <div key={r.id} className={styles.modalReviewCard}>
                  <div className={styles.stars}>{'⭐'.repeat(r.rating)}</div>
                  <p>"{r.comment}"</p>
                  <small>- {r.customerName || 'Klient'}</small>
                </div>
              ))
            )}
          </div>
          <button className={styles.closeBtn} onClick={() => setIsModalOpen(p => ({...p, reviewsList: false}))}>Mbylle</button>
        </div>
      </Modal>

      <Modal open={isModalOpen.review} onClose={() => setIsModalOpen(p => ({...p, review: false}))}>
        <ReviewModal user={user} sessions={sessions} onClose={() => setIsModalOpen(p => ({...p, review: false}))} />
      </Modal>

      <Modal open={isModalOpen.pro} onClose={() => setIsModalOpen(p => ({...p, pro: false}))}>
        <div className={styles.modalContent}>
          <h2>PRO Membership</h2>
          <p>Zhblloko të gjitha mundësitë</p>
          <ul className={styles.benefits}>
            <li>🚀 Renditje Prioritare</li>
            <li>💎 Distinktiv i Verifikuar</li>
            <li>🖼️ Portofolio pa Limit</li>
          </ul>
          <div className={styles.modalActions}>
            <button className={styles.primaryBtn} onClick={async () => {
              const getPro = httpsCallable(functions, "handleGetPro");
              await getPro();
              setForm(prev => ({ ...prev, 
                isPro: true, 
                showProStar: true,
                isFeatured: true,
                quickResponse: true,
              }));
              setIsModalOpen(p => ({...p, pro: false}));
            }}>Vazhdo te Pagesa (€14.99)</button>
            <button className={styles.secondaryBtn} onClick={() => setIsModalOpen(p => ({...p, pro: false}))}>Më vonë</button>
          </div>
        </div>
      </Modal>

      <Modal open={isModalOpen.error} onClose={() => setIsModalOpen(p => ({...p, error: false}))}>
        <div className={styles.modalContent}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2>Numri i pasaktë</h2>
          <p>Numri duhet të ketë të paktën 8 shifra.</p>
          <button className={styles.primaryBtn} onClick={() => setIsModalOpen(p => ({...p, error: false}))}>Kuptova</button>
        </div>
      </Modal>

      <Modal open={isModalOpen.health} onClose={() => setIsModalOpen(p => ({...p, health: false}))}>
        <div className={styles.modalContent}>
          <h2>Statusi i Profilit: <span style={{ color: health.color }}>{health.score}</span></h2>
          <p><strong>{health.label}</strong></p>
          <p>{health.desc}</p>
          <div className={styles.statsRow}>
            <span>Klikime: {whatsappRequests}</span>
            <span>Vlerësime: {reviews.length}</span>
          </div>
          <button className={styles.primaryBtn} onClick={() => setIsModalOpen(p => ({...p, health: false}))}>E Kuptova</button>
        </div>
      </Modal>
    </div>
  );
}

export default Dashboard;