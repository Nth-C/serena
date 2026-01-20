import { useEffect, useState, useRef } from 'react'
import Slide from '../components/slide/Slide';
import { getFormatDate, getFormatTime } from '../utils/timeFormat';
import PopUpDelete from '../components/popup_delete/PopUpDelete'

import Calendar from '../components/calendar/Calendar'
import PopUpSelectDate from '../components/pop_up_select_date/PopUpSelectDate'
import PopUpConfirmation from '../components/popup_confirmation/PopUpConfirmation'

function Agenda() {
  const [newEventOpen, setNewEventOpen] = useState(false)
  const [isTrajet, setIsTrajet] = useState(false)
  const [membresFamille, setMembresFamille] = useState([]) 
  
  // State pour stocker la liste des événements
  const [listeEvenements, setListeEvenements] = useState([])
  const [eventsForCalendar, setEventsForCalendar] = useState([])

  // ouvrir la popup d'evenement
  const [eventOpen, setEventOpen] = useState(false)
  const [currentEvent, setCurrentEvent] = useState(null)

  // popup trajet
  const [trajetOpen, setTrajetOpen] = useState(false)
  const [currentTrajet, setCurrentTrajet] = useState(null)

  const [date, setDate] = useState(new Date())
  const [popUpDateOpen, setPopUpDateOpen] = useState(false)
  const [isCalendarWeek, setIsCalendarWeek] = useState(false)

  // popup confirmation
  const [isShowConfirmation , setIsShowConfirmation] = useState(false)
  const [msgConfirmation , setMsgConfirmation] = useState('')

  // popup delete
  const [popUpDeleteOpen , setPopUpDeleteOpen] = useState(false)
  const [popUpDeleteRecuOpen , setPopUpDeleteRecuOpen] = useState(false)
  const [eventToDelete , setEventToDelete] = useState({
    id: null,
    title: null,
    id_recurrence: null
  })

  // edit mode
  const [isEditMode, setIsEditMode] = useState(false)

  // swipe detection
  const touchStartX = useRef(0)

  const SWIPE_THRESHOLD = 50 // sistance minimale pour déclencher le swipe
  
  const apiUrl = import.meta.env.VITE_API_URL

  // --- Initialisation du State ---
  const [formData, setFormData] = useState({
    // Champs Événement
    titre: '',
    lieu: '',
    accompagnants: '', 
    debut: '',
    fin: '',
    recurrence: 'aucun',
    id_recurrence: '',
    nbRecurrence: 1,   
    description: '',

    // Champs Trajet
    effectue: 'aidant',  // Valeur par défaut
    societe: '',         // Texte
    aidantAffecte: 'demande',
    lieuDepart: '',
    lieuArrivee: '',
    id_event: ''         // ID de l'événement lié
  })

  const handleReset = async () => {
      setFormData({
      titre: '',
      lieu: '',
      accompagnants: '', 
      debut: '',
      fin: '',
      recurrence: 'aucun',
      id_recurrence: '',
      nbRecurrence: 1,   
      description: '',
      effectue: 'aidant',
      societe: '',
      aidantAffecte: 'demande',
      lieuDepart: '',
      lieuArrivee: '',
      id_event: ''
    })
  }

  // handle pour le swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    const touchEndX = e.changedTouches[0].clientX
    
    const deltaX = touchEndX - touchStartX.current
    
    // vérification de la taile du swipe
    if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      if (deltaX > 0) {
        // swipe vers la droite = jour/semaine précédent
        const newDate = new Date(date)
        if (isCalendarWeek) {
          newDate.setDate(newDate.getDate() - 7)
        } else {
          newDate.setDate(newDate.getDate() - 1)
        }
        // vérifier que la nouvelle date n'est pas avant aujourd'hui
        if (newDate >= today) {
          setDate(newDate)
        }
      } else {
        // swipe vers la gauche = jour/semaine suivant
        const newDate = new Date(date)
        if (isCalendarWeek) {
          newDate.setDate(newDate.getDate() + 7)
        } else {
          newDate.setDate(newDate.getDate() + 1)
        }
        setDate(newDate)
      }
    }
  }

  const fetchMembres = async () => {
    try {
      const response = await fetch(`${apiUrl}/?route=getfamillepersonne`, {
          credentials: 'include' 
      });
      const data = await response.json()
      
      if (data.success) {
        setMembresFamille(data.membres)
      }
    } catch (error) {
      console.error("Erreur chargement famille", error)
    }
  };


  const fetchEvents = async () => {
    try {
      const response = await fetch(`${apiUrl}/?route=getevents`, {
          credentials: 'include' 
      });
      const data = await response.json()
      
      if (data.success) {
        setListeEvenements(data.evenements)
        
        //console.log('event : ', data.evenements)
      }
    } catch (error) {
      console.error("Erreur chargement événements", error)
    }
  }

  // quand la page se lance on recupere les données
  useEffect(() => {
    fetchMembres()
    fetchEvents()
  }, []);

  // --- Gestion des changements dans les inputs ---
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const decodeHTML = (str) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = str;
    return txt.value;
};

  // --- Handler pour l'ÉVÉNEMENT ---
  const handleAddEvent = async (e) => {
      if (e) e.preventDefault(); // Empêche le rechargement si appelé via un bouton type submit

      handleReset();
      // Préparation du payload spécifique à l'événement
      const payload = {
          titre: formData.titre,
          lieu: formData.lieu,
          accompagnants: formData.accompagnants,
          debut: formData.debut,
          fin: formData.fin,
          recurrence: formData.recurrence,
          nbRecurrence: formData.nbRecurrence,
          description: formData.description
      };

      // Nettoyage des champs vides
      Object.keys(payload).forEach(key => {
          if (payload[key] === '') payload[key] = null;
      });

      try {
          const response = await fetch(`${apiUrl}/?route=evenement/add`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: 'include',
              body: JSON.stringify(payload)
          });

          const result = await response.json();

          if (result.success) {
              handleSuccess(`L'événement ${formData.titre} a bien été ajouter.`);
          } else {
              console.error('Erreur lors de l\'ajout de l\'événement',  result.error);
          }
      } catch (error) {
          console.error("Erreur réseau Event:", error);
      }
  };

  const toLocalISO = (date) => {
    const offset = date.getTimezoneOffset() * 60000; // Décalage en millisecondes
    const localISOTime = (new Date(date - offset)).toISOString().slice(0, 16);
    return localISOTime;
  };


  const handleUpdateEvent = async (e) => {
    if (e) e.preventDefault();

    const payload = {
        id_event: currentEvent.id_event,
        titre: formData.titre,
        lieu: formData.lieu,
        accompagnants: formData.accompagnants,
        debut: toLocalISO(currentEvent.dateStart),
        fin: toLocalISO(currentEvent.dateEnd),
        recurrence: formData.recurrence,
        description: formData.description
    };

    Object.keys(payload).forEach(key => {
        if (payload[key] === '') payload[key] = null;
    });

    try {
        const response = await fetch(`${apiUrl}/?route=evenement/update`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.success) {
            handleSuccess('Événement modifié avec succès !');
            setIsEditMode(false);
        } else {
            console.error('Erreur lors de la modification de l\'événement', result.error);
        }
    } catch (error) {
        console.error("Erreur réseau Update:", error);
    }
  };

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
            handleSuccess('Événement supprimé avec succès !');
            fetchEvents();
            setEventOpen(false);
        } else {
          console.error('Erreur lors de la suppression de l\'événement', result.error)
        }
    } catch (error) {
        console.error("Erreur réseau Suppression:", error);
    }
};

