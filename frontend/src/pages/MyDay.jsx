import { useEffect, useState } from 'react'
import { getFormatDate, getFormatTime } from '../utils/timeFormat';
import Calendar from '../components/calendar/Calendar'
import PopUpConfirmation from '../components/popup_confirmation/PopUpConfirmation'
import PopUpDelete from '../components/popup_delete/PopUpDelete'
import Slide from '../components/slide/Slide';


function MyDay() {
  const [date, setDate] = useState(new Date())
  const [listeEvenements, setListeEvenements] = useState([])
  const [eventsForCalendar, setEventsForCalendar] = useState([])

  // ouvrir la popup d'evenement
  const [eventOpen, setEventOpen] = useState(false)
  const [currentEvent, setCurrentEvent] = useState(null)

  // popup delete
  const [popUpDeleteOpen , setPopUpDeleteOpen] = useState(false)
  const [eventToDelete , setEventToDelete] = useState({
    id: null,
    title: null,
  })

  // popup confirmation
  const [isShowConfirmation , setIsShowConfirmation] = useState(false)
  const [msgConfirmation , setMsgConfirmation] = useState('')

  /* acces a la bd */

  const apiUrl = import.meta.env.VITE_API_URL

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${apiUrl}/?route=getevents`, {
          credentials: 'include' 
      });
      const data = await response.json()
      
      if (data.success) {
        setListeEvenements(data.evenements)
      }
    } catch (error) {
      console.error("Erreur chargement événements", error)
    }
  }

  const handleRemoveEvent = async (e) => {
    // Préparation du payload spécifique
    const payload = {
        id_evenement: e,
    };

    try {
        const response = await fetch(`${apiUrl}/?route=evenement/delete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.success) {
            setMsgConfirmation('Événement supprimé avec succès !');
            setIsShowConfirmation(true)
            fetchEvents();
        } else {
          console.error('Erreur lors de la suppression de l\'événement', result.error)
        }
    } catch (error) {
        console.error("Erreur réseau Suppression:", error);
    }
  };

  // quand la page se lance on recupere les données
  useEffect(() => {
    fetchEvents()
  }, [apiUrl]);

  /* permet de faire passer les evenement sur plusieurs jours */
  useEffect(() => {
    // Définition de la range (affichage des date)
    const rangeStart = new Date(date);
    const rangeEnd = new Date(date);

    rangeStart.setHours(0, 0, 0, 0);
    rangeEnd.setHours(23, 59, 59, 999);
    
    // filtrage de events
    const filtered = listeEvenements
      .map(ev => {
        const realStart = new Date(ev.date_deb.replace(" ", "T"));
        const realEnd = new Date(ev.date_fin.replace(" ", "T"));
        
        return { ...ev, realStart, realEnd };
      })
      .filter(({ realStart, realEnd }) => {
        return realStart <= rangeEnd && realEnd >= rangeStart;
      })
      .map(({ realStart, realEnd, ...ev }) => {
        const startDate = realStart < rangeStart ? new Date(rangeStart) : realStart;
        const endDate = realEnd > rangeEnd ? new Date(rangeEnd) : realEnd;

        return {
          id_event: ev.id_event,
          titre: ev.nom,
          lieu: ev.lieu,
          description: ev.description,
          dateStart: startDate,
          dateEnd: endDate,
        };
      });

    setEventsForCalendar(filtered);
  }, [listeEvenements, date]);

  return (
    <>
    <div className="my_day">
      <h2>Ma journée</h2>
      <Calendar 
          date={date}
          isCalendarWeek={false}
          events={eventsForCalendar}
          toggleEventOpen={() => {
            setEventOpen(!eventOpen)
          }}
          setCurrentEvent={setCurrentEvent}
      />
    </div>

      <Slide
        title={currentEvent ? currentEvent.titre : "Détails"}
        isOpen={eventOpen}
        toggleOpen={() => setEventOpen(false)}
      >
        {currentEvent && (
            <div className='event_details'>
                <div className='detail_item'>
                    <strong>Lieu:</strong>
                    <p>{currentEvent.lieu || "Non spécifié"}</p>
                </div>
                
                <div className='detail_item'>
                    <strong>Horaire:</strong>
                    <p>
                        De {getFormatDate(currentEvent.dateStart)}
                        à {getFormatTime(currentEvent.dateStart)}
                    </p>
                    <p>
                        De {getFormatDate(currentEvent.dateEnd)}
                        à {getFormatTime(currentEvent.dateEnd)}
                    </p>
                </div>

                {currentEvent.description && (
                    <div className='detail_item'>
                        <strong>Notes:</strong>
                        <p>{currentEvent.description}</p>
                    </div>
                )}

                <div className='actions'>
                    <button className="btn_red" onClick={() => {
                      setPopUpDeleteOpen(true)
                      setEventToDelete({id: currentEvent.id_event, title: currentEvent.title})
                      setEventOpen(false)
                    }}>Supprimer</button>
                    <button className="btn_border" onClick={() => setEventOpen(false)}>Fermer</button>
                </div>
            </div>
        )}
    </Slide>

    <PopUpDelete
      toDelete={eventToDelete.title}
      handleDelete={() => handleRemoveEvent(eventToDelete.id)}
      isOpen={popUpDeleteOpen}
      onClose={() => setPopUpDeleteOpen(false)}
    />

    <PopUpConfirmation
      sentence={msgConfirmation}
      show={isShowConfirmation}
      setShow={setIsShowConfirmation}
    />
    </>
  )
}

export default MyDay