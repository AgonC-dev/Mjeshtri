import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Login.module.css";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../api/firebase";
import { getFunctions, httpsCallable } from "firebase/functions";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [ error, setError ] = useState('')
  const [ isPending, setIsPending] = useState(false);
  const [resetMessage, setResetMessage] = useState('');



  const handleChange = (e) => {
    const { name, value } = e.target;
    if (resetMessage) setResetMessage('');
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: replace with real auth call
    setError('')

   if (!formData.email.includes('@')) {
      setError('Email-i duhet të përmbajë @');
      return;
    }
    if (formData.password.length < 6) {
      setError('Fjalëkalimi duhet të jetë së paku 6 karaktere');
      return;
    }
    
    setIsPending(true);

    try {
      const userCrendentials = await signInWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password,
      )

      const user = userCrendentials.user;

      
      navigate('/')
    } catch (err) {
     switch (err.code) {
        case 'auth/user-not-found': setError('Ky email nuk ekziston.'); break;
        case 'auth/wrong-password': setError('Fjalëkalimi i gabuar.'); break;
        default: setError('Email ose fjalëkalimi i gabuar.');
      }
    } finally {
        setIsPending(false)
    }
  };

 

  
const handleResetPassword = async () => {
  const email = formData.email?.trim();

  if (!email) {
    setError("Shkruaj një email.");
    return;
  }

  setError("");
  setResetMessage("");

  try {
    const functions = getFunctions(undefined, "us-central1");
    const requestPasswordReset = httpsCallable(
      functions,
      "requestPasswordReset"
    );

    const result = await requestPasswordReset({ email });

    setResetMessage(result.data.message);
  } catch (error) {
    console.error("Password reset request failed:", error);

    setError(
      "Nuk mundëm ta përpunonim kërkesën. Provo përsëri më vonë."
    );
  }
};


  return (
    <div className={styles.loginWrap}>
  <div className={styles.card}>
    <h1 className={styles.title}>Hyr në llogari</h1>
    
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <label className={styles.label} htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className={styles.input}
          placeholder="email@shembull.com"
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label} htmlFor="password">Fjalëkalimi</label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          className={styles.input}
          placeholder="Fjalëkalimi"
          required
        />
      </div>
      {resetMessage &&  <p className={styles.resetMessage}>{resetMessage}</p> }
     
      <div className={styles.footerActions}>
        <div className={styles.resetRow}>
          <button type="button" onClick={handleResetPassword} className={styles.textBtn}>
            Harrove fjalëkalimin?
          </button>
        </div>
        
        <button type="submit" className={styles.submitButton} disabled={isPending}>
          {isPending ? <div className={styles.spinner} /> : "Vazhdo"}
        </button>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.registerRow}>
          <span>Nuk ke llogari?</span>
          <Link to='/register'>Krijo një të re</Link>
        </div>
      </div>
    </form>
  </div>
</div>
  );
}


export default Login;
