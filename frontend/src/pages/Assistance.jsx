import { useEffect, useState } from 'react'
import FormulaireAides from '../components/formulaire_aide/formulaireAides'

function Assistance() {
  const [isAssisAidant, setIsAssisAidant] = useState(true)
  const [isAssisProche, setIsAssisProche] = useState(false)
  const [isAssisBesoin, setIsAssisBesoin] = useState(false)
  const [isDejaFait, setIsDejaFait] = useState(false)


  return (
    <div className="assistance">

      {/* selecteurs haut de page */}
      { !isDejaFait ? (
        <>
        <div className='container_assistance'>
        <div className='switch_assis_categorie'>
          <button className={!isAssisProche && !isAssisBesoin ? 'active' : ''} onClick={() => {
            setIsAssisAidant(true)
            setIsAssisProche(false);
            setIsAssisBesoin(false);
          }}>1. L'aidant</button>
          <button className={!isAssisAidant && !isAssisBesoin ? 'active' : ''} onClick={() => {
            setIsAssisAidant(false)
            setIsAssisProche(true);
            setIsAssisBesoin(false);
          }}>2. L'aidé</button>
          <button className={!isAssisAidant && !isAssisProche ? 'active' : ''} onClick={() => {
            setIsAssisAidant(false)
            setIsAssisProche(false);
            setIsAssisBesoin(true);
          }}>3. Besoins</button>
        </div>
      </div>
      <h1>Simulateur d'aides disponible</h1>
        </>
      ) : (
        <>
        <h1>Liste des aides au quel vous avez le droit</h1>
        </>
      )}
      <form action="">
        <FormulaireAides 
          isAssisAidant={isAssisAidant}
          isAssisProche={isAssisProche}
          isDejaFait={isDejaFait}
        />
      </form>
    </div>
  )
}

export default Assistance