import styles from './PopUpConfirmation.module.css';
import { useEffect, useState } from 'react'


function PopUpConfirmation({sentence, show}) {
    const [active, setActive] = useState(false);

  useEffect(() => {
    if(show) {
        setActive(true)
        setTimeout(() => {
            setActive(false)
        }, 3000)
    }
  }, [show]);

    return (
        <div className={[
            styles.container_pop_up_confirmation,
            active ? styles.active : '', // si isOpen on ajoute la classe active
        ].join(' ')}>
            <p>{sentence}</p>
        </div>
    )
}

export default PopUpConfirmation