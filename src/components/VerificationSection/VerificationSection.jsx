import React, { useState } from 'react';
import styles from "./VerificationSection.module.css";
import verifiesBadge from '../../assets/verify.png';

export default function VerificationSection({
  isVerified,
  isPending,
  verificationFailed,
  status,
  idPreview,
  idFile,
  isVerifying,
  onIdSelect,
  onUpload,
  onRetake, // This function from Dashboard will now handle infinite resets
  setActiveTab
}) {

  const [isDragging, setIsDragging] = useState(false)
  
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation();
    if(e.type === "dragover") {
      setIsDragging(true)
    } else {
      setIsDragging(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation();
    setIsDragging(false)

    if(e.dataTransfer.files && e.dataTransfer.files[0] && e.dataTransfer.files.length > 0) {
     const droppedFiles = e.dataTransfer.files
     
      onIdSelect({ target: { files: droppedFiles } });
    }
  }
  // Determine if we are in the rejected state
  const isRejected = verificationFailed || (status.type === 'rejected' && status.message.includes("refuzua"));

  return (
    <div className={`${styles.verificationContainer} ${styles.animateFadeIn}`}>
      <header className={styles.topHeader}>
        <div className={styles.headerText}>
          <h1>Verifikimi i Identitetit</h1>
          <p>Siguria dhe besueshmëria janë prioritetet tona kryesore.</p>
        </div>
      </header>

      <section className={styles.glassCard}>
        <div className={styles.verificationUI}>
          
          {/* 1. SUCCESS STATE */}
          {isVerified ? (
            <div className={`${styles.successCard} ${styles.animatePop}`}>
              <div className={styles.bigCheckmark}>✅</div>
              <h2 className={styles.successTitle}>Profili u Verifikua!</h2>
              <p className={styles.statusDescription}>Urime! Tani gëzoni besueshmëri të plotë dhe prioritet në kërkime.</p>
              <button className={styles.primaryBtn} onClick={() => setActiveTab('main')}>
                Kthehu te Dashboard
              </button>
            </div>
          ) : isPending ? (
            
            /* 2. PENDING STATE */
            <div className={styles.pendingCard}>
              <div className={styles.bigClock}>⏳</div>
              <h2 className={styles.pendingTitle}>Duke u procesuar...</h2>
              <p className={styles.statusDescription}>Dokumenti juaj po rishikohet nga stafi ynë. Zakonisht zgjat 24-48 orë.</p>
              <div className={styles.loadingDots}><span></span><span></span><span></span></div>
              <button className={styles.secondaryBtn} onClick={() => setActiveTab('main')}>Dashboard</button>
              <div className={styles.excuseBlock}>
                <div className={styles.titleCon}>
                   <p className={styles.secondTitle}>Pse duhet ta bëj këtë?</p>
                   <img src={verifiesBadge} alt='verifiedbadge' />
                </div>
                <p className={styles.secondSubtitle}>Duke verifikuar identitetin, ju shtoni shansat për të fituar besimin e klientëve duke shfaqur ikonën ‘I verifikuar’ në profilin tënd. Informatat sensitive largohen nga databaza e platformës pasi që të verfikoheni nga ana jonë.</p>
              </div>
            </div>
            
          ) : isRejected ? (

            /* 3. ERROR / REJECTED STATE (STANDALONE) */
            <div className={`${styles.errorCard} ${styles.animateShake}`}>
              <div className={styles.bigErrorX}>❌</div>
              <h3 className={styles.errorTitle}>Verifikimi u Refuzua</h3>
              <p className={styles.errorText}>
                {status.message || "Dokumenti nuk i plotësonte kushtet (i paqartë ose i pavlefshëm). Ju lutem provoni përsëri."}
              </p>
              <button 
                className={styles.retryBtn} 
                onClick={onRetake} 
              >
                Provo përsëri
              </button>
              <p className={styles.supportTextSmall}>Ndihmë? support@mjeshtri.ks</p>
            </div>
          ) : (

            /* 4. INITIAL UPLOAD FORM */
            <div className={styles.uploadWrapper + " " + styles.animateFadeIn}>
              <div className={styles.idSection}>
                {idPreview ? (
                  <div className={styles.previewContainer}>
                    <div className={styles.imageFrame}>
                      <img src={idPreview} alt="ID Preview" className={styles.idImagePreview} />
                    </div>
                    <div className={styles.previewActions}>
                      <button className={styles.secondaryBtn} onClick={onRetake}>
                        🔄 Ndrysho foton
                      </button>
                       {idFile && (
                          <button className={styles.btnSaveAction} onClick={onUpload} disabled={isVerifying}>
                            {isVerifying ? "Duke u dërguar..." : "Dërgo Dokumentin"}
                           </button>
                    )}
                    </div>
                  </div>
                ) : (
                 <label 
                    htmlFor="id-upload" 
                    className={`${styles.idPlaceholder} ${isDragging ? styles.dragActive : ""}`}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                 >
                 <div className={styles.pulseIcon}>{isDragging ? "📥" : "🪪"}</div>
                   <p>{isDragging ? "Lëshoje këtu..." : "Kliko ose Tërhiq Letërnjoftimin"}</p>
                   <input type="file" id="id-upload" hidden onChange={onIdSelect} accept="image/*" />
                 </label>
                )}
              </div>
              

              <div className={styles.excuseBlock}>
                <div className={styles.titleCon}>
                   <p className={styles.secondTitle}>Pse duhet ta bëj këtë?</p>
                   <img src={verifiesBadge} alt='verifiedbadge' />
                </div>
                <p className={styles.secondSubtitle}>Duke verifikuar identitetin, ju shtoni shansat për të fituar besimin e klientëve duke shfaqur ikonën ‘I verifikuar’ në profilin tënd. Informatat sensitive largohen nga databaza e platformës pasi që të verfikoheni nga ana jonë.</p>
              </div>

             
            </div>
          )}
        </div>
      </section>
    </div>
  );
}