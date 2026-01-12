import { useEffect, useState, useRef } from 'react'
import Slide from '../components/slide/Slide';
import { getFormatDate } from '../utils/utils';

import Calendar from '../components/calendar/Calendar'
import PopUpSelectDate from '../components/pop_up_select_date/PopUpSelectDate'

function Agenda() {
  const [newEventOpen, setNewEventOpen] = useState(false)
  const [isTrajet, setIsTrajet] = useState(false)
  const [membresFamille, setMembresFamille] = useState([]) 
  
  // State pour stocker la liste des événements
  const [listeEvenements, setListeEvenements] = useState([])

  const [date, setDate] = useState(new Date())
  const [popUpDateOpen, setPopUpDateOpen] = useState(false)
  const [isCalendarWeek, setIsCalendarWeek] = useState(false)
  const [status, setStatus] = useState({ type: null, message: '' })
  
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
    aidantAffecte: '',   // UUID
    societe: '',         // Texte
    lieuDepart: '',
    lieuArrivee: '',
    id_event: ''         // ID de l'événement lié
  })

  const toggleNewEvent = () => {
    setNewEventOpen(!newEventOpen)
  }

  // --- 1. Chargement des membres de la famille ---
  useEffect(() => {
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

    fetchMembres();
  }, [apiUrl]);

  // --- 2. Chargement des événements pour le select ---
  useEffect(() => {
    const fetchEvents = async () => {
      if (!newEventOpen) return;

      try {
        const response = await fetch(`${apiUrl}/?route=getevents`, {
            credentials: 'include' 
        });
        const data = await response.json()
        
        if (data.success) {
          // console.log("Events reçus:", data.evenements); // Debug
          setListeEvenements(data.evenements)
        }
      } catch (error) {
        console.error("Erreur chargement événements", error)
      }
    };

    fetchEvents();
  }, [apiUrl, newEventOpen]);

  // --- Gestion des changements dans les inputs ---
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // --- Soumission du formulaire ---
  const handleSubmit = async (e) => {
    e.preventDefault() 
    setStatus({ type: null, message: '' })

    // 1. Préparation du payload
    let payload = {};

    if (isTrajet) {
        payload = {
            date_deb: formData.debut,
            date_fin: formData.debut,
            lieu_dep: formData.lieuDepart,
            lieu_arr: formData.lieuArrivee,
            id_event: formData.id_event,
            aidant_id: formData.effectue === 'aidant' ? formData.aidantAffecte : null,
            societe: formData.effectue === 'externe' ? formData.societe : null
        };
    } else {
        payload = { ...formData };
    }

    // 2. Nettoyage des chaînes vides
    Object.keys(payload).forEach(key => {
        if (payload[key] === '') {
            payload[key] = null;
        }
    });

    // 3. Détermination de la route API
    const routeAction = isTrajet ? 'trajet/add' : 'evenement/add';

    try {
      const response = await fetch(`${apiUrl}/?route=${routeAction}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(payload) 
      })

      const result = await response.json()

      if (result.success) {
        setStatus({ type: 'success', message: 'Enregistré avec succès !' })
        
        // Reset du formulaire
        setFormData({
          titre: '', lieu: '', accompagnants: '', debut: '', fin: '', recurrence: '', description: '',
          effectue: 'aidant', aidantAffecte: '', societe: '', lieuDepart: '', lieuArrivee: '', id_event: ''
        })
        setNewEventOpen(false); 

      } else {
        setStatus({ type: 'error', message: result.error || 'Une erreur est survenue' })
      }

    } catch (error) {
      console.error("Erreur réseau:", error)
      setStatus({ type: 'error', message: "Impossible de contacter le serveur" })
    }
  }

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
      />

      {/* message d'erreur */}
      {status.message && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '15px',
          backgroundColor: status.type === 'error' ? '#f8d7da' : '#d4edda',
          color: status.type === 'error' ? '#721c24' : '#155724',
          borderRadius: '4px'
        }}>
          {status.message}
        </div>
      )}

      {/* ajouter un evenement */}
      <button className="btn_add" onClick={toggleNewEvent}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
      </button>

      <Slide
        title={isTrajet ? "Nouveau Trajet" : "Nouvel Événement"} 
        isOpen={newEventOpen} 
        toggleOpen={toggleNewEvent}
        validOnHeader={true}
        handlerValid={handleSubmit}
      >
          {/* Switcher Event / Trajet */}
          <div className='switch_event'>
            <button type="button" className={!isTrajet ? 'active' : ''} onClick={() => setIsTrajet(false)} >Événement</button>
            <button type="button" className={isTrajet ? 'active' : ''} onClick={() => setIsTrajet(true)} >Trajet</button>
          </div>

          <form className='add_event'>  
          
          {!isTrajet ? (
            /* =========================================
               PARTIE ÉVÉNEMENT
               ========================================= */
            <>
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
                value={formData.lieu} onChange={handleChange} required 
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
              <select name="recurrence" value={formData.recurrence} onChange={handleChange} required>
                <option value="">Choisir...</option>
                <option value="aucun">Aucune</option>
                <option value="hebdo">Hebdomadaire</option>
                <option value="mensuel">Mensuel</option>
              </select>
            </div>

            <div>
              <label>Notes :</label>
              <textarea name="description" value={formData.description} onChange={handleChange} required />
            </div>
            </>
          ) : (
            /* =========================================
               PARTIE TRAJET
               ========================================= */
            <>
            {/* CORRECTION ICI : Sélecteur adapté à ton JSON */}
            <div style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                <label style={{ fontWeight: 'bold', color: '#646cff' }}>Lier à l'événement :</label>
                <select 
                    name="id_event" 
                    value={formData.id_event} 
                    onChange={handleChange} 
                    required
                    style={{ border: "2px solid #646cff" }}
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

            {formData.effectue === 'aidant' && (
                <div>
                    <label>Quel aidant effectue le trajet ?</label>
                    <select name="aidantAffecte" value={formData.aidantAffecte} onChange={handleChange} required>
                        <option value="">-- Choisir un aidant --</option>
                        {membresFamille.map((personne) => (
                            <option key={personne.id} value={personne.id}>
                                {personne.prenom} {personne.nom}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {formData.effectue === 'externe' && (
                <div>
                    <label>Nom de la société :</label>
                    <input 
                        type="text" name="societe" placeholder="Ex: Taxi Ambulance"
                        value={formData.societe} onChange={handleChange} required 
                    />
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
            </>
          )}
          </form>
      </Slide>

    </div>

    <PopUpSelectDate 
      isOpen={popUpDateOpen}
      onClose={() => setPopUpDateOpen(false)}
      handlerValid={setDate}
      startDate={date}
    />
      
    </>
  )
}

export default Agenda