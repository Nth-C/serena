import styles from './PopUpSelectDate.module.css';
import { getFormatDate } from '../../utils/timeFormat';
import { useState } from 'react'

import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { fr } from 'date-fns/locale/fr'; 
registerLocale('fr', fr);

const PopUpSelectDate = ({isOpen, onClose, handlerValid }) => {
    const [date, setDate] = useState(new Date());

    return (
        <div className={[
            styles.container_pop_up_date,
            isOpen ? styles.active : '',
        ].join(' ')}>
            <div className={styles.pop_up_date}>
                <div>
                    <p>Voir à partir du ...</p>
                    <h2>{getFormatDate(date, true)}</h2>
                </div>
                <div>
                    <DatePicker
                        selected={date}
                        onChange={(date) => setDate(date)}
                        inline
                        showOutsideDays={false} 
                        locale="fr"
                        fixedHeight
                        minDate={new Date()} // // empeche de cliquer sur les jours anterieur
                    />
                </div>
                <div>
                    <button onClick={onClose}>Annuler</button>
                    <button onClick={() => {
                        handlerValid(date);
                        onClose();
                    }}>Valider</button>
                </div>
            </div>

            <div className={styles.background} onClick={onClose}></div>
            
        </div>
    )
}

export default PopUpSelectDate;