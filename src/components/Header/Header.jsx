import { Link, NavLink } from 'react-router-dom'; // Added NavLink for active states
import { useState, useEffect, useRef } from 'react';
import styles from './Header.module.css';
import { auth, db } from '../../api/firebase'; 
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

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
    return () => document.removeEventListener("click", handleOutsideClick)
      
  }, [])

  return (
    <header className={styles.header}>
      {/* This container ensures the logo and nav links align with the page body */}
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoText}>Mjeshtri.ks</span>
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
            Mjeshtër
          </NavLink>

          <button onClick={toggleTheme} className={styles.themeToggle}>
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>

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
                    <p className={styles.userName}>{userData?.fullName || "Mjeshtër"}</p>
                    <p className={styles.userEmail}>{user.email}</p>
                  </div>
                  <hr className={styles.divider} />
                  <Link 
                    to="/dashboard" 
                    className={styles.dropdownItem}
                    onClick={() => setShowDropDown(false)}
                  >
                    Paneli
                  </Link>
                  <Link 
                    to="/settings" 
                    className={styles.dropdownItem}
                    onClick={() => setShowDropDown(false)}
                  >
                    Cilësimet e Profilit
                  </Link>
                  <Link 
                    to="/profile"
                    className={styles.dropdownItem}
                    onClick={() => setShowDropDown(false)}
                  >
                    Shiko Profilin
                  </Link>
                  <button 
                    onClick={() => {
                      auth.signOut();
                      setShowDropDown(false);
                    }} 
                    className={styles.logoutButton}
                  >
                    Dil (Logout)
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              
              <NavLink 
                to="/register" 
                 className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}>
                  Regjistrohu
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;