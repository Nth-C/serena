// import { useEffect, useState } from 'react'

// function LastVisitReport() {
  
//   return (
//     <div className="last_visit_report">

//     </div>
//   )
// }


import { useState } from 'react'

function AddEvent() {
  const [formData, setFormData] = useState({
    titre: '',
    lieu: '',
    accompagnants: '', 
    debut: '',
    fin: '',
    recurrence: '',   
    description: ''
  })
  
  const [status, setStatus] = useState({ type: null, message: '' })

  const apiUrl = import.meta.env.VITE_API_URL

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
    
      const response = await fetch(`${apiUrl}/?route=evenement/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData) 
      })

      const result = await response.json()

      if (result.success) {
        setStatus({ type: 'success', message: 'Événement créé avec succès !' })
       
        setFormData({
          titre: '', lieu: '', accompagnants: '', debut: '', fin: '', recurrence: '', description: ''
        })
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
      <h1>Ajouter un Événement</h1>

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

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
        
        <div>
          <label>Titre :</label>
          <input 
            type="text" 
            name="titre" 
            value={formData.titre} 
            onChange={handleChange} 
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
            required 
          />
        </div>

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

        {}
        <div>
          <label>Accompagnants :</label>
          <input 
            type="text" 
            name="accompagnants" 
            placeholder="Ex: Jean, Marie"
            value={formData.accompagnants} 
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
          <label>Description :</label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            required 
          />
        </div>

        <button 
          type="submit" 
          style={{ backgroundColor: 'var(--blue)', color: 'var(--white)', padding: '10px', marginTop: '10px', cursor: 'pointer' }}
        >
          Enregistrer l'événement
        </button>

      </form>
    </div>
  )
}

export default AddEvent