import { useEffect, useState, useRef } from 'react'
import Slide from '../components/slide/Slide';
import { getFormatDate } from '../utils/utils';

import Calendar from '../components/calendar/Calendar'
import PopUpSelectDate from '../components/pop_up_select_date/PopUpSelectDate'



function Agenda() {
  const [newEventOpen, setNewEventOpen] = useState(false)
  const [isTrajet, setIsTrajet] = useState(false)
  const [membresFamille, setMembresFamille] = useState([]) 

  const [date, setDate] = useState(new Date()) // new Date renvoie la date actuelle
  
  const [status, setStatus] = useState({ type: null, message: '' })
  const apiUrl = import.meta.env.VITE_API_URL

  // Initialisation du formulaire
  const [formData, setFormData] = useState({
    titre: '',
    lieu: '',
    accompagnants: '', 
    debut: '',
    fin: '',
    recurrence: '',   
    description: '',

    // Champs spécifiques Trajet
    effectue: '',        // 'aidant' ou 'externe'
    aidantAffecte: '',   // ID de l'aidant (UUID)
    societe: '',         // Nom de la société
    lieuDepart: '',
    lieuArrivee: ''
  })




  const toggleNewEvent = () => {
    setNewEventOpen(!newEventOpen)
  }

  // --- Chargement de la liste des membres ---
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault() 
    setStatus({ type: null, message: '' })

    // --- NETTOYAGE DES DONNÉES AVANT ENVOI (Fix PostgreSQL) ---
    const payload = { ...formData };

    // Si on est en mode Trajet, on peut nettoyer les champs Événement inutiles
    // (Optionnel, mais propre)
    if (isTrajet) {
        payload.titre = "Trajet"; // Exemple de titre par défaut
    }

    // Convertir les chaînes vides ("") en NULL pour éviter l'erreur UUID "0"
    Object.keys(payload).forEach(key => {
        if (payload[key] === '') {
            payload[key] = null;
        }
    });

    try {
      // Note: Assurez-vous que votre PHP gère bien le type (trajet vs event)
      const response = await fetch(`${apiUrl}/?route=evenement/add`, {
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
          effectue: '', aidantAffecte: '', societe: '', lieuDepart: '', lieuArrivee: ''
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
    <div className="agenda">

      {/* selecteurs haut de page */}
      <div className='container_date'>
        <button>
          <h1>{getFormatDate(date)}</h1>
          <div>
            <img src="/icons/arrows-extend.svg" alt="" />
          </div>
        </button>
        <div className='switch_calendar'>
          <button>Jour</button>
          <button>Semaine</button>
        </div>
      </div>

      <PopUpSelectDate 
      
      />

      <Calendar 
        date={date}
      />

      {/* message d'erreur */}
      {status.message && (
        <div style={{ 
          padding: '10px', 
          marginBottom: '15px',
          backgroundColor: status.type === 'error' ? '#f8d7da' : '#d4edda',
          color: status.type === 'error' ? '#721c24' : '#155724'
        }}>
          {status.message}
        </div>
      )}

      {/* ajouter un evenement */}
      <button className="btn_add" onClick={toggleNewEvent}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
      </button>

      <Slide
        title={"Nouveau"} 
        isOpen={newEventOpen} 
        toggleOpen={toggleNewEvent}
        validOnHeader={true}
        handlerValid={handleSubmit}
      >
          <div className='switch_event'>
            <button type="button" className={!isTrajet ? 'active' : ''} onClick={() => setIsTrajet(false)} >Événement</button>
            <button type="button" className={isTrajet ? 'active' : ''} onClick={() => setIsTrajet(true)} >Trajet</button>
          </div>

          <form className='add_event'>  
          {!isTrajet ? (
            /* --- FORMULAIRE ÉVÉNEMENT --- */
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

            <div>
              <label>Début :</label>
              <input type="datetime-local" name="debut" value={formData.debut} onChange={handleChange} required />
            </div>

            <div>
              <label>Fin :</label>
              <input type="datetime-local" name="fin" value={formData.fin} onChange={handleChange} required />
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
            /* --- FORMULAIRE TRAJET --- */
            <>
            {/* Boutons Radio */}
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
            
            {/* Note : Pensez à ajouter des champs Date/Heure pour le trajet si nécessaire */}
            </>
          )}
          </form>
      </Slide>

    </div>
  )
}

export default Agenda