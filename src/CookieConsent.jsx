import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./CookieConsent.module.css";

const LOCALSTORAGE_KEY = "cookie-consent";

export default function CookieConsent({ onAccept }) {
  const [consent, setConsent] = useState(null); // null | "accepted" | "declined"
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(LOCALSTORAGE_KEY);
    if (saved === "accepted" || saved === "declined") {
      setConsent(saved);
    }
    setLoaded(true);
  }, []);

  function handleAccept() {
    localStorage.setItem(LOCALSTORAGE_KEY, "accepted");
    setConsent("accepted");
    onAccept?.();
  }

  function handleDecline() {
    localStorage.setItem(LOCALSTORAGE_KEY, "declined");
    setConsent("declined");
  }

  if (!loaded || consent !== null) return null;

 

return (
  <div className={styles.banner} role="dialog" aria-label="Pëlqimi për cookies">
    <div className={styles.content}>
      <h2 className={styles.title}>Ne e vlerësojmë privatësinë tuaj</h2>
      <p className={styles.text}>
        Ne përdorim cookies për të kuptuar se si e përdorin vizitorët faqen
        tonë përmes Google Analytics, në mënyrë që ta përmirësojmë atë. Këto
        cookies vendosen vetëm nëse i pranoni. Lexoni{" "}
        <Link to="/privacy" className={styles.link}>
          Politikën e Privatësisë
        </Link>
        .
      </p>
    </div>

    <div className={styles.actions}>
      <button
        className={`${styles.btn} ${styles.decline}`}
        onClick={handleDecline}
      >
        Refuzo
      </button>
      <button
        className={`${styles.btn} ${styles.accept}`}
        onClick={handleAccept}
      >
        Prano
      </button>
    </div>
  </div>
);
}