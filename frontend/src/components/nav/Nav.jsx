import { NavLink } from 'react-router-dom';
import styles from './Nav.module.css';

function Nav() {

  const checkActive = ({ isActive }) => (isActive ? `${styles.active}` : "")

  return (
    <nav className={styles.navbar}>
      <div>
        {/* comme le path de la page d'accueil c'est /sous_partie et pas /home/sous_partie le active ne fonctionne que sur la sous partie et pas sur la nav */}
        <NavLink to="/home" className={checkActive}> 
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="M240-200h120v-240h240v240h120v-360L480-740 240-560v360Zm-80 80v-480l320-240 320 240v480H520v-240h-80v240H160Zm320-350Z"/>
          </svg>
          <p>Accueil</p>
        </NavLink>
        <NavLink to="/agenda" className={checkActive}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z"/>
          </svg>
          <p>Agenda</p>
        </NavLink>
        <NavLink to="/suivi" className={checkActive}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
          <path d="M480-240Zm-320 80v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440h14q-11 18-16.5 38.5T472-360q-54 1-107.5 14.5T260-306q-9 5-14.5 14t-5.5 20v32h283l80 80H160Zm320-320q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47Zm0-80q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm236 480L576-300q-13-13-18.5-28t-5.5-30q0-32 23-57t59-25q28 0 44 13t38 35q20-20 36.5-34t45.5-14q37 0 59.5 25.5T880-357q0 15-6 30t-18 27L716-160Z"/>
        </svg>        
        <p>Suivi</p>
        </NavLink>
        <NavLink to="/document" className={checkActive}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
            <path d="M320-440h320v-80H320v80Zm0 120h320v-80H320v80Zm0 120h200v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"/>
          </svg>
          <p>Document</p>
        </NavLink>
      </div>
    </nav>
  )
}

export default Nav;