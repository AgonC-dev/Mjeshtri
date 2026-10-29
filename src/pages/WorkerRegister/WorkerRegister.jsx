import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./WorkerRegister.module.css";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { auth, db } from "../../api/firebase";
import { doc, serverTimestamp, increment, writeBatch } from "firebase/firestore";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

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
  'Të gjitha',
  'Instalues',
  'Elektricist',
  'Hidraulik',
  'Klima/AC',
  'Plastifikim',
  'Pastrim',
  'Kopshtar',
  'Mekanik',
  'Moler',
  'Murator',
  'Ndërtimtari',
  'Pllakaxhi',
  'Zdrukthëtar',
  'Kulme dhe Tjegulla',
  'Fasada dhe Izolim',
  'Parket dhe Laminat',
  'Dyer dhe Dritare',
  'Saldator',
  'Gips dhe Tavane',
  'Vullkanizer',
  'IT',
  "Tjetër"
];


function WorkerRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [ error, setError] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [ customCategory, setCustomCategory] = useState('')
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    city: "",
    phoneNumber: "",
    skills: "",
    photo: null,
    acceptTerms: false,
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [ isCustom, setIsCustom] = useState(false)


  useEffect(() => {
   window.scrollTo({
  top: 0,
  behavior: 'smooth'
});
    
  }, [])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "skills") {
  setIsCustom(value === "Tjetër");
}
    setError('')
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        photo: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

  

    if (!formData.acceptTerms) {
      setError("Ju lutem pranoni Kushtet e Shërbimit për të vazhduar.");
      return;
    }

    if (step === 1) {
      setStep(2)
      window.scrollTo(0, 0);
      return;
    }

    if (!formData.phoneNumber || formData.phoneNumber.length < 6) {
      setError("Ju lutem shkruani një numër telefoni të saktë.");
      return;
    }

    const isUsingCustomCategory = formData.skills === "Tjetër";
    const normalizedCustomCategory = customCategory.trim();

    if (!formData.skills) {
      setError("Ju lutem zgjidhni një kategori.");
      return;
    }

    if (isUsingCustomCategory && !normalizedCustomCategory) {
      setIsCustom(true);
      setError("Ju lutem shkruani profesionin që dëshironi të sugjeroni.");
      return;
    }

    let newlyCreatedUser = null;

    try {
      setIsPending(true);

      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        formData.email.trim(),
        formData.password
      );
      const user = userCredentials.user;
      newlyCreatedUser = user;

  const baseSlug = formData.name.toLowerCase()
  .trim()
  .replace(/[^\w\s-]/g, '') 
  .replace(/[\s_-]+/g, '-')
  .replace(/^-+|-+$/g, '');

const initialSlug = `${baseSlug}-${user.uid.substring(0, 4)}`;

// Then in setDoc, change slug: "", to:


const workerRef = doc(db, "workers", user.uid);
const statsRef = doc(db, "metadata", "globalStats");

