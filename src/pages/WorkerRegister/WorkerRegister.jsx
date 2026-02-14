import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./WorkerRegister.module.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../api/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import PhoneInput from 'react-phone-input-2';
import Modal from "../../components/Modal/Modal";
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
  'Klima/AC',
  'Plastifikim',
  'Pastrim',
  'Fotograf',
  'Përkthyes',
  'Avokat',
  'Kontabilist',
  'Kopshtar',
  'Mekanik',
  'Moler',
  'Murator',
  'Vullkanizer',
  'Programer',
  'Dizajner Grafik'
];

function WorkerRegister() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [ error, setError] = useState('');
  const [isPending, setIsPending] = useState(false);
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


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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

    try {
    setIsPending(true)
        
      const userCrendentials = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCrendentials.user;
     

  const baseSlug = formData.name.toLowerCase()
  .trim()
  .replace(/[^\w\s-]/g, '')
  .replace(/[\s_-]+/g, '-')
  .replace(/^-+|-+$/g, '');

const initialSlug = `${baseSlug}-${user.uid.substring(0, 4)}`;

// Then in setDoc, change slug: "", to:


await setDoc(doc(db, "workers", user.uid), {
  uid: user.uid,
  fullName: formData.name || "",
  email: formData.email || "",
  phoneNumber: formData.phoneNumber || "",
  slug: initialSlug, 

  // Use fallbacks to prevent "Bad Request"
  city: formData.city || "E panjohur", 
  category: formData.skills || "Të tjera", 

  bio: "",
  profilePic: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'M')}&background=random`,
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
  
  createdAt: serverTimestamp(),
});


      
      navigate("/", { state: { modalOpen: true } });
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
    
    <form onSubmit={handleSubmit} className={styles.form}>
      
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
            <div className={styles.checkboxRow}>
              <input type="checkbox" name="acceptTerms" checked={formData.acceptTerms} onChange={handleInputChange} className={styles.checkbox} />
              <label className={styles.tosText}>Pranoj <a href="/terms" className={styles.tosLink}>Kushtet e Shërbimit</a></label>
            </div>
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
            <label className={styles.label}>Kategoria *</label>
            <select name="skills" value={formData.skills} onChange={handleInputChange} required className={styles.select}>
              <option value="">Zgjidh kategorinë</option>
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
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
