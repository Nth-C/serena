import { useEffect, useState } from 'react'
import Slide from '../components/slide/Slide';

function LastVisitReport() {
  // ajout rapport
  const [isNewRapportOpen, setIsNewRapportOpen] = useState(false) // page
  const [isNewMedicineOpen, setIsMedicineOpen] = useState(false) // page

  // fonction pour ouvrir/fermer le newMedecine
  const toggleNewRapport = () => {
    setIsNewRapportOpen(!isNewRapportOpen)
  }

  const toggleNewMedicine = () => {
    setIsMedicineOpen(!isNewMedicineOpen)
  }

  useEffect(() => {
    if (isNewRapportOpen) {
      document.documentElement.classList.add('menu-active');
    } else {
      document.documentElement.classList.remove('menu-active');
    }
  }, [isNewRapportOpen]);

  useEffect(() => {
    if (isNewMedicineOpen) {
      document.documentElement.classList.add('menu-active');
    } else {
      document.documentElement.classList.remove('menu-active');
    }
  }, [isNewMedicineOpen]);



  return (
    <div className="last_visit_report">
      <h1>Rapport de visite</h1>

      <div>
        <input type="search" />
        <div>
          <img src="/icons/sort.svg" alt="" />
          <p>Tier par</p>
        </div>
      </div>

      <div>
        <div>
          <h2>Nom rapport</h2>
          <p>25 décembre 2025 | 06:07</p>
          <p>Fait par john</p>
        </div>
        <img src="/icons/arrow_forward.svg" alt="" />
      </div>

      <button className="btn_add_report" onClick={toggleNewRapport}> test<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" /></svg></button>

      <div>
        <button onClick={toggleNewMedicine}>Ajouter un nouveau médicament dans la liste</button>

        <div className="list">

          <div className="container_medecine">
            <div className="principal_infos" >
              <div>
                <p>Xanax</p>
                <p></p>
              </div>
            </div>

            <div className="drop">
              <p>ddddddddddddddddddddddd</p>
              <div>
                <button className="fill">Ajouter</button>
              </div>
            </div>
          </div>


        </div>


        <Slide title={"Ajouter un médicament"} isOpen={isNewMedicineOpen} onClickNewMedecine={toggleNewMedicine}>
          <form className="new_medecine">
            <div>
              <label>Nom du médicament : </label>
              <input
                type="text"
                required
              />
            </div>
            <div>
              <label>Type de médicament : </label>
              <input
                type="text"
                required
              />
            </div>
            <div>
              <label>Stock initiale du médicament : </label>
              <input
                type="number"
                required
              />
            </div>
            <div>
              <label>Stock actuel du médicament :</label>
              <input
                type="number" required
              />
            </div>
            <div>
              <button className="simple">Reinistialiser</button>
              <button className="fill">Ajouter</button>
            </div>
          </form>
        </Slide>

      </div>

      <Slide title={"Créer un rapport de visite"} isOpen={isNewRapportOpen} onClickNewMedecine={toggleNewRapport}>

        <form>
          <div>
            <label>Nom du rapport : </label>
            <input type="text" name="nom_aide" required />
          </div>
          <div>
            <label>Médicaments pris : </label>
            <div>
              <div>
                <p>Xanax</p>
                <input type="text" placeholder="Dosage" />
              </div>
              <div>
                <p>Cachets</p>
                <img src="/icons/bin.svg" alt="" />
              </div>
              <button>Ajouter médicament</button>
            </div>
          </div>
          <div>
            <label>Information supplémentaire : </label>
            <textarea name="description" required></textarea>
          </div>
          <div>
            <button>Réinistialiser</button>
            <button type="submit">Ajouter</button>
          </div>
        </form>
      </Slide>

    </div>
  )
}
export default LastVisitReport