const workerData = {
  uid: user.uid,
  fullName: formData.name.trim(),
  searchName: formData.name.trim().toLowerCase(),
  email: formData.email.trim(),
  phoneNumber: String(formData.phoneNumber || ""),
  slug: initialSlug,
  city: formData.city || "E panjohur",
  category: isUsingCustomCategory ? "Tjetër" : formData.skills,
  customCategory: isUsingCustomCategory ? normalizedCustomCategory : "",
  categoryStatus: isUsingCustomCategory ? "pending" : "approved",
  bio: "",
  profilePic: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || "M")}&background=random`,
  portfolio: [],
  startingPrice: 0,
  experienceYears: 0,
  whatsappRequests: 0,
  avgRating: null,
  reviewCount: 0,
  lastReviewAt: null,
  isPro: false,
  isAvailable: true,
  isActive: true,
  isVerified: false,
  isFeatured: false,
  showProStar: false,
  quickResponse: false,
  lastFingerprint: "",
  createdAt: serverTimestamp(),
};

const batch = writeBatch(db);
batch.set(workerRef, workerData);

if (isUsingCustomCategory) {
  const suggestionRef = doc(db, "categorySuggestions", user.uid);
  batch.set(suggestionRef, {
    workerId: user.uid,
    workerName: formData.name.trim(),
    workerEmail: formData.email.trim(),
    city: formData.city || "E panjohur",
    suggestedCategory: normalizedCustomCategory,
    status: "pending",
    createdAt: serverTimestamp(),
    reviewedAt: null,
    reviewedBy: null,
  });
}

batch.update(statsRef, {
  workerCount: increment(1),
});

await batch.commit();

      
      navigate("/", { state: { modalOpen: true, name: formData.name } });
    } catch(err) {


      
     switch (err.code) {
      case 'auth/email-already-in-use':
        setError("Ky email është i regjistruar paraprakisht.");
        setStep(1)
        break;

      case 'auth/invalid-email':
         setError('Ju lutem shkruani një email të saktë.');
         setStep(1)
        break;

      case 'auth/weak-password':
         setError('Fjalëkalimi duhet të jetë më i fortë (min. 6 karaktere).');
         setStep(1)
         break;

      case 'auth/user-not-found':
         setError('Nuk ekziston asnjë llogari me këtë email.');
         break;

      case 'auth/wrong-password':
         setError('Fjalëkalimi është i gabuar.');
         break;

      case 'auth/too-many-requests':
         setError('Shumë tentime të dështuara. Provo përsëri më vonë.');
        break;

      default:
        setError('Diçka shkoi keq. Ju lutem provoni përsëri.');
}
    } finally {
      setIsPending(false)
    }
  };

 

     



 return (
  <div className={styles.register}>
    <h1 className={styles.title}>Regjistrohu si Mjeshtër</h1>
    
    <form  onSubmit={handleSubmit} className={styles.form}>
      
      {/* STEP 1: Account Credentials */}
      {step === 1 && (
        <div className={styles.stepContainer}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Email *</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleInputChange} 
              required 
              className={styles.input} 
              placeholder="email@shembull.com"  />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Fjalëkalimi *</label>
            <input type="password" name="password" value={formData.password} onChange={handleInputChange} required className={styles.input} placeholder="Fjalëkalimi" />
          </div>
<div className={styles.formGroup}>
  <label className={styles.checkboxRow}>
    <input 
      type="checkbox" 
      name="acceptTerms" 
      checked={formData.acceptTerms} 
      onChange={handleInputChange} 
      className={styles.checkbox} 
    />
    <span className={styles.tosText}>
      Pranoj <Link to="/terms" className={styles.tosLink} onClick={(e) => e.stopPropagation()}>Kushtet e Shërbimit</Link>
    </span>
  </label>
</div>
          
          <button type="submit" className={styles.submitButton}>Vazhdo (Hapi Tjetër)</button>
        </div>
      )}

      {/* STEP 2: Professional Details */}
      {step === 2 && (
        <div className={styles.stepContainer}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Emri dhe Mbiemri *</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className={styles.input} placeholder="Shkruaj emrin tënd" />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Qyteti *</label>
            <select name="city" value={formData.city} onChange={handleInputChange} required className={styles.select}>
              <option value="">Zgjidh qytetin</option>
              {cities.map((city) => <option key={city} value={city}>{city}</option>)}
            </select>
          </div>

           <div className={styles.formGroup}>
  <label className={styles.label}>Numri i Telefonit (WhatsApp) *</label>
  <PhoneInput
    country={'xk'} // Kosovo default
    value={formData.phoneNumber}
    onChange={(value) => setFormData(prev => ({ ...prev, phoneNumber: value }))}
    containerClass={styles.phoneContainer}
    inputClass={styles.phoneInput}
    buttonClass={styles.phoneButton}
    dropdownClass={styles.phoneDropdown}
 
    // This allows the library to use your custom CSS classes
  />
</div>

          
<div className={styles.formGroup}>
  <label className={styles.label}>
    Kategoria *
  </label>

  <select
    name="skills"
    value={formData.skills}
    onChange={handleInputChange}
    required
    className={styles.select}
  >
    <option value="">Zgjidh kategorinë</option>

    {categories.map((cat) => (
      <option key={cat} value={cat}>
        {cat === "Tjetër" && customCategory.trim() ?
        `Tjetër (${customCategory})` : cat}
      </option>
    ))}
  </select>

 {formData.skills === "Tjetër" &&
  customCategory.trim() !== "" &&
  !isCustom && (
    <button
      type="button"
      onClick={() => setIsCustom(true)}
      className={styles.editBtn}
    >
      Edit
    </button>
)}

  {isCustom && (
    <div className={styles.customCategoryBox}>
      <div>
        <div className={styles.customCategoryTitle}>
          Profesion tjetër
        </div>

        <p className={styles.customCategoryDescription}>
          Nuk e gjete profesionin tënd në listë?
          Shkruaje më poshtë dhe ne do ta shqyrtojmë.
        </p>
      </div>

      <input
        type="text"
        className={styles.customCategoryInput}
        placeholder="p.sh. Montues i kuzhinave"
        value={customCategory}
        onChange={(e) => setCustomCategory(e.target.value)}
        maxLength={60}
        autoComplete="off"
      />

      <div className={styles.customCategoryHint}>
        <span>ℹ️</span>
        <span>
          Profesioni i sugjeruar do të shqyrtohet
          nga administratori.
        </span>
      </div>

      <div className={styles.customCategoryActions}>
        <button
          type="button"
          className={styles.customCategoryCancel}
          onClick={() => {
            setIsCustom(false);
            setCustomCategory("");
            setFormData((prev) => ({
              ...prev,
              skills: "",
            }));
          }}
        >
          Anulo
        </button>

        <button
          type="button"
          className={styles.customCategoryContinue}
          disabled={!customCategory.trim()}
          onClick={() => { setIsCustom(false);
            setFormData(prev => ({ ...prev, skills: "Tjetër"}))
          }}
        >
          Vazhdo
        </button>
      </div>
    </div>
  )}
</div>

          <div className={styles.buttonGroup}>
            <button type="button" onClick={() => setStep(1)} className={styles.backButton}>Kthehu</button>
            <button type="submit"  disabled={isPending} className={styles.submitButton}>{!isPending ? "Përfundo Regjistrimin" : "Duke u regjistruar"}</button>
          </div>
        </div>
      )}
        {error && <div className={styles.errorMessage}>
          <span className={styles.errorIcon}>⚠️</span> {error}
        </div>}
      {/* Step Counter at the bottom */}
      <div className={styles.stepCounter}>
        <span className={step === 1 ? styles.activeStep : ""}>1</span>
        <div className={styles.line}></div>
        <span className={step === 2 ? styles.activeStep : ""}>2</span>
      </div>

      <div className={styles.authSwitch}>
        Tashmë ke një llogari? <Link to="/login" className={styles.authLink}>Hyr</Link>
      </div>
    </form>


  </div>

  
);


}

export default WorkerRegister;
