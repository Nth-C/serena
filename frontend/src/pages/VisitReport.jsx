import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom';
import Slide from '../components/slide/Slide';

function LastVisitReport() {
  // 1. Déclaration des états
  const [rapports, setRapports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isNewRapportOpen, setIsNewRapportOpen] = useState(false);
  const [isNewMedicineOpen, setIsMedicineOpen] = useState(false);
  const [isNewPopupOpen, setIsPopupOpen] = useState(false);
  const [isDetailsReportOpen, setIsDetailsReportpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // ÉTATS POUR LE FORMULAIRE RAPPORT
  const [nomRapport, setNomRapport] = useState("");
  const [descRapport, setDescRapport] = useState("");

  // ÉTATS POUR LE FORMULAIRE MÉDICAMENT
  const [nameMedecine, setNameMedecine] = useState("");
  const [typeMedecine, setTypeMedecine] = useState("");
  const [initialStock, setInitialStock] = useState("");
  const [currentStock, setCurrentStock] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const apiUrl = import.meta.env.VITE_API_URL;

  // Toggles
  const toggleNewRapport = () => setIsNewRapportOpen(!isNewRapportOpen);
  const toggleNewMedicine = () => setIsMedicineOpen(!isNewMedicineOpen);
  const togglePopup = (e) => {
    if (e) e.preventDefault();
    setIsPopupOpen(!isNewPopupOpen);
  }
  const toggleDetailsReport = () => {
    setIsDetailsReportpen(!isDetailsReportOpen)
  }

  // FONCTIONS RESET
  const handleResetRapport = () => {
    setNomRapport("");
    setDescRapport("");
  };

  const handleResetMedecine = () => {
    setNameMedecine("");
    setTypeMedecine("");
    setInitialStock("");
    setCurrentStock("");
  };

  const fetchRapports = async () => {
    try {
      const response = await fetch(`${apiUrl}/?route=rapport/list`, {
        credentials: 'include'
      });
      const data = await response.json();

      if (data.error) throw new Error(data.error);
      setRapports(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur de chargement:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRapports();
  }, [apiUrl]);

  const handleSubmitRapport = async (e) => {
    e.preventDefault();

    const bodyData = {
      nom: nomRapport,
      description: descRapport
    };

    try {
      const response = await fetch(`${apiUrl}/?route=rapport/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(bodyData)
      });
      const result = await response.json();
      if (result.success) {
        setIsNewRapportOpen(false);
        handleResetRapport(); // On vide après succès
        fetchRapports();
      }
    } catch (err) {
      alert("Erreur lors de l'envoi");
    }
  };

  useEffect(() => {
    document.documentElement.classList.toggle('menu-active', isNewRapportOpen || isNewMedicineOpen);
  }, [isNewRapportOpen, isNewMedicineOpen]);



  return (
    <div className="last_visit_report">
      <div className="contener_report">
        <h1>Rapport de visite</h1>

        <div className="search_report">
          <input type="search" placeholder="Rechercher un rapport" />
          <div><img src="/icons/sort.svg" alt="" /><p>Trier par</p></div>
        </div>

        <div className="liste_report">
          {loading ? (
            <p>Chargement des rapports...</p>
          ) : rapports.length > 0 ? (
            rapports.map((rapport) => (
              <div className="report_case" key={rapport.id_rapport} onClick={toggleDetailsReport}>
                <div>
                  <h2>{rapport.nom || "Nom rapport"}</h2>
                  <p>
                    {new Date(rapport.date).toLocaleDateString('fr-FR', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })} à {rapport.heure ? rapport.heure.substring(0, 5) : "--:--"}
                  </p>
                  <p>{rapport.description}</p>
                </div>
                <img src="/icons/arrow_forward.svg" alt="Détails" />
              </div>
            ))
          ) : (
            <p className="aucun">Aucun rapport pour cette famille.</p>
          )}
        </div>
      </div>

      <button className="btn_add" onClick={toggleNewRapport}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
          <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
        </svg>
      </button>

      {/* Popup Médicaments */}
      {mounted && isNewPopupOpen && createPortal(
        <div className={`popup_report_add_medicament ${isNewPopupOpen ? 'popu-medi-active' : ''}`}>
          <div className="search_report">
            <div>
              <img src="/icons/arrow_back.svg" alt="" onClick={() => setIsPopupOpen(false)} />
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
              <div className="principal_infos"><p>Xanax</p></div>
              <div className="drop">
                <p>ddddddddddddddddddddddd</p>
                <div><button className="fill">Ajouter</button></div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Slide Médicament */}
      <Slide title={"Ajouter un médicament"} isOpen={isNewMedicineOpen} toggleOpen={toggleNewMedicine} zIndex={700}>
        <form className="new_medecine">
          <div>
            <label>Nom du médicament : </label>
            <input type="text" value={nameMedecine} onChange={(e) => setNameMedecine(e.target.value)} required />
          </div>
          <div>
            <label>Type de médicament : </label>
            <input type="text" value={typeMedecine} onChange={(e) => setTypeMedecine(e.target.value)} required />
          </div>
          <div>
            <label>Stock initiale du médicament : </label>
            <input type="number" value={initialStock} onChange={(e) => setInitialStock(e.target.value)} required />
          </div>
          <div>
            <label>Stock actuel du médicament :</label>
            <input type="number" value={currentStock} onChange={(e) => setCurrentStock(e.target.value)} required />
          </div>
          <div>
            <button type="button" className="btn_border" onClick={handleResetMedecine}>Réinitialiser</button>
            <button className="btn_blue">Ajouter</button>
          </div>
        </form>
      </Slide>

      {/* Slide Rapport */}
      <Slide title={"Créer un rapport de visite"} isOpen={isNewRapportOpen} toggleOpen={toggleNewRapport} zIndex={500}>
        <form className="add_report" onSubmit={handleSubmitRapport}>
          <div>
            <label>Nom du rapport : </label>
            <input
              type="text"
              value={nomRapport}
              onChange={(e) => setNomRapport(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Médicaments pris : </label>
            <button type="button" className="btn_blue add_medi" onClick={togglePopup}>Ajouter médicament</button>
          </div>
          <div>
            <label>Information supplémentaire : </label>
            <textarea
              value={descRapport}
              onChange={(e) => setDescRapport(e.target.value)}
              required
            ></textarea>
          </div>
          <div>
            <button type="button" className="btn_border" onClick={handleResetRapport}>Réinitialiser</button>
            <button type="submit" className="btn_blue">Ajouter</button>
          </div>
        </form>
      </Slide>

      {/* Slide détailes des Rapport */}
      <Slide title={"Nom du rapport"} isOpen={isDetailsReportOpen} toggleOpen={toggleDetailsReport} zIndex={500}>
        <div className="details_report">
          <div>
            <p>fait part : </p>
            <p>Le : </p>
            <p>A : </p>
          </div>
          <div className="list-medic">
            <h2>Médicament pris : </h2>
            <ul>
              <li>1 doliprane</li>
              <li>3 xanax</li>
            </ul>
          </div>
          <div>
            <h2>Informations supplémentaire : </h2>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              sed do eiusmod tempor incididunt ut labore et dolore
              magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat. Duis aute irure dolor in reprehenderit in
              voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in
              culpa qui officia deserunt mollit anim id est laborum.</p>
          </div>
          <div>
            <button className="btn_red">Supprimer</button>
            <button className="btn_blue">Modifier</button>
          </div>
        </div>
      </Slide>
    </div>
  )
}

export default LastVisitReport;