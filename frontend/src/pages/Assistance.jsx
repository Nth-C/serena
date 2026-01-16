import { useEffect, useState } from 'react'
import FormulaireAides from '../components/formulaire_aide/FormulaireAides'
import AssistanceDisponnible from './AssistanceDisponnible' // Importe ton composant de liste

function Assistance() {
  const [step, setStep] = useState(1);
  const [isDejaFait, setIsDejaFait] = useState(false);
  const [aidesTrouvees, setAidesTrouvees] = useState([]);

  const handleFinaliser = async (formData) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/?route=aides/calculer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      setAidesTrouvees(data);
      setIsDejaFait(true);
    } catch (err) {
      console.error("Erreur de calcul:", err);
    }
  };

  return (
    <div className="assistance">
      {!isDejaFait ? (
        <>
          <div className='container_assistance'>
            <div className='switch_assis_categorie'>
              <button className={step >= 1 ? 'active' : ''}>1. L'aidant</button>
              <button className={step >= 2 ? 'active' : ''}>2. L'aidé</button>
              <button className={step >= 3 ? 'active' : ''}>3. Besoins</button>
            </div>
          </div>
          <h1>Simulateur d'aides disponible</h1>
          <FormulaireAides 
            step={step} 
            setStep={setStep} 
            setIsDejaFait={setIsDejaFait}
            onFinaliser={handleFinaliser} // On passe la fonction de calcul
          />
        </>
      ) : (
        <>
          <h1>Liste des aides auxquelles vous avez droit</h1>
          <AssistanceDisponnible 
            aides={aidesTrouvees} 
            recommencer={() => { setIsDejaFait(false); setStep(1); }} 
          />
        </>
      )}
    </div>
  )
}