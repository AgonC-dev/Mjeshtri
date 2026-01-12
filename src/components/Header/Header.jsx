import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react';
import styles from './Header.module.css'
import { auth, db } from '../../api/firebase'; // Import your auth
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

function Header() {
const [ user, setUser ] = useState(null);
const [ userData, setUserData ] = useState(null);
const [ showDropDown, setShowDropDown] = useState(false);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async(currentUser) => {
    setUser(currentUser);

    if(currentUser){
      const docRef = doc(db, "workers", currentUser.uid);
      const docSnap = await getDoc(docRef);
      if(docSnap.exists()) {
        setUserData(docSnap.data());
      } 
    } else {
      setUserData(null)
    }
  });
  return () => unsubscribe();
}, [])

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoText}>Mjeshtri.ks</span>
        </Link>
        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>Kryefaqja</Link>
          <Link to="/workers" className={styles.navLink}>Mjeshtër</Link>
      {user ? (
  <div className={styles.profileWrapper}>
    {/* The Circle (The Toggle) */}
    <div 
      className={styles.profileCircle} 
      onClick={() => setShowDropDown(!showDropDown)}
    >
      <img 
        src={userData?.profilePic || "https://via.placeholder.com/40"} 
        alt="Profile" 
        className={styles.avatar} 
      />
    </div>

    {/* The Actual Dropdown Menu */}
    {showDropDown && (
      <div className={styles.dropdown}>
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
          Dashboard
        </Link>
         <Link 
          to="/settings" 
          className={styles.dropdownItem}
          onClick={() => setShowDropDown(false)}
        >
          Profile Settings
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
  <Link to="/register" className={styles.navLink}>Regjistrohu</Link>
)}
        </nav>
      </div>
    </header>
  )
}

export default Header
