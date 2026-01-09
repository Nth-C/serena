import { createPortal } from 'react-dom';
import styles from './Silde.module.css';
import { useEffect, useState } from 'react'


function Slide({children, title, isOpen, toggleOpen, zIndex = 500, validOnHeader = false , handlerValid = null}) {
    //supprimer le scroll de la page
  useEffect(() => {  
    if (isOpen) {
        document.documentElement.classList.add('menu-active');
    } else {
        document.documentElement.classList.remove('menu-active');
    }
  }, [isOpen]);


  return createPortal(
    <div className={[
      styles.slide,
      isOpen ? styles.active : '', // si isOpen on ajoute la classe active
    ].join(' ')}
    style={{ zIndex: zIndex }}>

      <div className={styles.main_container}>
        <div>
          {!validOnHeader ? (
            <>
            <h1>{title}</h1>
            <button className={styles.hamburger_btn} onClick={toggleOpen}>
              <span></span>
              <span></span>
            </button>
            </>
          ) : (
            <>
            <button className={styles.hamburger_btn} onClick={toggleOpen}>
              <span></span>
              <span></span>
            </button>
            <h1>{title}</h1>
            <button className={styles.valid_btn} onClick={handlerValid}>
              <span></span>
              <span></span>
            </button>
            </>
          )}
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