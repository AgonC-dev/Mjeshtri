import { useState, useEffect, useRef } from "react";
import styles from "./Dashboard.module.css";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db, storage } from "../../api/firebase";
import imageCompression from 'browser-image-compression';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

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
  const topRef = useRef();
  const MAX_FILE_SIZE = 3 * 1024 * 1024;

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

        // load reviews (if you store them in a collection named 'reviews')
        // const q = query(
        //   collection(db, "reviews"),
        //   where("workerId", "==", u.uid)
        // );
        // const qSnap = await getDocs(q);
        // const revs = qSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
        // setReviews(revs);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handlePhoneNum(value) {
    setForm((prev) => ({
      ...prev, phoneNumber: value
    }))
  }

  function handleProfileSelect(e) {
    const file = e.target.files[0];
    if (file) setProfileFile(file);
  }

  function handlePortfolioSelect(e) {
    const files = Array.from(e.target.files || []);
    if (files.length) setPortfolioFiles((prev) => [...prev, ...files]);
  }

  async function uploadFile(path, file) {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  }

  function handleDeleteProfile() {

    setProfileFile(null)
    setForm(prev => ({...prev, profileUrl: null}))
  }

 async function handleSave(e) {
  e.preventDefault();
  if (!user) return;

  topRef.current?.scrollIntoView({ behavior: 'smooth' });

  if(profileFile && profileFile.size > MAX_FILE_SIZE) {
    setStatus("Fotoja e profilit është mbi 3MB. Ju lutem zgjidhni një foto më të vogël.");
    return;
  }


  setSaving(true);
  setStatus("Duke procesuar imazhet...");

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
      updates.profilePic = ""; // This overwrites the old URL with nothing
    }

    // Compression settings
    const options = {
      maxSizeMB: 1,           // Target max file size (1MB is plenty for web)
      maxWidthOrHeight: 1024, // Resizes the image so the largest side is 1024px
      useWebWorker: true,
    };

    // 1. Process Profile Photo
    if (profileFile) {
      console.log('Original size:', profileFile.size / 1024 / 1024, 'MB');
      
      // The actual compression line
      const compressedProfile = await imageCompression(profileFile, options);
      
      console.log('Compressed size:', compressedProfile.size / 1024 / 1024, 'MB');

      const profilePath = `workers/${user.uid}/profile-${Date.now()}`;
      const url = await uploadFile(profilePath, compressedProfile);
      updates.profilePic = url;
      setForm(prev => ({ ...prev, profileUrl: url }));
      setProfileFile(null);
    }

    // 2. Process Portfolio Photos
    if (portfolioFiles.length > 0) {
      const urls = [];
      for (const f of portfolioFiles) {
        // Compress each portfolio image
        const compressedF = await imageCompression(f, options);
        
        const p = `workers/${user.uid}/portfolio/${Date.now()}-${f.name}`;
        const url = await uploadFile(p, compressedF);
        urls.push(url);
      }
      updates.portfolio = [...(form.portfolio || []), ...urls];

      setPortfolioFiles([])
    }

    // ... save to Firestore as you did before ...
    const docRef = doc(db, "workers", user.uid);
    await updateDoc(docRef, updates);
    setStatus("U ruajtën me sukses!");
  } catch (err) {
    console.error(err);
    setStatus("Gabim gjatë ruajtjes.");
  } finally {
    setSaving(false);
  }
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
      setStatus("Faleminderit! Jeni bërë PRO.");
    } catch (err) {
      console.error(err);
      setStatus("Dështoi aktivimi i PRO.");
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <div className={styles.wrap}>
        <p>Duke ngarkuar...</p>
      </div>
    );
  if (!user)
    return (
      <div className={styles.wrap}>
        <p>Ju lutem hyni në llogari për të hyrë në panelin tuaj.</p>
      </div>
    );

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title} ref={topRef}>Paneli i Mjeshtrit</h1>
      {status && <div className={styles.status}>{status}</div>}

      <form className={styles.form} onSubmit={handleSave}>
        <div className={styles.row}>
          <div className={styles.col}>
            <label className={styles.label}>Emri dhe Mbiemri</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className={styles.input}
            />

              <label className={styles.label}>Numri i Telefonit (WhatsApp) *</label>
  <PhoneInput
    country={'xk'} // Kosovo default
    value={form.phoneNumber}
    onChange={handlePhoneNum}
    containerClass={styles.phoneContainer}
    inputClass={styles.PhoneInput}
    buttonClass={styles.phoneButton}
    dropdownClass={styles.phoneDropdown}
    // This allows the library to use your custom CSS classes
  />

            <label className={styles.label}>Kategoria</label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className={styles.input}
            />

            <label className={styles.label}>Vite përvojë</label>
            <input
              name="yearsExperience"
              value={form.yearsExperience}
              onChange={handleChange}
              className={styles.input}
            />

            <label className={styles.label}>Çmimi fillestarë</label>
            <input
              name="hourlyRate"
              type="number"
              min="0"
              step="1"
              value={form.hourlyRate}
              onChange={handleChange}
              className={styles.input}
              placeholder="0"
            />

            <label className={styles.label}>Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              className={styles.textarea}
            />

            <div className={styles.proRow}>
              <label className={styles.label}>Statusi PRO</label>
              <button
                type="button"
                className={styles.proButton}
                onClick={handleGetPro}
                disabled={form.isPro || saving}
              >
                {form.isPro ? "Jeni PRO" : "Merr PRO"}
              </button>
            </div>

            <button
              type="submit"
              className={styles.saveButton}
              disabled={saving}
            >
              {saving ? "Duke ruajtur..." : "Ruaj ndryshimet"}
            </button>
          </div>

           <div className={styles.col}>
  <label className={styles.label}>Foto Profili</label>
  <div className={styles.profilePreview}>
    {profileFile ? (
      <img 
        src={URL.createObjectURL(profileFile)} 
        alt="preview" 
        className={styles.profile} 
      />
    ) : form.profileUrl ? (
      <img src={form.profileUrl} alt="profile" className={styles.profile}/>
    ) : (
      <div className={styles.avatarPlaceholder}>Foto</div>
    )}
  </div>

  {/* PROFILE UPLOAD */}
  <input
    type="file"
    id="profile-upload"
    accept="image/*"
    onChange={handleProfileSelect}
    className={styles.hiddenInput} 
  />
  <label htmlFor="profile-upload" className={styles.customUploadBtn}>
    NGARKO FOTO
  </label>

  <button onClick={handleDeleteProfile} type="button" className={styles.deleteBtn}>
    Fshi Profilin
  </button>

  <label className={styles.label}>Portofoli</label>
  <div className={styles.portfolioGrid}>
    {(form.portfolio || []).map((url, i) => (
      <div key={i} className={styles.portItem}>
        <img src={url} alt={`pf-${i}`} />
      </div>
    ))}
    {portfolioFiles.map((f, i) => (
      <div key={`new-${i}`} className={styles.portItem}>
        <img src={URL.createObjectURL(f)} alt={`new-${i}`} />
      </div>
    ))}
  </div>

  {/* PORTFOLIO UPLOAD */}
  <input
    type="file"
    id="portfolio-upload"
    accept="image/*"
    multiple
    onChange={handlePortfolioSelect}
    className={styles.hiddenInput}
  />
  <label htmlFor="portfolio-upload" className={styles.customUploadBtn}>
    NGARKO FOTOT
  </label>
</div>
        </div>
      </form>

      <section className={styles.reviewsSection}>
        <h2 className={styles.sectionTitle}>Vlerësimet</h2>
        {reviews.length === 0 ? (
          <p>Nuk ka vlerësime ende.</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className={styles.reviewCard}>
              <div className={styles.reviewHead}>
                <strong>{r.customerName || "Klient"}</strong>
                <span className={styles.rating}>{r.rating} ★</span>
              </div>
              <p>{r.comment}</p>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default Dashboard;
