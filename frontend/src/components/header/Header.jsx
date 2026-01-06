import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './Header.module.css';

function Header({submenu, onHamburgerClick}) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const checkActive = ({ isActive }) => (isActive ? `${styles.active}` : "")

  return (
    <>
    <header>
      <div className={styles.banner_container}>
        <div className={styles.hamburger_container}>
          <button className={styles.hamburger_btn} onClick={onHamburgerClick}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <div className={styles.principal_container}>
          <img src="/img/logo-name.svg" alt="" />
        </div>

        {user && (
          <div className={styles.user_container}>
            <p>{user.prenom} {user.nom}</p>
          </div>
        )}
      </div>

      {submenu && // si il y a un submenu
      <div className={styles.submenu_container}>
        {submenu.map((currentMenu) => (
        <NavLink key={currentMenu.path} to={"/" + currentMenu.path} className={checkActive}>
          <p>{currentMenu.label}</p>
        </NavLink>      
        ))}
      </div>
      }
    </header>
    </>
  )
}

export default Header;