import { Link, NavLink } from 'react-router-dom'; // Added NavLink for active states
import { useState, useEffect, useRef } from 'react';
import styles from './Header.module.css';
import { auth, db } from '../../api/firebase'; 
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Logo from '../../assets/Logo.png';
import Search from '../../assets/Search.png';
import Modal from '../Modal/Modal';
import { CheckCircle2 } from "lucide-react";
import { Home, Search as SearchIcon, Flame, LayoutDashboard, User } from 'lucide-react';

const ADMIN_UID = "KMQyw2VBhUbzjKWPbV3A0ntO6Ho2";

function Header() {
  
  
  const menuRef = useRef();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [showDropDown, setShowDropDown] = useState(false);
  const [ sure, setSure] = useState(false);
  const [favCount, setFavCount] = useState(0);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favoritesList, setFavoritesList] = useState([]);

  // Load Favorites from LocalStorage
  const loadFavorites = () => {
    const saved = JSON.parse(localStorage.getItem("mjeshtri_favs") || "[]");
    setFavoritesList(saved);
    setFavCount(saved.length);
  };

  useEffect(() => {
    loadFavorites();
    const handleUpdate = () => loadFavorites();

    window.addEventListener('storage', handleUpdate);
    // Custom event for same-tab updates
    window.addEventListener('favoritesUpdated', handleUpdate);
    
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('favoritesUpdated', handleUpdate);
    };
  }, []);

  const removeFavorite = (id) => {
    const updated = favoritesList.filter(item => item.id !== id);
    localStorage.setItem("mjeshtri_favs", JSON.stringify(updated));
    // Dispatch event so the badge updates immediately
    window.dispatchEvent(new Event('favoritesUpdated'));
    setFavoritesList(updated);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const docRef = doc(db, "workers", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } else {
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, []);


  useEffect(() => {
    const handleOutsideClick = (e) => {
     if (menuRef.current && !menuRef.current.contains(e.target)) {
      setShowDropDown(false)
     }
    }

    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
      
  }, [])

const calculateProfileStrength = () => {
  if (!userData) return 0;

  // 1. Critical Fields
  const essentials = ['fullName', 'category', 'city', 'phoneNumber'];
  const hasEssentials = essentials.every(field => 
    userData[field] !== undefined && 
    userData[field] !== null && 
    userData[field].toString().trim() !== ""
  );

  if (!hasEssentials) return -1; 

  // 2. Base score (Starting point)
  let score = 30; // Reduced base to make room for bigger 'Trust' bonuses
  
  // 3. Optional "Trust" fields math
  
  // Profile Picture (+10)
  if (userData.profilePic && !userData.profilePic.includes('avatars')) {
    score += 10;
  }
  
  // Bio (+10)
  if (userData.bio && userData.bio.trim().length > 20) {
    score += 10;
  }
  
  // Experience Years (+10) - Use check for null/undefined so '0' is valid
  if (userData.experienceYears !== undefined && userData.experienceYears !== null && userData.experienceYears !== "") {
    score += 10;
  }
  
  // Starting Price (+10) - Use check for null/undefined so '0' is valid
  if (userData.startingPrice !== undefined && userData.startingPrice !== null && userData.startingPrice !== "") {
    score += 10;
  }
  
  // Portfolio (+10)
  if (userData.portfolio && userData.portfolio.length > 0) {
    score += 10;
  }

  // Verification (+20) - You wanted this to have more weight
  if (userData.isVerified) {
    score += 20;
  }

  return Math.min(score, 100);
};



const getStrengthColor = (strength) => {
  if (strength === -1) return "#ef4444"; // Red for critical/suspended
  if (strength < 70) return "#f97316";   // Orange for "Just the basics"
  if (strength < 90) return "#eab308";   // Yellow/Gold for "Almost there"
  return "#10b981";                      // Emerald Green for "Complete"
};

const profileStrength = calculateProfileStrength();

return (
  <>
    <header className={styles.header}>
      {/* This container ensures the logo and nav links align with the page body */}
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <img src={Logo} alt="Page Logo" />
        </Link>

        {/* This Nav is hidden on mobile via the CSS Media Queries we set */}
        <nav className={styles.nav}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            Kryefaqja
          </NavLink>

          <NavLink
            to="/workers"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            Kërko Punëtorin
          </NavLink>

          <NavLink
            to="/wanted"
            className={({ isActive }) =>
              isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
            }
          >
            Më të kërkuarit
          </NavLink>
        </nav>

        <div className={styles.right}>
          {user && user.uid === ADMIN_UID && (
            <Link to="/admin" className={styles.adminLink}>
              ⚙️ <span>Paneli Admin</span>
            </Link>
          )}

          {user ? (
            <div className={styles.profileWrapper}>
              <div
                className={styles.profileCircle}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDropDown(!showDropDown);
                }}
              >
                <img
                  src={userData?.profilePic || "https://via.placeholder.com/40"}
                  alt="Profile"
                  className={styles.avatar}
                />
              </div>

              {showDropDown && (
                <div className={styles.dropdown} ref={menuRef}>
                  <div className={styles.dropdownHeader}>
                    <div className={styles.headerTop}>
                      <p className={styles.userName}>
                        {userData?.fullName || "Mjeshtër"}
                        {userData?.isVerified && (
                          <CheckCircle2
                            size={20}
                            className={styles.verifiedBadge}
                            fill="#0095f6"
                            color="#fff"
                          />
                        )}
                      </p>
                      {userData?.isPro && (
                        <span className={styles.proBadgeMenu}>PRO</span>
                      )}
                    </div>
                    <p className={styles.userEmail}>{user.email}</p>
                  </div>

                  <div className={styles.strengthField}>
                    {profileStrength === -1 ? (
                      <div className={styles.criticalWarning}>
                        <div className={styles.warningHeader}>
                          <span>⚠️ Profili i Pezulluar</span>
                        </div>
                        <p className={styles.warningText}>
                          Mungon kategoria, emri ose qyteti. Klientët nuk mund
                          t'ju gjejnë!
                        </p>
                        <Link
                          to="/dashboard"
                          className={styles.fixLink}
                          onClick={() => setShowDropDown(false)}
                        >
                          Rregullo tani
                        </Link>
                      </div>
                    ) : (
                      <>
                        <div className={styles.strengthLabelRow}>
                          <span>Fuqia e Profilit</span>
                          <span
                            style={{
                              color: getStrengthColor(profileStrength),
                              fontWeight: "700",
                            }}
                          >
                            {profileStrength}%
                          </span>
                        </div>

                        <div className={styles.progressBar}>
                          <div
                            className={styles.progressFill}
                            style={{
                              width: `${profileStrength}%`,
                              backgroundColor: getStrengthColor(profileStrength),
                            }}
                          />
                        </div>

                        <p className={styles.strengthHint}>
                          {profileStrength === 100
                            ? "✨ Profili juaj është i kompletuar!"
                            : profileStrength === -1
                            ? "🚫 Profili juaj është i pezulluar. Plotësoni Emrin, Qytetin dhe Telefonin për t'u aktivizuar."
                            : !userData?.profilePic ||
                              userData?.profilePic.includes("placeholder")
                            ? "💡 Shto një foto profili për më shumë besueshmëri."
                            : !userData?.bio ||
                              userData?.bio.trim().length <= 20
                            ? "✍️ Shkruaj një përshkrim më të gjatë (+20 shkronja) rreth punës sate."
                            : userData?.experienceYears === undefined ||
                              userData?.experienceYears === null ||
                              userData?.experienceYears === ""
                            ? "⏳ Shto vitet e përvojës për të treguar profesionalizmin."
                            : userData?.startingPrice === undefined ||
                              userData?.startingPrice === null ||
                              userData?.startingPrice === ""
                            ? "💰 Shto një çmim fillestar (ose 0 për me marrëveshje)."
                            : !userData?.portfolio ||
                              userData?.portfolio.length === 0
                            ? "🖼️ Shto punime në portfolio për të bindur klientët."
                            : !userData?.isVerified
                            ? "🛡️ Verifiko profilin me ID për të fituar besim maksimal dhe distinktivin e verifikimit."
                            : "🚀 Pothuajse gati!"}
                        </p>
                      </>
                    )}
                  </div>

                  <div className={styles.visibilityField}>
                    <div className={styles.statusIndicator}>
                      <span
                        className={
                          userData?.isAvailable
                            ? styles.dotGreen
                            : styles.dotGrey
                        }
                      />
                      {userData?.isAvailable
                        ? "Aktiv & Online"
                        : "I fshehur (Pushim)"}
                    </div>
                  </div>

                  <hr className={styles.divider} />

                  <Link
                    to="/dashboard"
                    className={styles.dropdownItem}
                    onClick={() => setShowDropDown(false)}
                  >
                    <span className={styles.icon}>📊</span>
                    Paneli i Punës
                  </Link>

                  <Link
                    to="/profile"
                    className={styles.dropdownItem}
                    onClick={() => setShowDropDown(false)}
                  >
                    <span className={styles.icon}>👤</span>
                    Profili Publik
                  </Link>

                  <Link
                    to="/settings"
                    className={styles.dropdownItem}
                    onClick={() => setShowDropDown(false)}
                  >
                    <span className={styles.icon}>⚙️</span>
                    Cilësimet
                  </Link>

                  <hr className={styles.divider} />

                  {!userData?.isPro && (
                    <Link
                      to="/dashboard"
                      className={styles.upgradePrompt}
                      onClick={() => setShowDropDown(false)}
                    >
                      🚀 Përmirëso rënditjen (PRO)
                    </Link>
                  )}

                  <Link
                    to="/help"
                    className={styles.dropdownItem}
                    onClick={() => setShowDropDown(false)}
                  >
                    <span className={styles.icon}>💡</span>
                    Ndihmë & FAQ
                  </Link>

                  <hr className={styles.divider} />

                  <button
                    onClick={() => {
                      auth.signOut();
                      setShowDropDown(false);
                    }}
                    className={styles.logoutButton}
                  >
                    <span className={styles.icon}>🚪</span>
                    Dil nga llogaria
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                className={styles.favoritesTrigger}
                onClick={() => setShowFavorites(true)}
              >
                <span className={styles.heartIcon}>❤️</span>
                {favCount > 0 && (
                  <span className={styles.favBadge}>{favCount}</span>
                )}
              </button>

              <Modal
                open={showFavorites}
                onClose={() => setShowFavorites(false)}
              >
                <div className={styles.favModalContainer}>
                  <button
                    className={styles.modalCloseBtn}
                    onClick={() => setShowFavorites(false)}
                  >
                    ✕
                  </button>
                  <div className={styles.favHeader}>
                    <h2>Mjeshtrit e Ruajtur</h2>
                    <p>Koleksioni juaj i profesionistëve të preferuar</p>
                  </div>
                  <div className={styles.favList}>
                    {favoritesList.length > 0 ? (
                      <>
                        {favoritesList.map((worker, index) => (
                          <div
                            key={worker.id}
                            className={styles.favItem}
                            style={{ animationDelay: `${index * 0.05}s` }}
                          >
                            <img
                              src={
                                worker.profilePic ||
                                "https://via.placeholder.com/40"
                              }
                              className={styles.favAvatar}
                              alt=""
                            />
                            <div className={styles.favMainInfo}>
                              <h4>{worker.fullName}</h4>
                              <span className={styles.favTag}>
                                {worker.category}
                              </span>
                              <p className={styles.favLocation}>
                                📍 {worker.city}
                              </p>
                            </div>
                            <div className={styles.favActions}>
                              <a
                                href={`tel:${worker.phoneNum}`}
                                className={styles.favCallBtn}
                                title="Telefono"
                              >
                                📞 <span>Thirr</span>
                              </a>
                              <Link
                                to={`/worker/${worker.id}`}
                                className={styles.favViewBtn}
                                onClick={() => setShowFavorites(false)}
                              >
                                Profili
                              </Link>
                              <button
                                className={styles.favRemoveBtn}
                                onClick={() => removeFavorite(worker.id)}
                                title="Hiqe"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        ))}
                        <div className={styles.favFooter}>
                          <button
                            className={styles.clearAllLink}
                            onClick={() => setSure(true)}
                          >
                            Fshij të gjithë listën
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className={styles.emptyState}>
                        <div className={styles.emptyIllustration}>❤️</div>
                        <h3>Lista është boshe</h3>
                        <p>Nuk keni ruajtur asnjë mjeshtër ende.</p>
                        <button
                          className={styles.browseBtn}
                          onClick={() => setShowFavorites(false)}
                        >
                          Shfletoni Mjeshtrit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </Modal>

              <Modal open={sure} onClose={() => setSure(false)}>
                <div className={styles.confirmModal}>
                  <div className={styles.confirmIcon}>⚠️</div>
                  <p>
                    A jeni i sigurt që dëshironi të fshini të gjithë listën e të
                    preferuarve?
                  </p>
                  <div className={styles.confirmActions}>
                    <button
                      className={styles.confirmYes}
                      onClick={() => {
                        localStorage.removeItem("mjeshtri_favs");
                        window.dispatchEvent(new Event("favoritesUpdated"));
                        setFavoritesList([]);
                        setSure(false);
                      }}
                    >
                      Po, fshije
                    </button>
                    <button
                      className={styles.confirmNo}
                      onClick={() => setSure(false)}
                    >
                      Jo, anulo
                    </button>
                  </div>
                </div>
              </Modal>

              <Link to="/workers" className={styles.searchIcon}>
                <img src={Search} alt="search icon" />
              </Link>

              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive
                    ? `${styles.navLinkLogIn} ${styles.logActive}`
                    : styles.navLinkLogIn
                }
              >
                Kyqu si mjeshtër
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>

    {/* MOBILE BOTTOM MENU - Only visible via CSS Media Queries */}

<nav className={styles.mobileBottomNav}>
  <NavLink
    to="/"
    className={({ isActive }) =>
      isActive ? `${styles.mobileTab} ${styles.activeTab}` : styles.mobileTab
    }
  >
    <Home size={22} className={styles.tabIcon} />
    <span>Kryefaqja</span>
  </NavLink>

  <NavLink
    to="/workers"
    className={({ isActive }) =>
      isActive ? `${styles.mobileTab} ${styles.activeTab}` : styles.mobileTab
    }
  >
    <SearchIcon size={22} className={styles.tabIcon} />
    <span>Kërko</span>
  </NavLink>

  <NavLink
    to="/wanted"
    className={({ isActive }) =>
      isActive ? `${styles.mobileTab} ${styles.activeTab}` : styles.mobileTab
    }
  >
    <Flame size={22} className={styles.tabIcon} />
    <span>Popullore</span>
  </NavLink>

  <NavLink
    to={user ? "/dashboard" : "/login"}
    className={({ isActive }) =>
      isActive ? `${styles.mobileTab} ${styles.activeTab}` : styles.mobileTab
    }
  >
    {user ? (
      <LayoutDashboard size={22} className={styles.tabIcon} />
    ) : (
      <User size={22} className={styles.tabIcon} />
    )}
    <span>{user ? "Paneli" : "Kyqu"}</span>
  </NavLink>
</nav>
  </>
);
}



export default Header;