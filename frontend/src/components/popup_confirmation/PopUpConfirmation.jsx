import styles from './PopUpConfirmation.module.css';
import { useEffect } from 'react'


function PopUpConfirmation({sentence, show, setShow}) {

    // fais apparaitre le pop up pendant 3 sec
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