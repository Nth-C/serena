import { useEffect, useState } from 'react'
import FormulaireAides from '../components/formulaire_aide/FormulaireAides'

function Assistance() {
  const [step, setStep] = useState(1);
  const [isDejaFait, setIsDejaFait] = useState(false);


  return (
    <div className="assistance">

      {/* selecteurs haut de page */}
      { !isDejaFait ? (
        <>
        <div className='container_assistance'>
        <div className='switch_assis_categorie'>
          <button className={step >= 1 ? 'active' : ''} onClick={() => setStep(1)} disabled>1. L'aidant</button>
          <button className={step >= 2 ? 'active' : ''} onClick={() => setStep(2)} disabled>2. L'aidé</button>
          <button className={step >= 3 ? 'active' : ''} onClick={() => setStep(3)} disabled>3. Besoins</button>
        </div>
      </div>
      <h1>Simulateur d'aides disponible</h1>
        </>
      ) : (
        <>
        <h1>Liste des aides auxquelles vous avez droit</h1>
        </>
      )}
      <form action="">
        <FormulaireAides 
        step={step} 
        setStep={setStep} 
        isDejaFait={isDejaFait} 
        setIsDejaFait={setIsDejaFait}
        />
      </form>
    </div>
  )
}

export default Assistance