import { useState, useRef, useEffect } from "react";
import { auth } from "../api/firebase";
import { 
  multiFactor, 
  PhoneAuthProvider, 
  PhoneMultiFactorGenerator, 
  RecaptchaVerifier 
} from "firebase/auth";

function AdminEnroll() {
  const [phone, setPhone] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  const [smsCode, setSmsCode] = useState("");
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  const recaptchaRef = useRef(null);

  useEffect(() => {
    // Initialize reCAPTCHA on mount
    if (!recaptchaRef.current) {
      recaptchaRef.current = new RecaptchaVerifier(auth, "recaptcha-enroll-container", {
        size: "invisible",
      });
    }
    return () => {
      if (recaptchaRef.current) {
        recaptchaRef.current.clear();
        recaptchaRef.current = null;
      }
    };
  }, []);

  const sendSms = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Ju lutem hyni në llogari fillimisht!");

      // 1. Refresh the user's token to avoid 'expired-token' errors
      await user.reload();
      
      // 2. Start MFA Session
      const session = await multiFactor(user).getSession();
      
      // 3. Setup Phone Provider
      const phoneAuthProvider = new PhoneAuthProvider(auth);
      const vId = await phoneAuthProvider.verifyPhoneNumber(
        { phoneNumber: phone.replace(/\s+/g, ''), session },
        recaptchaRef.current
      );
      
      setVerificationId(vId);
      setStep(2);
      alert("Kodi u dërgua (Nëse po përdorni numër testues, kodi është ai që keni vendosur në Console)");
    } catch (err) {
      console.error("MFA Enrollment Error:", err);
      alert("Gabim: " + err.message);
      // Reset reCAPTCHA if it fails
      if (window.grecaptcha) window.grecaptcha.reset();
    } finally {
      setLoading(false);
    }
  };

  const finishEnrollment = async () => {
    try {
      const user = auth.currentUser;
      const cred = PhoneAuthProvider.credential(verificationId, smsCode);
      const assertion = PhoneMultiFactorGenerator.assertion(cred);
      
      await multiFactor(user).enroll(assertion, "Admin Phone");
      alert("SUKSES! Llogaria juaj tani mbrohet me 2FA.");
    } catch (err) {
      console.error("Final Enrollment Error:", err);
      alert("Kodi i pasaktë!");
    }
  };

  return (
    <div style={{ padding: "50px", textAlign: "center", fontFamily: "sans-serif" }}>
      <h2>Security: Admin Enrollment</h2>
      <div id="recaptcha-enroll-container"></div>

      {step === 1 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "320px", margin: "0 auto" }}>
          <input 
            type="text" 
            placeholder="+38345777888" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            style={{ padding: "12px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
          <button 
            onClick={sendSms} 
            disabled={loading}
            style={{ padding: "12px", backgroundColor: "#007bff", color: "white", border: "none", cursor: "pointer" }}
          >
            {loading ? "Duke u procesuar..." : "Dërgo Kodin"}
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "320px", margin: "0 auto" }}>
          <input 
            type="text" 
            placeholder="Shkruaj kodin 6-shifror" 
            value={smsCode} 
            onChange={(e) => setSmsCode(e.target.value)} 
            style={{ padding: "12px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
          <button 
            onClick={finishEnrollment} 
            style={{ padding: "12px", backgroundColor: "#28a745", color: "white", border: "none", cursor: "pointer" }}
          >
            Verifiko & Aktivizo
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminEnroll;