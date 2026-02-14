import styles from './Banner.module.css';
import Worker1 from '../../assets/image1.png';
import Worker2 from '../../assets/image2.png';
import Worker3 from '../../assets/image3.png';
import Chat from '../../assets/chat.png';
import Star from '../../assets/star.png';



export default function Banner() {
    return (
        <div className={styles.container}>
            <p className={styles.title}>Zgjidhja e duhur për çdo shtëpi.</p>
            <div className={styles.blockCon}>
                <div className={styles.firstCon}>
                 <div className={styles.block1}>
                   <img src={Worker1} className={styles.worker1} alt='worker avatar' />
                   <img src={Worker2} className={styles.worker2} alt='worker avatar' />
                   <img src={Worker3} className={styles.worker3} alt='worker avatar' />
                   <img src={Worker3} className={styles.worker4} alt='worker avatar' />
                    <img src={Worker3} className={styles.worker5} alt='worker avatar' />
                 </div>
                 <p className={styles.title2}>Shiko eksperiencen</p>
                 <p className={styles.subtitle}>Eksploro profilat e mjeshtërve më të mirë në zonën tënde dhe zgjidh atë që plotëson kërkesat e tua.</p>
                </div>
                <div className={styles.secondCon}>
                 <div className={styles.block2}>
                   <img src={Star} className={styles.star1} alt='worker avatar' />
                   <img src={Star} className={styles.star2} alt='worker avatar' />
                   <img src={Star} className={styles.star3} alt='worker avatar' />
                   <img src={Star} className={styles.star4} alt='worker avatar' />
                   <img src={Star} className={styles.star5} alt='worker avatar' />
                 </div>
                 <p className={styles.title2}>Gjej mjeshtrin që të përshtatet</p>
                  <p className={styles.subtitle}>Nga instalimet elektrike te lyerja e mureve, ne ju lidhim me profesionistët më të mirë të zonës suaj.</p>
                </div>
                <div className={styles.thirdCon}>
                <div className={styles.block3}>
                   <img src={Chat} className={styles.chat} alt='chat' />
                 </div>
                 <p className={styles.title2}>Kontakto në WhatsApp</p>
                  <p className={styles.subtitle}>Pa ndërmjetës dhe pa vonesa. Bisedo detajet e punës dhe cakto terminin me një klikim.</p>
                </div>
            </div>
        </div>
    )
}