import { NavLink } from 'react-router-dom';
import { createPortal } from 'react-dom';
import styles from './Silde.module.css';

function Slide({children, title, isOpen, toggleOpen, zIndex = 500}) {
  return createPortal(
function Slide({children, title, isOpen, toggleOpen}) {


  //supprimer le scroll de la page
  useEffect(() => {  
    if (isOpen) {
        document.documentElement.classList.add('menu-active');
    } else {
        document.documentElement.classList.remove('menu-active');
    }
  }, [isOpen]);

  return (
    <div className={[
      styles.slide,
      isOpen ? styles.active : '', // si isOpen on ajoute la classe active
    ].join(' ')}
    style={{ zIndex: zIndex }}>

      <div className={styles.main_container}>
        <div>
          <h1>{title}</h1>
          <button className={styles.hamburger_btn} onClick={toggleOpen}>
            <span></span>
            <span></span>
          </button>
          </div>
        <div>
          {children}
        </div>
      </div>

      <div className={styles.background} onClick={toggleOpen}></div>
    </div>,
    document.body
  )
}

export default Slide;