const handleRemoveRecurrenceEvent = async (e) => {
    // Préparation du payload spécifique
    const payload = {
        id_recurrence: e,
    };

    try {
        const response = await fetch(`${apiUrl}/?route=evenementrecurrence/delete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.success) {
            handleSuccess('Événement supprimé avec succès !');
            fetchEvents();
            setEventOpen(false);
        } else {
          console.error('Erreur lors de la suppression de l\'événement', result.error)
        }
    } catch (error) {
        console.error("Erreur réseau Suppression:", error);
    }
};

  // --- Handler pour le TRAJET ---
  const handleAddTrajet = async (e) => {
      if (e) e.preventDefault();

      // Préparation du payload spécifique au trajet (mapping avec tes noms de colonnes SQL)
      const payload = {
          date_deb: formData.debut,
          date_fin: formData.debut, 
          lieu_dep: formData.lieuDepart,
          lieu_arr: formData.lieuArrivee,
          id_event: formData.id_event,
          aidant_id: formData.effectue === 'aidant' ? formData.aidantAffecte : null,
          societe: formData.effectue === 'externe' ? formData.societe : null
      };

      Object.keys(payload).forEach(key => {
          if (payload[key] === '') payload[key] = null;
      });

      try {
          const response = await fetch(`${apiUrl}/?route=trajet/add`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: 'include',
              body: JSON.stringify(payload)
          });

          const result = await response.json();

          if (result.success) {
              handleSuccess('Trajet ajouté avec succès !');
          } else {
              console.error('Erreur lors de l\'ajout du trajet', result.error);
          }
      } catch (error) {
          console.error("Erreur réseau Trajet:", error);
      }
  };

  const resetFormEvent = () => {
    setFormData(prev => ({
      ...prev,
      titre: '',
      lieu: '',
      accompagnants: '',
      debut: '',
      fin: '',
      recurrence: 'aucune',
      nbRecurrence: 1,
      description: ''
    }));
  };

  const resetFormTrajet = () => {
    setFormData(prev => ({
      ...prev,
      effectue: 'aidant',
      societe: '',
      lieuDepart: '',
      lieuArrivee: '',
      id_event: ''
    }));
  };

  // --- Fonction utilitaire pour éviter de répéter le reset ---
  const handleSuccess = (msg) => {
    setMsgConfirmation(msg)
    setIsShowConfirmation(true)
    fetchEvents();
    setNewEventOpen(false);
    resetFormEvent()
    resetFormTrajet()
  };


  /* permet de faire passer les evenement sur plusieurs jours */
  useEffect(() => {
    // Définition de la range (affichage des date)
    const rangeStart = new Date(date);
    const rangeEnd = new Date(date);

    if (isCalendarWeek) {
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1);
      rangeStart.setDate(diff);
      rangeStart.setHours(0, 0, 0, 0);

      rangeEnd.setDate(rangeStart.getDate() + 6);
      rangeEnd.setHours(23, 59, 59, 999);
    } else {
      rangeStart.setHours(0, 0, 0, 0);
      rangeEnd.setHours(23, 59, 59, 999);
    }

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

        // Afficher l'accompagnant s'il existe
        const accompagnantNom = ev.accompagnant 
          ? `${ev.accompagnant.prenom} ${ev.accompagnant.nom}`
          : "Non spécifié";
        const accompagnantId = ev.accompagnant ? ev.accompagnant.id_personne : '';

        return {
          id_event: ev.id_event,
          id_recurrence: ev.id_recurrence,
          titre: decodeHTML(ev.nom), 
          lieu: decodeHTML(ev.lieu || ""), 
          description: decodeHTML(ev.description || ""), 
          accompagnant: accompagnantNom,
          accompagnantId: accompagnantId,
          dateStart: startDate,
          dateEnd: endDate,
        };
      });

    setEventsForCalendar(filtered);
  }, [listeEvenements, date, isCalendarWeek]);

  return (
    <> 
    <div className="agenda" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>

      {/* selecteurs haut de page */}
      <div className='container_date'>
        <button onClick={() => setPopUpDateOpen(true)}>
          <h1>{getFormatDate(date)}</h1>
          <div>
            <img src="/icons/arrows-extend.svg" alt="" />
          </div>
        </button>
        <div className='switch_calendar'>
          <button className={!isCalendarWeek ? 'active' : ''} onClick={() => setIsCalendarWeek(false)}>Jour</button>
          <button className={isCalendarWeek ? 'active' : ''} onClick={() => setIsCalendarWeek(true)}>Semaine</button>
        </div>
      </div>

      <Calendar 
          date={date}
          isCalendarWeek={isCalendarWeek}
          events={eventsForCalendar}
          toggleEventOpen={() => {
            setEventOpen(!eventOpen)
          }}
          setCurrentEvent={setCurrentEvent}
      />

      {/* ajouter un evenement */}
      <button className="btn_add" onClick={() => {
        handleReset() // mettre un handler uniquement pour l'event
        setNewEventOpen(true)
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFBF2"><path d="M680-80v-120H560v-80h120v-120h80v120h120v80H760v120h-80Zm-480-80q-33 0-56.5-23.5T120-240v-480q0-33 23.5-56.5T200-800h40v-80h80v80h240v-80h80v80h40q33 0 56.5 23.5T760-720v244q-20-3-40-3t-40 3v-84H200v320h280q0 20 3 40t11 40H200Zm0-480h480v-80H200v80Zm0 0v-80 80Z"/></svg>      
      </button>
      {/* ajouter un trajet */}
      <button className="btn_add_trajet btn_add" onClick={() => {
        handleReset() // mettre un handler uniquement pour le trajet
        setTrajetOpen(true)
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFBF2"><path d="M240-200v40q0 17-11.5 28.5T200-120h-40q-17 0-28.5-11.5T120-160v-320l84-240q6-18 21.5-29t34.5-11h440q19 0 34.5 11t21.5 29l84 240v320q0 17-11.5 28.5T800-120h-40q-17 0-28.5-11.5T720-160v-40H240Zm-8-360h496l-42-120H274l-42 120Zm-32 80v200-200Zm100 160q25 0 42.5-17.5T360-380q0-25-17.5-42.5T300-440q-25 0-42.5 17.5T240-380q0 25 17.5 42.5T300-320Zm360 0q25 0 42.5-17.5T720-380q0-25-17.5-42.5T660-440q-25 0-42.5 17.5T600-380q0 25 17.5 42.5T660-320Zm-460 40h560v-200H200v200Z"/></svg>
      </button>
    </div>

    <PopUpSelectDate 
      isOpen={popUpDateOpen}
      onClose={() => setPopUpDateOpen(false)}
      handlerValid={setDate}
      startDate={date}
    />

    {/* ajouter evenement */}
    <Slide
      title="Nouvel événement"
      isOpen={newEventOpen} 
      toggleOpen={() => setNewEventOpen(false)}
    >
      <form className='add_event' onSubmit={handleAddEvent}>  
        <div>
          <label>Titre :</label>
          <input 
            type="text" name="titre" placeholder="Ex: Rendez-vous médical"
            value={formData.titre} onChange={handleChange} required 
          />
        </div>
        <div>
          <label>Lieu :</label>
          <input 
            type="text" name="lieu" placeholder="Ex: 67 Rue du Skibidi"
            value={formData.lieu} onChange={handleChange} 
          />
        </div>
        <div>
          <label>Accompagnants :</label>
          <select name="accompagnants" value={formData.accompagnants} onChange={handleChange} required>
            <option value="">-- Choisir un accompagnant --</option>
            {membresFamille.map((personne) => (
                <option key={personne.id} value={personne.id}>
                    {personne.prenom} {personne.nom}
                </option>
            ))}
          </select>
        </div>
        <div className="date-row">
          <div>
            <label>Début :</label>
            <input type="datetime-local" name="debut" value={formData.debut} onChange={handleChange} required />
          </div>
          <div>
            <label>Fin :</label>
            <input type="datetime-local" name="fin" value={formData.fin} onChange={handleChange} required />
          </div>
        </div>
        <div>
          <label>Récurrence :</label>
          <select name="recurrence" value={formData.recurrence} onChange={handleChange}>
            <option value="aucun">Aucune</option>
            <option value="journalier">Journalier</option>
            <option value="hebdomadaire">Hebdomadaire</option>
            <option value="mensuel">Mensuel</option>
            <option value="annuel">Annuel</option>
          </select>
        </div>
        {formData.recurrence != 'aucun' && (
        <div>
          <label>Nombre de récurrence :</label>
          <input type="number" min="1" max="100" name="nbRecurrence" value={formData.nbRecurrence} onChange={handleChange} required />
        </div>
        )}
        <div>
          <label>Notes :</label>
          <textarea name="description" value={formData.description} onChange={handleChange} />
        </div>
        <div>
            <button type='button' className='btn_border' onClick={handleReset}>Réinitialiser</button>
            <button type='submit' className='btn_blue'>Valider</button>
        </div>
     </form>
    </Slide>
    
    {/* ajouter trajet */}
    <Slide 
      title={"Nouveau trajet"}
      isOpen={trajetOpen}
      toggleOpen={() => {
        setTrajetOpen(false)
        setIsEditMode(false)
      }}>
      <form className='add_trajet' onSubmit={handleAddTrajet}>  
        <div>
            <label>Lier à l'événement :</label>
            <select 
                name="id_event" 
                value={formData.id_event} 
                onChange={handleChange} 
                required
            >
                <option value="">-- Choisir un événement --</option>
                {listeEvenements.map((ev) => {
                    // Traitement de la date
                    const d = new Date(ev.date_deb);
                    // On n'affiche que la date car le JSON ne contient pas l'heure
                    const dateStr = !isNaN(d) ? d.toLocaleDateString('fr-FR') : ev.date_deb;
                    
                    return (
                      <option key={ev.id_event} value={ev.id_event}>
                        {ev.nom} ({dateStr})
                      </option>
                    )
                })}
            </select>
        </div>
        <div className='effectue_trajet'>
          <p>Qui effectue le trajet : </p>
          <div>
            <input 
                type="radio" id="aidant" name="effectue" value="aidant" 
                checked={formData.effectue === 'aidant'} 
                onChange={handleChange}
            />
            <label htmlFor="aidant">Aidant</label>
          </div>
          <div>
            <input 
                type="radio" id="externe" name="effectue" value="externe" 
                checked={formData.effectue === 'externe'} 
                onChange={handleChange}
            />
            <label htmlFor="externe">Société Externe :</label> 
          </div> 
        </div>
        {formData.effectue === 'externe' ? (
            <div>
                <label>Nom de la société :</label>
                <input 
                    type="text" name="societe" placeholder="Ex: Taxi Ambulance"
                    value={formData.societe} onChange={handleChange} required 
                />
            </div>
        ) : (
          <div>
            <label>Aidant affecté :</label>
            <select name="aidantAffecte" value={formData.aidantAffecte} onChange={handleChange} required>
              <option value="demande">Envoyer une demande aux aidants :</option>
              {membresFamille.map((personne) => (
                  <option key={personne.id} value={personne.id}>
                      {personne.prenom} {personne.nom}
                  </option>
              ))}
            </select>
          </div>
        )}
        <div>
          <label>Date et heure du trajet :</label>
          <input 
            type="datetime-local" name="debut" 
            value={formData.debut} onChange={handleChange} required 
          />
        </div>
        <div>
          <label>Lieu de départ :</label>
          <input 
            type="text" name="lieuDepart" placeholder="Ex: Maison"
            value={formData.lieuDepart} onChange={handleChange} required 
          />
        </div>
        <div>
          <label>Lieu d'arrivée :</label>
          <input 
            type="text" name="lieuArrivee" placeholder="Ex: Centre ville"
            value={formData.lieuArrivee} onChange={handleChange} required 
          />
        </div>
          <div>
            <button type='button' className='btn_border' onClick={handleReset}>Réinitialiser</button>
            <button type='submit' className='btn_blue'>Valider</button>
        </div>
      </form>
    </Slide>
    
    {/* details + modifier */}
    <Slide
        title={currentEvent ? currentEvent.titre : "Détails"}
        isOpen={eventOpen}
        toggleOpen={() => {
          setEventOpen(false)
          setIsEditMode(false)
        }}
    >
        {currentEvent && !isEditMode ? (
            <div className='event_details'>
                <div className='detail_item'>
                    <strong>Lieu:</strong>
                    <p>{currentEvent.lieu || "Non spécifié"}</p>
                </div>

                <div className='detail_item'>
                    <strong>Accompagnant:</strong>
                    <p>{currentEvent.accompagnant}</p>
                </div>
                
                <div className='detail_item'>
                    <strong>Horaire:</strong>
                    <p>
                        Du {getFormatDate(currentEvent.dateStart)} à {getFormatTime(currentEvent.dateStart)}
                    </p>
                    <p>
                        Au {getFormatDate(currentEvent.dateEnd)} à {getFormatTime(currentEvent.dateEnd)}
                    </p>
                </div>

                {currentEvent.description && (
                    <div className='detail_item'>
                        <strong>Notes:</strong>
                        <p>{currentEvent.description}</p>
                    </div>
                )}

                <div className='actions'>
                    <button className="btn_blue" onClick={() => {
                      setFormData({
                        titre: currentEvent.titre,
                        lieu: currentEvent.lieu || '',
                        accompagnants: currentEvent.accompagnantId || '',
                        debut: currentEvent.dateStart.toISOString().slice(0, 16),
                        fin: currentEvent.dateEnd.toISOString().slice(0, 16),
                        recurrence: '',
                        description: currentEvent.description || '',
                        effectue: 'aidant',
                        societe: '',
                        lieuDepart: '',
                        lieuArrivee: '',
                        id_event: ''
                      })
                      setIsEditMode(true)
                    }}>Modifier</button>
                    {currentEvent.id_recurrence !== null && (
                    <button className="btn_red" onClick={() => {
                      setPopUpDeleteRecuOpen(true)
                      setEventToDelete({id: currentEvent.id_event, title: currentEvent.titre, id_recurrence: currentEvent.id_recurrence})
                      setEventOpen(false)
                    }}>Supprimer les évènements de la récurrence</button>
                  )}
                    <button className="btn_red" onClick={() => {
                      setPopUpDeleteOpen(true)
                      setEventToDelete({id: currentEvent.id_event, title: currentEvent.titre})
                      setEventOpen(false)
                    }}>Supprimer</button>
                </div>
            </div>
        ) : (currentEvent && isEditMode) && (
          <>
            {/* 
              Switcher Event / Trajet 
              rajouter une condition pour verifier si un un trajet est bien lié a l'evenement
            */}
            <div className='switch_event'>
              <button type="button" className={!isTrajet ? 'active' : ''} onClick={() => setIsTrajet(false)} >Événement</button>
              <button type="button" className={isTrajet ? 'active' : ''} onClick={() => setIsTrajet(true)} >Trajet</button>
            </div>

            {!isTrajet ? (
            <form className='edit_event' onSubmit={handleUpdateEvent}>
              <div>
                <label>Titre :</label>
                <input 
                  type="text" name="titre" placeholder="Ex: Rendez-vous médical"
                  value={formData.titre} onChange={handleChange} required 
                />
              </div>

              <div>
                <label>Lieu :</label>
                <input 
                  type="text" name="lieu" placeholder="Ex: 67 Rue du Skibidi"
                  value={formData.lieu} onChange={handleChange} 
                />
              </div>

              <div>
                <label>Accompagnants :</label>
                <select name="accompagnants" value={formData.accompagnants} onChange={handleChange}>
                  <option value="">-- Choisir un accompagnant --</option>
                  {membresFamille.map((personne) => (
                      <option key={personne.id} value={personne.id}>
                          {personne.prenom} {personne.nom}
                      </option>
                  ))}
                </select>
              </div>

              <div className="date-row">
                <div>
                  <label>Début :</label>
                  <input type="datetime-local" name="debut" value={formData.debut} onChange={handleChange} required />
                </div>
                <div>
                  <label>Fin :</label>
                  <input type="datetime-local" name="fin" value={formData.fin} onChange={handleChange} required />
                </div>
              </div>

              <div>
                <label>Récurrence :</label>
                <select name="recurrence" value={formData.recurrence} onChange={handleChange}>
                  <option value="">Aucune</option>
                  <option value="hebdo">Hebdomadaire</option>
                  <option value="mensuel">Mensuel</option>
                </select>
              </div>

              <div>
                <label>Notes :</label>
                <textarea name="description" value={formData.description} onChange={handleChange} />
              </div>

              <div>
                  <button type='button' className='btn_border' onClick={handleReset}>Réinitialiser</button>
                  <button type='submit' className='btn_blue'>Valider</button>
              </div>
           </form>
            ) : (
              <form className='add_trajet' /*onSubmit={handleAddTrajet}*/>  
                <div>
                    <label>Lier à l'événement :</label>
                    <select 
                        name="id_event" 
                        value={formData.id_event} 
                        onChange={handleChange} 
                        required
                    >
                        <option value="">-- Choisir un événement --</option>
                        {listeEvenements.map((ev) => {
                            // Traitement de la date
                            const d = new Date(ev.date_deb);
                            // On n'affiche que la date car le JSON ne contient pas l'heure
                            const dateStr = !isNaN(d) ? d.toLocaleDateString('fr-FR') : ev.date_deb;
                            
                            return (
                              <option key={ev.id_event} value={ev.id_event}>
                                {ev.nom} ({dateStr})
                              </option>
                            )
                        })}
                    </select>
                </div>
                <div className='effectue_trajet'>
                  <p>Qui effectue le trajet : </p>
                  <div>
                    <input 
                        type="radio" id="aidant" name="effectue" value="aidant" 
                        checked={formData.effectue === 'aidant'} 
                        onChange={handleChange}
                    />
                    <label htmlFor="aidant">Aidant</label>
                  </div>
                  <div>
                    <input 
                        type="radio" id="externe" name="effectue" value="externe" 
                        checked={formData.effectue === 'externe'} 
                        onChange={handleChange}
                    />
                    <label htmlFor="externe">Société Externe :</label> 
                  </div> 
                </div>
                {formData.effectue === 'externe' ? (
                    <div>
                        <label>Nom de la société :</label>
                        <input 
                            type="text" name="societe" placeholder="Ex: Taxi Ambulance"
                            value={formData.societe} onChange={handleChange} required 
                        />
                    </div>
                ) : (
                  <div>
                    <label>Aidant affecté :</label>
                    <select name="aidantAffecte" value={formData.aidantAffecte} onChange={handleChange} required>
                      <option value="demande">Envoyer une demande aux aidants :</option>
                      {membresFamille.map((personne) => (
                          <option key={personne.id} value={personne.id}>
                              {personne.prenom} {personne.nom}
                          </option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label>Date et heure du trajet :</label>
                  <input 
                    type="datetime-local" name="debut" 
                    value={formData.debut} onChange={handleChange} required 
                  />
                </div>
                <div>
                  <label>Lieu de départ :</label>
                  <input 
                    type="text" name="lieuDepart" placeholder="Ex: Maison"
                    value={formData.lieuDepart} onChange={handleChange} required 
                  />
                </div>
                <div>
                  <label>Lieu d'arrivée :</label>
                  <input 
                    type="text" name="lieuArrivee" placeholder="Ex: Centre ville"
                    value={formData.lieuArrivee} onChange={handleChange} required 
                  />
                </div>
                  <div>
                    <button type='button' className='btn_border' onClick={handleReset}>Réinitialiser</button>
                    <button type='submit' className='btn_blue'>Valider</button>
                </div>
              </form>
              
            )}
          </>
        )}
        
    </Slide>

    <PopUpConfirmation
        sentence={msgConfirmation}
        show={isShowConfirmation}
        setShow={setIsShowConfirmation}
    />

    <PopUpDelete
      toDelete={eventToDelete.title}
      handleDelete={() => handleRemoveRecurrenceEvent(eventToDelete.id_recurrence)}
      isOpen={popUpDeleteRecuOpen}
      onClose={() => setPopUpDeleteRecuOpen(false)}
    />

    <PopUpDelete
      toDelete={eventToDelete.title}
      handleDelete={() => handleRemoveEvent(eventToDelete.id)}
      isOpen={popUpDeleteOpen}
      onClose={() => setPopUpDeleteOpen(false)}
    />

    </>
  )
}

export default Agenda