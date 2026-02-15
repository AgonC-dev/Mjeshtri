import { Link, NavLink } from 'react-router-dom'; // Added NavLink for active states
import { useState, useEffect, useRef } from 'react';
import styles from './Header.module.css';
import { auth, db } from '../../api/firebase'; 
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Logo from '../../assets/Logo.png';
import Search from '../../assets/Search.png';


function Header() {
  
  const menuRef = useRef();
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [showDropDown, setShowDropDown] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

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
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
     if (menuRef.current && !menuRef.current.contains(e.target)) {
      setShowDropDown(false)
     }
    }

    document.addEventListener("mousedown", handleOutsideClick)
    return () => document.removeEventListener("mousedown", handleOutsideClick)
      
  }, [])

  return (
    <header className={styles.header}>
      {/* This container ensures the logo and nav links align with the page body */}
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <img src={Logo} alt='Page Logo' />
        </Link>

        <nav className={styles.nav}>
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
          >
            Kryefaqja
          </NavLink>
           <NavLink 
            to="/workers" 
            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
          >
            Kërko Punëtorin
          </NavLink>
           <NavLink 
            to="/about" 
            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
          >
            Më të kërkuarit
          </NavLink>

          {/* <button onClick={toggleTheme} className={styles.themeToggle}>
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button> */}
        </nav>
        <div className={styles.right}>
             {user ? (
            <div className={styles.profileWrapper}>
              <div 
                className={styles.profileCircle} 
                 onClick={(e) => {
                  e.stopPropagation(); // Prevents the window from seeing this specific click
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
         <p className={styles.userName}>{userData?.fullName || "Mjeshtër"}</p>
         {userData?.isPro && <span className={styles.proBadgeMenu}>PRO</span>}
      </div>
      <p className={styles.userEmail}>{user.email}</p>
    </div>

    {/* NEW: Profile Strength / Completion Field */}
    <div className={styles.strengthField}>
       <div className={styles.strengthLabelRow}>
          <span>Fuqia e Profilit</span>
          <span>75%</span>
       </div>
       <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{width: '75%'}}></div>
       </div>
    </div>

    {/* NEW: Status Row */}
    <div className={styles.visibilityField}>
      <div className={styles.statusIndicator}>
        <span className={userData?.isAvailable ? styles.dotGreen : styles.dotGrey}></span>
        {userData?.isAvailable ? "Aktiv & Online" : "I fshehur (Pushim)"}
      </div>
    </div>

    <hr className={styles.divider} />
    
    <Link to="/dashboard" className={styles.dropdownItem} onClick={() => setShowDropDown(false)}>
      <span className={styles.icon}>📊</span> Paneli i Punës
    </Link>
    
    <Link to="/profile" className={styles.dropdownItem} onClick={() => setShowDropDown(false)}>
      <span className={styles.icon}>👤</span> Profili Publik
    </Link>

    <Link to="/settings" className={styles.dropdownItem} onClick={() => setShowDropDown(false)}>
      <span className={styles.icon}>⚙️</span> Cilësimet
    </Link>
    
    <hr className={styles.divider} />

    {!userData?.isPro && (
      <Link to="/dashboard" className={styles.upgradePrompt} onClick={() => setShowDropDown(false)}>
        🚀 Përmirëso rënditjen (PRO)
      </Link>
    )}

    <Link to="/help" className={styles.dropdownItem} onClick={() => setShowDropDown(false)}>
      <span className={styles.icon}>💡</span> Ndihmë & FAQ
    </Link>

    <hr className={styles.divider} />

    <button 
      onClick={() => { auth.signOut(); setShowDropDown(false); }} 
      className={styles.logoutButton}
    >
      <span className={styles.icon}>🚪</span> Dil nga llogaria
    </button>
  </div>
)}
            </div>
          ) : (
            <>
              <Link to='/worker' className={styles.searchIcon}>
               <img src={Search} alt='search icon' />
              </Link>
              <NavLink 
                to="/login" 
                 className={({ isActive }) => isActive ? `${styles.navLinkLogIn} ${styles.active}` : styles.navLinkLogIn}>
                  Kyqu si mjeshtër
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}



export default Header;