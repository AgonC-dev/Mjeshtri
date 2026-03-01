import React from "react";
import styles from "./Pro.module.css";

const StarIcon = () => (
  <div className={styles.proBadgeContainer} title="Anëtar PRO">
    <span className={styles.starIcon}>★</span>
  </div>
);

const Pro = ({ isPro, onUpgradeClick, form, handleChange, onStatus, link }) => {
  return (
    <div className={styles.wrapper}>
      {/* PRO SETTINGS CONTAINER */}
      <div className={styles.proSettings}>
        <div className={styles.cardHeader}>
          <h3>Settings PRO</h3>
        </div>

        <section className={styles.section}>
          <div className={styles.linkBox}>
            <label className={styles.title}>Linku juaj publik</label>
            <div className={styles.copyGroup}>
              <input readOnly value={link} />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(link);
                  onStatus({ message: "Linku u kopjua!", type: "success" });
                }}
              >
                Kopjo
              </button>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <p className={styles.title}>Cilësimet e Profilit PRO</p>
          <ul className={styles.settingsList}>
            <li>
              <span>Në faqen kryesore të Gjejmjeshtrin</span>
              <label className={styles.switch}>
                <input 
                  type="checkbox" 
                  checked={form.isFeatured} 
                  onChange={(e) => handleChange('isFeatured', e.target.checked)} 
                  disabled={!form.isAvailable}
                />
                <span className={styles.slider}></span>
              </label>
            </li>

            <li>
              <span>Aktivizo distinktivin "Reagim i shpejtë"</span>
              <label className={styles.switch}>
                <input 
                  type="checkbox" 
                  checked={form.quickResponse || false} 
                  onChange={(e) => handleChange('quickResponse', e.target.checked)} 
                />
                <span className={styles.slider}></span>
              </label>
            </li>

            <li>
              <span className={styles.starPro}>Shfaq PRO <StarIcon /> në profil</span>
              <label className={styles.switch}>
                <input 
                  type="checkbox" 
                  checked={form.showProStar} 
                  onChange={(e) => handleChange('showProStar', e.target.checked)} 
                />
                <span className={styles.slider}></span>
              </label>
            </li>
          </ul>
        </section>

        <section className={styles.analyticsSection}>
          <div className={styles.analyticsHeader}>
            <div className={styles.headerTitle}>
              <h4>Paneli i Performancës</h4>
              <p>Statistikat tuaja PRO</p>
            </div>
            <div className={styles.pulseContainer}>
              <span className={styles.pulseDot}></span>
              <span className={styles.liveText}>LIVE DATA</span>
            </div>
          </div>

          <div className={styles.visualTable}>
            {/* Row 1: WhatsApp Clicks */}
            <div className={`${styles.tableRow} ${styles.blueRow}`}>
              <div className={styles.rowInfo}>
                <div className={styles.iconBox}>📊</div>
                <div className={styles.rowText}>
                  <strong>Interesimi total</strong>
                  <p>{form.whatsappRequests || 0} Klikime në WhatsApp</p>
                </div>
              </div>
              <div className={styles.rowChart}>
                <svg className={styles.sparkline} viewBox="0 0 100 30">
                  <path d="M0 25 Q 25 5, 50 20 T 100 5" fill="none" stroke="#4c6ef5" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Row 2: Average Rating */}
            <div className={`${styles.tableRow} ${styles.orangeRow}`}>
              <div className={styles.rowInfo}>
                <div className={styles.iconBox}>⭐</div>
                <div className={styles.rowText}>
                  <strong>Reputacioni</strong>
                  <p>{form.avgRating || "0"} Rating / {form.reviewCount || 0} Reviews</p>
                </div>
              </div>
              <div className={styles.rowChart}>
                <svg className={styles.sparkline} viewBox="0 0 100 30">
                  <path d="M0 20 L 20 10 L 40 25 L 60 5 L 80 15 L 100 10" fill="none" stroke="#fab005" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Row 3: Conversion Rate */}
            <div className={`${styles.tableRow} ${styles.greenRow}`}>
              <div className={styles.rowInfo}>
                <div className={styles.iconBox}>🎯</div>
                <div className={styles.rowText}>
                  <strong>Shkalla e Konvertimit</strong>
                  <p>Besueshmëria e profilit</p>
                </div>
              </div>
              <div className={styles.percentageValue}>
                {form.whatsappRequests > 0 
                  ? ((form.reviewCount / form.whatsappRequests) * 100).toFixed(1) 
                  : "0"}%
              </div>
            </div>

            {/* Row 4: Last Activity */}
            <div className={`${styles.tableRow} ${styles.purpleRow}`}>
              <div className={styles.rowInfo}>
                <div className={styles.iconBox}>🕒</div>
                <div className={styles.rowText}>
                  <strong>Aktiviteti i fundit</strong>
                  <p>Fundit: {form.lastReviewAt ? (form.lastReviewAt.toDate ? form.lastReviewAt.toDate().toLocaleDateString('sq-AL') : new Date(form.lastReviewAt).toLocaleDateString('sq-AL')) : "Asnjë vlerësim"}</p>
                </div>
              </div>
              <div className={styles.statusBadge}>
                {form.lastReviewAt ? "AKTIV" : "I RI"}
              </div>
            </div>
          </div>

          <div className={styles.proFooter}>
            <p>Këto të dhëna janë private dhe të dukshme vetëm për ju.</p>
          </div>
        </section>
      </div>

      {/* OVERLAY SECTION */}
      {!isPro && (
        <div className={styles.overlay}>
          <div className={styles.message}>
            <p>Bëhu PRO për të aktivizuar këtë seksion</p>
            <button 
              className={styles.upgradeBtn} 
              onClick={onUpgradeClick}
            >
              Bëhu PRO
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pro;