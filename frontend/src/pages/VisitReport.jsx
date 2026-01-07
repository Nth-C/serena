import { useEffect, useState } from 'react'
import Slide from '../components/slide/Slide';

function LastVisitReport() {

  const popup = document.querySelector('.popup_report_add_medicament');

  // ajout rapport
  const [isNewRapportOpen, setIsNewRapportOpen] = useState(false) // page

  //ajout méidicament
  const [isNewMedicineOpen, setIsMedicineOpen] = useState(false) // page

  //ajout médicament popup
  const [isNewPopupOpen, setIsPopupOpen] = useState(false) // page


  // fonction pour ouvrir/fermer le newMedecine
  const toggleNewRapport = () => {
    setIsNewRapportOpen(!isNewRapportOpen)
  }

  const toggleNewMedicine = () => {
    setIsMedicineOpen(!isNewMedicineOpen)
  }

  const togglePopup = () => {
    setIsPopupOpen(!isNewPopupOpen)
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

  useEffect(() => {
    if (isNewPopupOpen) {
      popup.classList.add('popu-medi-active');
    } else {
      popup.classList.remove('popu-medi-active');
    }
  }, [isNewPopupOpen]);



  return (
    <div className="last_visit_report">
      <div className="contener_report">
        <h1>Rapport de visite</h1>

        <div className="search_report">
          <input type="search" placeholder="Rechercher un rapport" />
          <div>
            <img src="/icons/sort.svg" alt="" />
            <p>Tier par</p>
          </div>
        </div>

        <div className="liste_report">
          <div className="report_case">
            <div>
              <h2>Nom rapport</h2>
              <p>25 décembre 2025 | 06:07</p>
              <p>Fait par john</p>
            </div>
            <img src="/icons/arrow_forward.svg" alt="" />
          </div>
        </div>



      </div>

      <button className="btn_add" onClick={toggleNewRapport}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" /></svg></button>

      <div className="popup_report_add_medicament">

        <div className="search_report">
          <div>
            <img src="/icons/arrow_back.svg" alt="" onClick={togglePopup} />
            <input type="search" placeholder="Rechercher un rapport" />
          </div>

          <div>
            <img src="/icons/sort.svg" alt="" />
            <p>Tier par</p>
          </div>
        </div>

        <button onClick={toggleNewMedicine} className="btn_blue">Ajouter un nouveau médicament dans la liste</button>

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
      </div>

      <Slide title={"Ajouter un médicament"} isOpen={isNewMedicineOpen} toggleOpen={toggleNewMedicine}>
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
            <button className="btn_border">Reinistialiser</button>
            <button className="btn_blue">Ajouter</button>
          </div>
        </form>
      </Slide>

      <Slide title={"Créer un rapport de visite"} isOpen={isNewRapportOpen} toggleOpen={toggleNewRapport}>

        <form className="add_report">
          <div>
            <label>Nom du rapport : </label>
            <input type="text" name="nom_aide" required />
          </div>
          <div>
            <label>Médicaments pris : </label>
            <div className="list_medicament_report">
              <div>
                <p>Xanax</p>
                <input type="text" placeholder="Dosage" />
              </div>
              <div>
                <p>Cachets</p>
                <img src="/icons/bin.svg" alt=""/>
              </div>
            </div>
            <button className="btn_blue add_medi" onClick={togglePopup}>Ajouter médicament</button>
          </div>
          <div>
            <label>Information supplémentaire : </label>
            <textarea name="description" required></textarea>
          </div>
          <div>
            <button className="btn_border">Réinistialiser</button>
            <button type="submit" className="btn_blue">Ajouter</button>
          </div>
        </form>
      </Slide>

    </div>
  )
}
export default LastVisitReport