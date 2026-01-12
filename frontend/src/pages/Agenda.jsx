import { useEffect, useState } from 'react'
import Slide from '../components/slide/Slide';

function AddEvent() {
  const [newEventOpen, setNewEventOpen] = useState(false)
  const [isTrajet, setIsTrajet] = useState(false)
  const [membresFamille, setMembresFamille] = useState([]) 
  
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
    effectue: 'aidant',  // Valeur par défaut pour éviter les bugs d'affichage
    aidantAffecte: '',   // UUID
    societe: '',         // Texte
    lieuDepart: '',
    lieuArrivee: ''
  })

  const toggleNewEvent = () => {
    setNewEventOpen(!newEventOpen)
  }

  // --- Chargement des membres de la famille ---
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

    // 1. Copie des données
    const payload = { ...formData };

    // 2. Nettoyage : PostgreSQL déteste les chaînes vides "" pour les UUID
    // On les remplace par null
    Object.keys(payload).forEach(key => {
        if (payload[key] === '') {
            payload[key] = null;
        }
    });

    // 3. Détermination de la route API (Evenement OU Trajet)
    // Assurez-vous que votre PHP écoute bien sur ces deux routes
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
          effectue: 'aidant', aidantAffecte: '', societe: '', lieuDepart: '', lieuArrivee: ''
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
    <div className="ajout-evenement">

      {/* Affichage des messages Succès / Erreur */}
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

      {/* Bouton d'ouverture (+) */}
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
            {/* Choix Aidant ou Société */}
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

            {/* Affichage conditionnel : Liste Aidant */}
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

            {/* Affichage conditionnel : Input Société */}
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
                type="datetime-local" name="debut" // On réutilise le champ 'debut' pour la date du trajet
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
  )
}

export default AddEvent