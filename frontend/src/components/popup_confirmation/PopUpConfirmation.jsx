import styles from './PopUpConfirmation.module.css';
import { useEffect, useState } from 'react'


function PopUpConfirmation({sentence, show, setShow}) {

    useEffect(() => {
        if(show) {
            setTimeout(() => {
                setShow(false)
            }, 3000)
        }
    }, [show]);

    return (
        <div className={[
            styles.container_pop_up_confirmation,
            show ? styles.active : '', // si isOpen on ajoute la classe active
        ].join(' ')}>
            <p>{sentence}</p>
        </div>
    )
}

export default PopUpConfirmation