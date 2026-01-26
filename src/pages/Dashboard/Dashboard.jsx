import { useState, useEffect, useRef } from "react";
import styles from "./Dashboard.module.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db, storage } from "../../api/firebase";
import imageCompression from 'browser-image-compression';
import PhoneInput from 'react-phone-input-2';
import ReviewModal from '../../components/ReviewModal/ReviewModal'

import 'react-phone-input-2/lib/style.css';
import {
  doc,
  getDoc,
  getDocs,
  updateDoc,
  serverTimestamp,
  query,
  collection,
  where,
  orderBy,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading/Loading";
import Modal from "../../components/Modal/Modal";



function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Status is an object with message and type (success, error, or pending)
  const [status, setStatus] = useState({ message: "", type: "" });

  const [form, setForm] = useState({
    name: "",
    category: "",
    yearsExperience: "",
    hourlyRate: "",
    phoneNumber: "",
    bio: "",
    isPro: false,
    profileUrl: "",
    portfolio: [],
  });

  const [profileFile, setProfileFile] = useState(null);
  const [portfolioFiles, setPortfolioFiles] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isDirty, setIsDirty] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState({
  review: false,
  pro: false,
  error:false,
});
  const topRef = useRef();
  const MAX_FILE_SIZE = 3 * 1024 * 1024;
  const MAX_PORTFOLIO_IMG_NOPRO = 3;
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (!u) {
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "workers", u.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          setForm((prev) => ({
            ...prev,
            name: data.fullName || "",
            category: data.category || "",
            yearsExperience: data.yearsExperience || data.years || "",
            phoneNumber: data.phoneNumber || "",
            hourlyRate: data.startingPrice ?? data.hourlyRate ?? "",
            bio: data.bio || "",
            isPro: !!data.isPro,
            profileUrl: data.profilePic || "",
            portfolio: data.portfolio || [],
          }));
        }

        const q = query(
          collection(db, "reviews"),
          where("workerId", "==", u.uid),
          orderBy("createdAt", "desc")
        )

        const revSnap = await getDocs(q);
        setReviews(revSnap.docs.map(d => ({ id: d.id, ...d.data()})))
      } catch (err) {
        console.error("Failed to load dashboard data", err);
        setStatus({ message: "Dështoi ngarkimi i të dhënave.", type: "error" });
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setIsDirty(true);
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handlePhoneNum(value) {

    if (value !== form.phoneNumber) {
      setIsDirty(true);
    }


    setForm((prev) => ({
      ...prev, phoneNumber: value
    }))
  }

  function handleProfileSelect(e) {
    const file = e.target.files[0];
    if (file) {
      setProfileFile(file);
      setIsDirty(true);
    }  
  }


  
  function handlePortfolioSelect(e) {
    const files = Array.from(e.target.files || []);
    const currentCount = portfolioFiles.length + (form.portfolio?.length || 0);
    const totalAfterSelection = currentCount + files.length;

   if (!form.isPro && totalAfterSelection > MAX_PORTFOLIO_IMG_NOPRO) {
    setIsModalOpen((prev) => ({...prev, pro:true}));

    const spaceLeft = MAX_PORTFOLIO_IMG_NOPRO - currentCount;
    if (spaceLeft > 0) {
      const allowedFiles = files.slice(0, spaceLeft);
      setPortfolioFiles((prev) => [...prev, ...allowedFiles]);
      setIsDirty(true);
    }

    return;
   }

    if (files.length) {
       setPortfolioFiles((prev) => [...prev, ...files]);
       setIsDirty(true)
    } 
  }

  async function uploadFile(path, file) {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
     setIsDirty(true);
    return url;
  }

  function handleDeleteProfile() {
    setProfileFile(null);
    setForm(prev => ({...prev, profileUrl: null}));
     setIsDirty(true);
  }

  function handleDeleteExistingPortfolio(urlToDelete) {
    setIsDirty(true);
    setForm(prev => ({
      ...prev,
      portfolio: prev.portfolio.filter(url => url !== urlToDelete)
    }))
  }

  function handleDeleteNewPortfolio(indexToDelete) {
    setPortfolioFiles(prev => prev.filter((_, i) => i !== indexToDelete));
    // If no files left and nothing else changed, you might want to check dirty state
    // but usually, adding then removing still counts as a "change" session
  }

  function handleProfileView() {
  if (!user) return;

  const previewData = {
    ...form,
    fullName: form.name, // Matching the field name UserProfile expects
    // If a new file is selected, create a temporary local URL, otherwise use the saved one
    profilePic: profileFile ? URL.createObjectURL(profileFile) : form.profileUrl,
    experienceYears: form.yearsExperience,
  };

  // Use the user.uid for the URL so the profile logic stays consistent
  navigate(`/worker/${user.uid}`, { state: { workerData: previewData } });
}

  async function handleSave(e) {
    e.preventDefault();
    if (!user) return;

    topRef.current?.scrollIntoView({ behavior: 'smooth' });

    if(profileFile && profileFile.size > MAX_FILE_SIZE) {
      setStatus({ message: "Fotoja e profilit është mbi 3MB. Zgjidhni një foto më të vogël.", type: "error" });
      return;
    }

      if (!form.phoneNumber || form.phoneNumber.length < 8) {
         setIsModalOpen((prev) => ({...prev, error: true}));
      return;
  }

    setSaving(true);
    setStatus({ message: "Duke u ruajtur...", type: "pending" });

    try {
      const updates = { 
        fullName: form.name,
        phoneNumber: form.phoneNumber,
        category: form.category,
        experienceYears: form.yearsExperience,
        startingPrice: Number(form.hourlyRate) || 0,
        bio: form.bio,
        updatedAt: serverTimestamp(),
        profilePic: form.profileUrl || '',
      };

    

      if (!profileFile && (form.profileUrl === null || form.profileUrl === "")) {
        updates.profilePic = "";
      }

      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1024,
        useWebWorker: true,
      };

      if (profileFile) {
        setStatus({ message: "Duke procesuar foton e profilit...", type: "pending" });
        const compressedProfile = await imageCompression(profileFile, options);
        const profilePath = `workers/${user.uid}/profile-${Date.now()}`;
        const url = await uploadFile(profilePath, compressedProfile);
        updates.profilePic = url;
        setForm(prev => ({ ...prev, profileUrl: url }));
        setProfileFile(null);
      }

      if (portfolioFiles.length > 0) {
        setStatus({ message: `Duke ngarkuar ${portfolioFiles.length} foto të portofolit...`, type: "pending" });
        const urls = [];
        for (const f of portfolioFiles) {
          const compressedF = await imageCompression(f, options);
          const p = `workers/${user.uid}/portfolio/${Date.now()}-${f.name}`;
          const url = await uploadFile(p, compressedF);
          urls.push(url);
        }
        updates.portfolio = [...(form.portfolio || []), ...urls];
        setPortfolioFiles([]);
      }

      const docRef = doc(db, "workers", user.uid);
      await updateDoc(docRef, updates);
        setIsDirty(false);
      setStatus({ message: "Ndryshimet u ruajtën me sukses!", type: "success" });
    } catch (err) {
      console.error(err);
      setStatus({ message: "Gabim gjatë ruajtjes. Provoni përsëri.", type: "error" });
    } finally {
      setSaving(false);
    }
  }

  function openProModal() {
    setIsModalOpen((prev) => ({ ...prev, pro:true}));
  }



  async function handleGetPro() {
    if (!user) return;
    setSaving(true);
    try {
      const docRef = doc(db, "workers", user.uid);
      await updateDoc(docRef, {
        isPro: true,
        proSubscribedAt: serverTimestamp(),
      });
      setForm((p) => ({ ...p, isPro: true }));
      setIsModalOpen(false);
      setStatus({ message: "Faleminderit! Tani jeni anëtar PRO.", type: "success" });
    } catch (err) {
      console.error(err);
      setStatus({ message: "Dështoi aktivizimi i PRO.", type: "error" });
    } finally {
      setSaving(false);
    }
  }

  

  if (loading) return <Loading />
  if (!user) return <div className={styles.wrap}><p>Ju lutem hyni në llogari.</p></div>;

 return (
  <div className={styles.wrap}>
    <h1 className={styles.title} ref={topRef}>Paneli i Mjeshtrit</h1>

    {status.message && (
      <div className={`${styles.status} ${styles[status.type]}`}>
        {status.message}
      </div>
    )}

    <form className={styles.form} onSubmit={handleSave}>
      <div className={styles.row}>
        {/* Left Column: Info */}
        <div className={styles.col}>
          <label className={styles.label}>Emri dhe Mbiemri</label>
          <input name="name" value={form.name} onChange={handleChange} className={styles.input} />

          <label className={styles.label}>Numri i Telefonit (WhatsApp) *</label>
          <PhoneInput
            country={'xk'}
            value={form.phoneNumber}
            onChange={handlePhoneNum}
            containerClass={styles.phoneContainer}
            inputClass={styles.PhoneInput}
          />

          <label className={styles.label}>Kategoria</label>
          <input name="category" value={form.category} onChange={handleChange} className={styles.input} />

          <label className={styles.label}>Vite përvojë</label>
          <input name="yearsExperience" value={form.yearsExperience} onChange={handleChange} className={styles.input} />

          <label className={styles.label}>Çmimi fillestar (€)</label>
          <input
            name="hourlyRate"
            type="number"
            min="0"
            value={form.hourlyRate}
            onChange={handleChange}
            className={styles.input}
            placeholder="0"
          />

          <label className={styles.label}>Bio</label>
          <textarea name="bio" value={form.bio} onChange={handleChange} className={styles.textarea} />

          <div className={styles.proRow}>
            <label className={styles.label}>Statusi PRO</label>
            <button
              type="button"
              className={styles.proButton}
              onClick={openProModal}
              disabled={form.isPro || saving}
            >
              {form.isPro ? "Jeni PRO" : "Merr PRO"}
            </button>
          </div>
        </div>

        {/* Right Column: Media */}
        <div className={styles.col}>
          <label className={styles.label}>Foto Profili</label>
          <div className={styles.profilePreview}>
            {profileFile ? (
              <img src={URL.createObjectURL(profileFile)} alt="preview" className={styles.profile} />
            ) : form.profileUrl ? (
              <img src={form.profileUrl} alt="profile" className={styles.profile} />
            ) : (
              <div className={styles.avatarPlaceholder}>Foto</div>
            )}
          </div>

          <input type="file" id="profile-upload" accept="image/*" onChange={handleProfileSelect} className={styles.hiddenInput} />
          <label htmlFor="profile-upload" className={styles.customUploadBtn}>NGARKO FOTO</label>
          <button onClick={handleDeleteProfile} type="button" className={styles.deleteBtn}>Fshi Foton</button>

          <label className={styles.label}>Portofoli</label>
          <div className={styles.portfolioGrid}>
            {(form.portfolio || []).map((url, i) => (
              <div key={`old-${i}`} className={styles.portItem}>
                <img src={url} alt={`pf-${i}`} />
                <button type="button" className={styles.deletePhotoBtn} onClick={() => handleDeleteExistingPortfolio(url)}>✕</button>
              </div>
            ))}
            {portfolioFiles.map((f, i) => (
              <div key={`new-${i}`} className={styles.portItem}>
                <img src={URL.createObjectURL(f)} alt={`new-${i}`} />
                <button type="button" className={styles.deletePhotoBtn} onClick={() => handleDeleteNewPortfolio(i)}>✕</button>
              </div>
            ))}
          </div>

          <input type="file" id="portfolio-upload" accept="image/*" multiple onChange={handlePortfolioSelect} className={styles.hiddenInput} />
          <label htmlFor="portfolio-upload" className={styles.customUploadBtn}>SHTO FOTO NË PORTOFOL</label>
          
          <button
            onClick={() => setIsModalOpen((prev) => ({ ...prev, review: true }))}
            type="button"
            className={styles.reviewTriggerBtn}
          >
            Dërgo Linkun për Vlerësim
          </button>
        </div>
      </div>

      {!isDirty && (
        <button onClick={handleProfileView} type="button" className={styles.selfProfile}>
          Shiko Profilin Publik
        </button>
      )}
    </form>

    {/* Modals placed outside form to avoid interference */}
    <Modal open={isModalOpen.review} onClose={() => setIsModalOpen(prev => ({ ...prev, review: false }))}>
     <ReviewModal 
       user={user}
       onClose={() => setIsModalOpen(prev => ({ ...prev, review: false }))}
      />
    </Modal>

    <Modal open={isModalOpen.pro} onClose={() => setIsModalOpen(prev => ({...prev, pro: false}))}>
      <div className={styles.proContent}>
        <h2>PRO Membership</h2>
        <p>Zhblloko të gjitha mundësitë</p>
        <ul className={styles.benefitList}>
          <li className={styles.benefitItem}>🚀 <strong>Renditje Prioritare</strong></li>
          <li className={styles.benefitItem}>💎 <strong>Distinktiv i Verifikuar</strong></li>
          <li className={styles.benefitItem}>🖼️ <strong>Portofolio pa Limit</strong></li>
        </ul>
        <div className={styles.actions}>
          <button className={styles.purchaseBtn} onClick={handleGetPro}>Vazhdo te Pagesa (€14.99)</button>
          <button className={styles.cancelBtn} onClick={() => setIsModalOpen(prev => ({ ...prev, pro: false }))}>Më vonë</button>
        </div>
      </div>
    </Modal>
    <Modal 
     open={isModalOpen.error} 
     onClose={() => setIsModalOpen(prev => ({ ...prev, error: false }))}
    >
      <div className={styles.errorModalContent}>
      <div className={styles.errorIconContainer}>
        <span>⚠️</span>
      </div>
      <h2>Numri i pasaktë</h2>
      <p>
        Ju lutem shkruani një numër të vlefshëm telefoni. 
        Numri duhet të ketë të paktën 8 shifra për t'u regjistruar.
      </p>
      <button 
       className={styles.errorCloseBtn} 
       onClick={() => setIsModalOpen(prev => ({ ...prev, error: false }))}
      >
        Kuptova
      </button>
    </div>
   </Modal>

    {/* Sticky Footer */}
    <div className={`${styles.actionFooter} ${isDirty ? styles.footerVisible : ''}`}>
      <div className={styles.footerContent}>
        <div className={styles.footerLeft}><span className={styles.footerText}>Keni ndryshime të paruajtura</span></div>
        <div className={styles.footerRight}>
          <button onClick={handleProfileView} type="button" className={styles.selfProfile} style={{ margin: 0 }}>Shiko si duket</button>
          <button onClick={handleSave} className={styles.saveButtonSticky} disabled={saving}>
            {saving ? "Duke ruajtur..." : "Ruaj Ndryshimet"}
          </button>
        </div>
      </div>
    </div>
    <section className={styles.reviewsSection}>
  <div className={styles.reviewHeaderMain}>
    <h2 className={styles.sectionTitle}>Eksperiencat e Klientëve</h2>
    <span className={styles.reviewCount}>{ reviews?.length === 1 ? "1 Vlerësim" : `${reviews?.length} Vlerësime` }</span>
  </div>

  <div className={styles.reviewsGrid}>
    {reviews.length === 0 ? (
      <div className={styles.emptyState}>Nuk ka vlerësime ende.</div>
    ) : (
      reviews.map((r, index) => (
        <div key={r.id} className={styles.reviewCard} style={{ "--delay": `${index * 0.1}s` }}>
          <div className={styles.reviewTop}>
            <div className={styles.starBadge}>
              <span className={styles.starIcon}>★</span>
              <span className={styles.ratingNumber}>{r.rating}</span>
            </div>
            <div className={styles.verifiedTag}>I Verifikuar</div>
          </div>
          
          <p className={styles.comment}>{r.comment}</p>
          
          <div className={styles.reviewFooter}>
            <div className={styles.customerInfo}>
              <div className={styles.avatarMini}>{r.customerName?.[0] || "K"}</div>
              <strong>{r.customerName || "Klient"}</strong>
            </div>
            <span className={styles.reviewDate}>
               {r.createdAt?.toDate ? r.createdAt.toDate().toLocaleDateString('sq-AL') : "Sot"}
            </span>
          </div>
        </div>
      ))
    )}
  </div>
</section>
  </div>
);
}

export default Dashboard;