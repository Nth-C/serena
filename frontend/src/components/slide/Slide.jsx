import { useEffect, useState } from 'react'
import styles from './Silde.module.css';

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
    ].join(' ')}>

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
    </div>
  )
}

export default Slide;