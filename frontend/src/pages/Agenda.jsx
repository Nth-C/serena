import { useEffect, useState } from 'react'
import Slide from '../components/slide/Slide';

function AddEvent() {
  const [newEventOpen, setNewEventOpen] = useState(false)
  
  const [isTrajet, setIsTrajet] = useState(false)
  const [membresFamille, setMembresFamille] = useState([]) 

  const toggleNewEvent = () => {
    setNewEventOpen(!newEventOpen)
  }

  const [formData, setFormData] = useState({
    titre: '',
    lieu: '',
    accompagnants: '', 
    debut: '',
    fin: '',
    recurrence: '',   
    description: '',

    effectue: '',
    aidantAffecte: '',
    societe: '',
    lieuDepart: '',
    lieuArrivee: ''
  })

  // useEffect(() => { console.log(formData) }, [formData]); // Debug
  
  const [status, setStatus] = useState({ type: null, message: '' })

  const apiUrl = import.meta.env.VITE_API_URL

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

    try {
      // NOTE : Si c'est un trajet, tu voudras peut-être changer la route ici ?
      const response = await fetch(`${apiUrl}/?route=evenement/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData) 
      })

      const result = await response.json()

      if (result.success) {
        setStatus({ type: 'success', message: 'Enregistré avec succès !' })
        // Reset du formulaire...
        setFormData({
          titre: '', lieu: '', accompagnants: '', debut: '', fin: '', recurrence: '', description: '',
          effectue: '', aidantAffecte: '', societe: '', lieuDepart: '', lieuArrivee: ''
        })
        setNewEventOpen(false); // On ferme le slide après succès
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

      <button className="btn_add" onClick={toggleNewEvent}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg></button>

      <Slide
        title={"Nouveau"} 
        isOpen={newEventOpen} 
        toggleOpen={toggleNewEvent}
        validOnHeader={true}
        handlerValid={handleSubmit}
      >
          <div className='switch_event'>
            <button className={!isTrajet ? 'active' : ''} onClick={() => setIsTrajet(false)} >Événement</button>
            <button className={isTrajet ? 'active' : ''} onClick={() => setIsTrajet(true)} >Trajet</button>
          </div>

          <form className='add_event'>  
          {!isTrajet ?(
            <>
            <div>
              <label>Titre :</label>
              <input 
                type="text" 
                name="titre" 
                value={formData.titre} 
                onChange={handleChange}
                placeholder="Ex: Rendez-vous médical"
                required 
              />
            </div>

            <div>
              <label>Lieu :</label>
              <input 
                type="text" 
                name="lieu" 
                value={formData.lieu} 
                onChange={handleChange} 
                placeholder="Ex: 67 Rue du Skibidi, Agartha 38850"
                required 
              />
            </div>

            {/* --- CORRECTION ICI : INPUT REMPLACÉ PAR SELECT --- */}
            <div>
              <label>Accompagnants :</label>
              <select 
                name="accompagnants" 
                value={formData.accompagnants} 
                onChange={handleChange}
                required
              >
                <option value="">-- Choisir un accompagnant --</option>
                {membresFamille.map((personne) => (
                    <option key={personne.id} value={personne.id}>
                        {personne.prenom} {personne.nom}
                    </option>
                ))}
              </select>
            </div>
            {/* ------------------------------------------------ */}

            <div>
              <label>Début :</label>
              <input 
                type="datetime-local" 
                name="debut" 
                value={formData.debut} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div>
              <label>Fin :</label>
              <input 
                type="datetime-local" 
                name="fin" 
                value={formData.fin} 
                onChange={handleChange} 
                required 
              />
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
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                required 
              />
            </div>
            </>
          ) : (
            <>
            <div className='effectue_trajet'>
              <div>
                {/* Attention à ajouter value="aidant" sinon le radio ne marche pas bien */}
                <input type="radio" id="aidant" name="effectue" value="aidant" onChange={handleChange}/>
                <label htmlFor="aidant">Aidant</label>
              </div>
              <div>
                <input type="radio" id="externe" name="effectue" value="externe" onChange={handleChange}/>
                <label htmlFor="externe">Société Externe</label> 
              </div> 
            </div>

            <div>
              <label>Qui effectue le trajet :</label>
              <select name="aidantAffecte" value={formData.aidantAffecte} onChange={handleChange} required>
                <option value="">Choisir...</option>
                {/* Tu peux aussi réutiliser membresFamille ici si besoin */}
                {membresFamille.map((personne) => (
                    <option key={personne.id} value={personne.id}>
                        {personne.prenom} {personne.nom}
                    </option>
                ))}
              </select>
            </div>

            <div>
              <label>Lieu de départ :</label>
              <input 
                type="text" 
                name="lieuDepart" /* CORRIGÉ : c'était 'accompagnants' */
                placeholder="Ex: Maison"
                value={formData.lieuDepart} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div>
              <label>Lieu d'arrivée :</label>
              <input 
                type="text" 
                name="lieuArrivee" /* CORRIGÉ : c'était 'accompagnants' */
                placeholder="Ex: Centre ville"
                value={formData.lieuArrivee} 
                onChange={handleChange} 
                required 
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