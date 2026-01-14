import { useState } from 'react'
import styles from './Calendar.module.css';

const Calendar = ({ date, events = [], toggleEventOpen, setCurrentEvent, isCalendarWeek = false }) => {
    const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const hourHeight = 60; // 1 heure = 60px

    const now = new Date();
    // vérifie si la date affichée est aujourd'hui
    const isToday = date.getDate() === now.getDate() &&
                    date.getMonth() === now.getMonth() &&
                    date.getFullYear() === now.getFullYear();
    
    // l'heure actuel - 2 pour avoir un meilleur apperçue sur le planning du jour 
    const currentHourToDisplay = now.getHours() - 2;

    const calcHeightEvent = (event) => {
        // calcul de la durée en minutes
        const nbMinutes = (event.dateEnd - event.dateStart) / (1000 * 60);

        return nbMinutes * (hourHeight / 60);
    };

    const calcPositionTop = (event) => {
        const startHour = event.dateStart.getHours();
        const startMinute = event.dateStart.getMinutes();
        
        // (Nombre d'heures * 60px) + (Nombre de minutes * 1px)
        let top = (startHour * hourHeight) + (startMinute * (hourHeight / 60))

        // repositionne si c'est le planning du jour
        if(isToday) {
            return top - (currentHourToDisplay * hourHeight);
        }
        return top;
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

    // liste des events affiché pour les jours actuel
    const visibleEvents = events.filter(event => {
        if (!isToday) return true;

        const limitDate = new Date(now);
        limitDate.setHours(currentHourToDisplay, 0, 0, 0);
        return event.dateEnd > limitDate;
    });

    return (
        <>
        {!isCalendarWeek ? ( // jour
            <div className={styles.calendar_day}>

                {/* affichage heures */}
                <div  className={styles.hours}>
                {[...Array(24)].map((e, i) => {
                    // si c'est aujourd'hui on cache les heures < currentHourToDisplay
                    if (isToday && i < currentHourToDisplay) return null;

                    return <p key={i}>{i < 10 ? `0${i}` : i}:00</p>
                })}
                </div>

                {/* affichage case */}
                <div className={styles.case}>
                    {/* ajout des ligne */}
                    {[...Array(24)].map((e, i) => {
                    // si c'est aujourd'hui on cache les lignes < currentHourToDisplay
                    if (isToday && i < currentHourToDisplay) return null;

                    return (
                        <div key={i}>
                            <span className={styles.line}></span>
                        </div>
                    );
                })}
                    {/* affichage events */}
                    {visibleEvents.map((event, i) => {
                        const horizontalStyle = calcPositionLeft(event, visibleEvents);

                        // recupere les positions
                        let top = calcPositionTop(event);
                        let height = calcHeightEvent(event);

                        if (isToday) {

                            // si un event est finit on ne l'affiche pas
                            if (event.dateEnd < currentHourToDisplay) return null;

                            // Si l'événement a commencé avant l'heure actuelle mais finit après
                            if (top < currentHourToDisplay) {
                                const difference = currentHourToDisplay - top;
                                height = height - difference;
                                top = 0;
                            } else {
                                top = top - currentHourToDisplay;
                            }
                        }

                        const eventStyle = {
                            left: `${horizontalStyle.left}`,
                            width: `calc(${horizontalStyle.width} - 2px)`,
                            height: `${height}px`,
                            top: `${top + 8}px`,
                            // met un border top si l'event a deja commencé
                            borderTop: top === 0 && isToday && event.dateStart < now ? '4px dashed var(--pink)' : 'none'
                        };

                        return (
                            <div key={i} className={styles.event} style={eventStyle} onClick={() => {
                                setCurrentEvent(event);
                                toggleEventOpen();
                            }}>
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