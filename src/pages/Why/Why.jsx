import styles from "./Why.module.css";
import Logo from '../../assets/Logo2.png'
import { Link } from "react-router-dom";

export default function WhyGjejnjerin() {
  return (
    <main className={styles.page}>
      {/* HEADER */}
      {/* <header className={styles.header}>
        <Link to="/" className={styles.logo}>
          <img
            src={Logo}
            alt="Gjejnjerin"
            className={styles.logoImage}
          />
        </Link>

        <Link to="/register" className={styles.headerButton}>
          Regjistrohu
        </Link>
      </header> */}

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <span className={styles.badge}>
            🇽🇰 Për profesionistët në Kosovë
          </span>

          <h1 className={styles.heroTitle}>
            Bëje punën tënde
            <span> më të lehtë për t'u gjetur.</span>
          </h1>

          <p className={styles.heroText}>
            Gjejnjerin lidh profesionistët me njerëzit që po
            kërkojnë shërbimet e tyre.
          </p>

          <div className={styles.heroActions}>
            <Link to="/register" className={styles.primaryButton}>
              Regjistrohu falas
              <span>→</span>
            </Link>

            <a href="#how-it-works" className={styles.secondaryButton}>
              Si funksionon?
            </a>
          </div>

          <p className={styles.heroNote}>
            ✓ Krijo profilin tënd &nbsp; ✓ Prezanto punën &nbsp; ✓ Gjej klientë
          </p>
        </div>
      </section>

      {/* WHAT IS GJEJNJERIN */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>
              GJEJNJERIN
            </span>

            <h2>
              Çka është Gjejnjerin?
            </h2>

            <p>
              Një platformë ku njerëzit mund të gjejnë profesionistët
              që u nevojiten, ndërsa ti mund të prezantosh shërbimet
              dhe punën tënde.
            </p>
          </div>

          <div className={styles.featureGrid}>
            <article className={styles.featureCard}>
              <div className={styles.featureIcon}>
                🔎
              </div>

              <h3>Gjej klientë</h3>

              <p>
                Bëhu i dukshëm për njerëzit që janë duke kërkuar
                shërbimet që ti ofron.
              </p>
            </article>

            <article className={styles.featureCard}>
              <div className={styles.featureIcon}>
                👤
              </div>

              <h3>Profili yt</h3>

              <p>
                Krijo një profil profesional ku mund të tregosh
                kush je dhe çfarë pune bën.
              </p>
            </article>

            <article className={styles.featureCard}>
              <div className={styles.featureIcon}>
                ⭐
              </div>

              <h3>Ndërto besim</h3>

              <p>
                Shfaq punët, eksperiencën dhe vlerësimet e tua
                për t'u bërë më i besueshëm.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className={`${styles.section} ${styles.howSection}`}
      >
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>
              SI FUNKSIONON
            </span>

            <h2>
              Katër hapa. Kaç.
            </h2>

            <p>
              Nga krijimi i profilit deri te kontakti me klientin.
            </p>
          </div>

          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>01</div>

              <div>
                <h3>Krijo profilin</h3>

                <p>
                  Regjistrohu falas dhe shto informacionet për
                  veten dhe shërbimet që ofron.
                </p>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>02</div>

              <div>
                <h3>Prezanto punën</h3>

                <p>
                  Shto foto, përshkrime, eksperiencën dhe çdo
                  informacion që tregon çfarë di të bësh.
                </p>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>03</div>

              <div>
                <h3>Bëhu i gjetshëm</h3>

                <p>
                  Njerëzit që kërkojnë një profesionist mund
                  të gjejnë profilin tënd.
                </p>
              </div>
            </div>

            <div className={styles.step}>
              <div className={styles.stepNumber}>04</div>

              <div>
                <h3>Kontakto klientët</h3>

                <p>
                  Kur një klient është i interesuar, mund të
                  kontaktojë direkt me ty.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY JOIN */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>
              PSE TË BASHKOHESH?
            </span>

            <h2>
              Puna jote meriton të shihet.
            </h2>

            <p>
              Mos u mbështet vetëm në rekomandime nga një person
              te tjetri. Krijo vendin tënd online ku klientët
              mund të të gjejnë.
            </p>
          </div>

          <div className={styles.reasonsGrid}>
            <div className={styles.reason}>
              <div className={styles.check}>✓</div>

              <div>
                <h3>Prezencë profesionale</h3>

                <p>
                  Krijo një profil që tregon qartë çfarë ofron.
                </p>
              </div>
            </div>

            <div className={styles.reason}>
              <div className={styles.check}>✓</div>

              <div>
                <h3>Më shumë mundësi</h3>

                <p>
                  Bëhu i dukshëm për njerëz që po kërkojnë
                  profesionistë.
                </p>
              </div>
            </div>

            <div className={styles.reason}>
              <div className={styles.check}>✓</div>

              <div>
                <h3>Kontakt direkt</h3>

                <p>
                  Klientët mund të shohin profilin tënd dhe
                  të lidhen me ty.
                </p>
              </div>
            </div>

            <div className={styles.reason}>
              <div className={styles.check}>✓</div>

              <div>
                <h3>Fillo falas</h3>

                <p>
                  Krijo profilin tënd dhe fillo pa pagesë.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHO IS IT FOR */}
      <section className={styles.categoriesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>
              PËR KË ËSHTË?
            </span>

            <h2>
              Nëse ke një aftësi, ka vend për ty.
            </h2>

            <p>
              Nga zanatet tradicionale deri te shërbimet moderne.
            </p>
          </div>

          <div className={styles.categories}>
            <div className={styles.category}>⚡ Elektricistë</div>
            <div className={styles.category}>🔧 Hidraulikë</div>
            <div className={styles.category}>🧱 Ndërtues</div>
            <div className={styles.category}>🎨 Piktorë</div>
            <div className={styles.category}>🚗 Mekanikë</div>
            <div className={styles.category}>💻 IT & Teknologji</div>
            <div className={styles.category}>🏠 Pastrues</div>
            <div className={styles.category}>✂️ Berberë</div>
            <div className={styles.category}>📸 Fotografë</div>
            <div className={styles.category}>🔨 Montues</div>
            <div className={styles.category}>🌳 Kopshtarë</div>
            <div className={styles.category}>➕ Dhe shumë të tjerë</div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <span className={styles.ctaLabel}>
            FILLIMI ËSHTË FALAS
          </span>

          <h2>
            Gati që klientët të të gjejnë?
          </h2>

          <p>
            Krijo profilin tënd në Gjejnjerin dhe fillo të
            prezantosh shërbimet e tua sot.
          </p>

          <Link to="/register" className={styles.ctaButton}>
            Krijo profilin falas
            <span>→</span>
          </Link>

          <small>
            Regjistrimi zgjat vetëm disa minuta.
          </small>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <Link to="/" className={styles.footerLogo}>
          <img
            src={Logo}
            alt="Gjejnjerin"
            className={styles.footerLogoImage}
          />
        </Link>

        <p>
          Gjej njerin që të duhet.
        </p>

        <div className={styles.footerLinks}>
          <Link href="/">Ballina</Link>
          <Link href="/register">Regjistrohu</Link>
          <Link href="/login">Kyçu</Link>
        </div>

        <p className={styles.copyright}>
          © {new Date().getFullYear()} Gjejnjerin.
          Të gjitha të drejtat e rezervuara.
        </p>
      </footer>
    </main>
  );
}