import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Login.module.css";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../api/firebase";


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
  if (!formData.email) {
    setError("Shkuraj një email ");
    return;
  }

  try {
    await sendPasswordResetEmail(auth, formData.email);
     setResetMessage("Linku për resetim u dërgua! Kontrolloni email-in (Inbox ose Spam).");
     setError('')
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
        setError('Ky email nuk është i regjistruar.')
    } else {
        setError("Diqka nuk shkoj mirë")
    }
  }

  }

  return (
    <div className={styles.loginWrap}>
      <div className={styles.card}>
        <h1 className={styles.title}>Hyr në llogari (Si Mjeshter)</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label} htmlFor="email">
            Email
          </label>
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

          <label className={styles.label} htmlFor="password">
            Fjalëkalimi
          </label>
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

          <div className={styles.forgotDiv}>
            <p>Ke harruar Fjalëkalimin?</p>
            <button type="button" onClick={handleResetPassword}>Reseto</button>
          </div>
          
          <div className={styles.loginDiv}>
            <p>Nuk ke Llogari?</p>
            <Link to='/register'>Krijo</Link>
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}
          {resetMessage && <div className={styles.successMessage}>{resetMessage}</div>}
   
          <button type="submit" className={styles.submitButton} disabled={isPending}>
            Hyr
          </button>
        </form>
      </div>
    </div>
  );
}


export default Login;
