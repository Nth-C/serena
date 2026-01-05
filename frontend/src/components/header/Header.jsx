import { NavLink, Outlet } from 'react-router-dom';
import styles from './Header.module.css';

function Header({submenu}) {
  const checkActive = ({ isActive }) => (isActive ? `${styles.active}` : "")

  return (
    <>
    <header>
      <div className={styles.banner_container}>
        <div className={styles.hamburger_container}>
          <button className={styles.hamburger_btn}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <div className={styles.principal_container}>
          <img src="/img/logo-name.svg" alt="" />
        </div>
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