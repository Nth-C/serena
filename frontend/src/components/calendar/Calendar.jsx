import styles from './Calendar.module.css';

const Calendar = ({ events, isCalendarWeek = false }) => {
    const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const hourHeight = 60; // 1 heure = 60px

    const eventTest = [
        { 
            dateStart: new Date(new Date().setHours(13, 0)), 
            dateEnd: new Date(new Date().setHours(15, 30)),
            titre: 'event 1' 
        },
        { 
            dateStart: new Date(new Date().setHours(13, 0)), 
            dateEnd: new Date(new Date().setHours(15, 30)),
            titre: 'event 2' 
        },
        { 
            dateStart: new Date(new Date().setHours(8, 0)), 
            dateEnd: new Date(new Date().setHours(10, 0)),
            titre: 'event 3' 
        },
    ];


    const calcHeightEvent = (event) => {
        // calcul de la durée en minutes
        const nbMinutes = (event.dateEnd - event.dateStart) / (1000 * 60);

        return nbMinutes * (hourHeight / 60);
    };

    const calcPositionTop = (event) => {
        const startHour = event.dateStart.getHours();
        const startMinute = event.dateStart.getMinutes();
        
        // (Nombre d'heures * 60px) + (Nombre de minutes * 1px)
        return (startHour * hourHeight) + (startMinute * (hourHeight / 60));
    };

    return (
        <>
        {!isCalendarWeek ? ( // jour
            <div className={styles.calendar_day}>

                {/* affichage heures */}
                <div  className={styles.hours}>
                {[...Array(24)].map((e, i) => (
                    <p key={i}>{i < 10 ? `0${i}` : i}:00</p>
                ))}
                </div>

                {/* affichage case */}
                <div className={styles.case}>
                    {/* ajout des ligne */}
                    {[...Array(24)].map((e, i) => (
                    <div key={i}>
                        <span className={styles.line}></span>
                    </div>
                    ))}

                    {/* affichage events */}
                    {eventTest.map((event, i) => (
                        <div 
                            key={i} 
                            className={styles.event} 
                            style={{ height: `${calcHeightEvent(event)}px`, top: `${calcPositionTop(event)}px` }}
                            >
                            {console.log(calcHeightEvent(event))}
                        </div>
                    ))}
                </div>

            </div>
        ): ( // semaine
            <>
            
            </>
        )}
        </>
    );
};

export default Calendar;