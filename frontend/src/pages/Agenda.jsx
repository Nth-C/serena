import { useEffect, useState } from 'react'
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

  const [date, setDate] = useState(new Date())
  const [popUpDateOpen, setPopUpDateOpen] = useState(false)
  const [isCalendarWeek, setIsCalendarWeek] = useState(false)

  // popup confirmation
  const [isShowConfirmation , setIsShowConfirmation] = useState(false)
  const [msgConfirmation , setMsgConfirmation] = useState('')

  // popup delete
  const [popUpDeleteOpen , setPopUpDeleteOpen] = useState(false)
  const [eventToDelete , setEventToDelete] = useState({
    id: null,
    title: null,
  })
  
  const apiUrl = import.meta.env.VITE_API_URL

  // --- Initialisation du State ---
  const [formData, setFormData] = useState({
    // Champs Événement
    titre: '',
    lieu: '',
    accompagnants: '', 
    debut: '',
    fin: '',
    recurrence: '',   
    description: '',

    // Champs Trajet
    effectue: 'aidant',  // Valeur par défaut
    societe: '',         // Texte
    aidantAffecte: '',
    lieuDepart: '',
    lieuArrivee: '',
    id_event: ''         // ID de l'événement lié
  })

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

  // --- Handler pour l'ÉVÉNEMENT ---
  const handleAddEvent = async (e) => {
      if (e) e.preventDefault(); // Empêche le rechargement si appelé via un bouton type submit

      // Préparation du payload spécifique à l'événement
      const payload = {
          titre: formData.titre,
          lieu: formData.lieu,
          accompagnants: formData.accompagnants,
          debut: formData.debut,
          fin: formData.fin,
          recurrence: formData.recurrence,
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
      recurrence: '',
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
  }, [listeEvenements, date, isCalendarWeek]);

  return (
    <> 
    <div className="agenda">

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
      <button className="btn_add" onClick={() => setNewEventOpen(true)}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
      </button>

      <Slide
        title={isTrajet ? "Nouveau Trajet" : "Nouvel Événement"} 
        isOpen={newEventOpen} 
        toggleOpen={() => setNewEventOpen(false)}

      >
          {/* Switcher Event / Trajet */}
          <div className='switch_event'>
            <button type="button" className={!isTrajet ? 'active' : ''} onClick={() => setIsTrajet(false)} >Événement</button>
            <button type="button" className={isTrajet ? 'active' : ''} onClick={() => setIsTrajet(true)} >Trajet</button>
          </div>

          {!isTrajet ? (
            /* =========================================
               PARTIE ÉVÉNEMENT
               ========================================= */
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
                  <option value="hebdo">Hebdomadaire</option>
                  <option value="mensuel">Mensuel</option>
                </select>
              </div>

              <div>
                <label>Notes :</label>
                <textarea name="description" value={formData.description} onChange={handleChange} />
              </div>

              <div>
                  <button type='button' className='btn_border' onClick={() => {
                    resetFormEvent() 
                    setNewEventOpen(false)
                  }}>Annuler</button>
                  <button type='submit' className='btn_blue'>Valider</button>
              </div>
           </form>
          ) : (
            /* =========================================
               PARTIE TRAJET
               ========================================= */
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
                  <label htmlFor="externe">Société Externe</label> 
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
                    <option value="demande">Envoyer une demande aux aidants</option>
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
                  <button type='button' className='btn_border' onClick={() => {
                    resetFormTrajet()
                    setNewEventOpen(false)
                  }}>Annuler</button>
                  <button type='submit' className='btn_blue'>Valider</button>
              </div>
           </form>
          )}
      </Slide>

    </div>

    <PopUpSelectDate 
      isOpen={popUpDateOpen}
      onClose={() => setPopUpDateOpen(false)}
      handlerValid={setDate}
      startDate={date}
    />
    
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

    <PopUpConfirmation
        sentence={msgConfirmation}
        show={isShowConfirmation}
        setShow={setIsShowConfirmation}
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