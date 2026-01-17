import { useEffect, useState } from 'react'
import FormulaireAides from '../components/formulaire_aide/FormulaireAides'
import AssistanceDisponnible from './AssistanceDisponnible'

function Assistance() {
  const [step, setStep] = useState(1);
  const [isDejaFait, setIsDejaFait] = useState(false);
  const [aidesTrouvees, setAidesTrouvees] = useState([]);

  const apiUrl = import.meta.env.VITE_API_URL;

  // Fonction pour envoyer les données au PHP
  const handleFinaliser = async (formData) => {
    try {
      const response = await fetch(`${apiUrl}/?route=aides/calculer`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      setAidesTrouvees(data);
      setIsDejaFait(true);
    } catch (err) {
      console.error("Erreur de connexion au serveur", err);
    }
  };

  const resetForm = () => {
    setIsDejaFait(false);
    setStep(1);
    setAidesTrouvees([]);
  };

  return (
    <div className="assistance">
      { !isDejaFait ? (
        <>
          <div className='container_assistance'>
            <div className='switch_assis_categorie'>
              <button className={step >= 1 ? 'active' : ''} disabled>1. L'aidant</button>
              <button className={step >= 2 ? 'active' : ''} disabled>2. L'aidé</button>
              <button className={step >= 3 ? 'active' : ''} disabled>3. Besoins</button>
            </div>
          </div>
          <h1>Simulateur d'aides disponible</h1>
        </>
      ) : (
        <>
          <h1>Liste des aides auxquelles vous avez droit</h1>
        </>
      )}

      {/* On garde ta structure avec la balise form */}
      <form action="">
        <FormulaireAides 
          step={step} 
          setStep={setStep} 
          isDejaFait={isDejaFait} 
          onFinaliser={handleFinaliser} 
        />
      </form>

      {isDejaFait && (
        <AssistanceDisponnible 
          aides={aidesTrouvees} 
          resetForm={resetForm} 
        />
      )}
    </div>
  )
}

export default Assistance