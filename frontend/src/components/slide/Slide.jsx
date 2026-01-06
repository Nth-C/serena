import { NavLink } from 'react-router-dom';
import styles from './Silde.module.css';

function Slide({children, title, isOpen, onClickNewMedecine}) {
  return (
    <div className={[
      styles.slide,
      isOpen ? styles.active : '', // si isOpen on ajoute la classe active
    ].join(' ')}>

      <div className={styles.main_container}>
        <div>
          <h1>{title}</h1>
          <button className={styles.hamburger_btn} >
            <span></span>
            <span></span>
          </button>
          </div>
        <div>
          {children}
        </div>
      </div>

      <div className={styles.background}  ></div>
    </div>
  )
}

export default Slide;