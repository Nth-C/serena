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
            dateStart: new Date(new Date().setHours(13, 30)), 
            dateEnd: new Date(new Date().setHours(16, 30)),
            titre: 'event 2' 
        },
        { 
            dateStart: new Date(new Date().setHours(8, 0)), 
            dateEnd: new Date(new Date().setHours(10, 0)),
            titre: 'event 3' 
        },
        { 
            dateStart: new Date(new Date().setHours(23, 0)), 
            dateEnd: new Date(new Date().setHours(0, 0)),
            titre: 'event 4' 
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

    // verifie si 2 event se chevauche
    const areOverlapping = (eventA, eventB) => {
        return (
            eventA.dateStart < eventB.dateEnd && 
            eventA.dateEnd > eventB.dateStart
        )
    };

    // trie des evenement par date de debut / titre
    const sortEvents = (events) => {
        return [...events].sort((a, b) => { // on tire une copie pour pas modifier l'original
            // tire heure
            if (a.dateStart.getTime() !== b.dateStart.getTime()) {
                return a.dateStart - b.dateStart;
            }
            // trie titre
            return a.titre.localeCompare(b.titre);
        });
    };

    // calcul la width / left pour les possibles confilt
    const calcPositionLeft = (currentEvent, allEvents) => {
        // trouve les conflits
        const overlaps = allEvents.filter(other => 
            other !== currentEvent && areOverlapping(currentEvent, other)
        );

        // calcule la largeur par rapport aux conflits
        const width = 100 / (overlaps.length + 1);

        // calcule sa colonne
        const sortedConflicts = sortEvents([currentEvent, ...overlaps]);
        const posIndex = sortedConflicts.indexOf(currentEvent);

        return {
            width: `${width}%`,
            left: `${posIndex * width}%`
        };
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
                    {eventTest.map((event, i) => {
                        const horizontalStyle = calcPositionLeft(event, eventTest)
                        
                        const eventStyle = {
                            left: `${horizontalStyle.left}`,
                            width: `calc(${horizontalStyle.width} - 2px)`,
                            height: `${calcHeightEvent(event)}px`,
                            top: `${calcPositionTop(event) + 8}px`
                        }

                        return (
                            <div key={i} className={styles.event} style={eventStyle}>
                                {event.titre}
                            </div>
                        );
                    })}
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