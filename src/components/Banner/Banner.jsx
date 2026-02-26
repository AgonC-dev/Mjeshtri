import styles from './Banner.module.css';
import Worker1 from '../../assets/image1.png';
import Worker2 from '../../assets/image2.png';
import Worker3 from '../../assets/image3.png';
import Chat from '../../assets/chat.png';
import Star from '../../assets/star.png';

export default function Banner() {
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Zgjidhja e duhur për çdo shtëpi.</h2>
            
            <div className={styles.blockCon}>
                {/* STEP 1: FIND/QUALITY */}
                <div className={styles.cardWrapper}>
                    <div className={`${styles.visualBlock} ${styles.bgGray}`}>
                        <div className={styles.animationArea}>
                            <img src={Worker1} className={styles.worker1} alt='worker' />
                            <img src={Worker2} className={styles.worker2} alt='worker' />
                            <img src={Worker3} className={styles.worker3} alt='worker' />
                            <img src={Worker1} className={styles.worker4} alt='worker' />
                            <img src={Worker2} className={styles.worker5} alt='worker' />
                        </div>
                    </div>
                    <h3 className={styles.title2}>Gjej mjeshtrin që të përshtatet</h3>
                    <p className={styles.subtitle}>
                        Nga instalimet elektrike te lyerja e mureve, ne ju lidhim me profesionistët më të mirë të zonës suaj.
                    </p>
                </div>

                {/* STEP 2: EXPERIENCE */}
                <div className={styles.cardWrapper}>
                    
                      <div className={`${styles.visualBlock} ${styles.bgLightBlue}`}>
                        <div className={styles.animationArea}>
                            {[...Array(5)].map((_, i) => (
                                <img 
                                    key={i} 
                                    src={Star} 
                                    className={`${styles.star} ${styles[`star${i + 1}`]}`} 
                                    alt='star icon' 
                                />
                            ))}
                        </div>
                    </div>
                    <h3 className={styles.title2}>Shiko eksperiencën</h3>
                    <p className={styles.subtitle}>
                        Eksploro profilat e mjeshtërve (Ustahëve) dhe zgjidh atë që ka vlerësimet më të larta nga komuniteti.
                    </p>
                </div>

                {/* STEP 3: CHAT */}
                <div className={styles.cardWrapper}>
                    <div className={`${styles.visualBlock} ${styles.bgAction}`}>
                        <img src={Chat} className={styles.chatImg} alt='chat ui' />
                    </div>
                    <h3 className={styles.title2}>Kontakto direkt</h3>
                    <p className={styles.subtitle}>
                        Pa ndërmjetës dhe pa vonesa. Bisedo detajet e punës dhe cakto terminin me një klikim në WhatsApp.
                    </p>
                </div>
            </div>
        </div>
    );
}