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



  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const apiUrl = import.meta.env.VITE_API_URL;

  // Toggles
  const toggleNewRapport = () => setIsNewRapportOpen(!isNewRapportOpen);
  const toggleNewMedicine = () => setIsMedicineOpen(!isNewMedicineOpen);
  const togglePopup = (e) => {
    if (e) e.preventDefault(); // Empêche le submit du formulaire si cliqué
    setIsPopupOpen(!isNewPopupOpen);
  }

  // 2. Récupération des rapports
  useEffect(() => {
    const fetchRapports = async () => {
      try {
        const response = await fetch(`${apiUrl}/?route=famille/reports`, {
          credentials: 'include' // Indispensable pour la session PHP
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
    fetchRapports();
  }, [apiUrl]);

  // 3. Fonction d'envoi
  const handleSubmitRapport = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const bodyData = {
      description: formData.get('description'),
      nom_aide: formData.get('nom_aide')
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
        window.location.reload(); // Recharge pour voir le nouveau rapport
      }
    } catch (err) {
      alert("Erreur lors de l'envoi");
    }
  };

  // Effets CSS pour le menu actif
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
              <div className="report_case" key={rapport.id_rapport}>
                <div>
                  {/* auteur est récupéré via la jointure SQL dans le DAO */}
                  <h2>Rapport de {rapport.auteur || "Auteur inconnu"}</h2>
                  <p>{new Date(rapport.date).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}</p>
                  <p>{rapport.description}</p>
                </div>
                <img src="/icons/arrow_forward.svg" alt="Détails" />
              </div>
            ))
          ) : (
            <p>Aucun rapport pour cette famille.</p>
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
            <input type="search" placeholder="Rechercher un médicament" />
          </div>
        </div>
        <button onClick={toggleNewMedicine} className="btn_blue">Nouveau médicament</button>
        <div className="list">
          <div className="container_medecine">
            <div className="principal_infos"><p>Xanax</p></div>
            <div className="drop"><button className="fill">Ajouter</button></div>
          </div>
        </div>
      </div>,
      document.body
      )}

      {/* Slide Médicament */}
      <Slide title={"Ajouter un médicament"} isOpen={isNewMedicineOpen} toggleOpen={toggleNewMedicine} zIndex={700}>
        <form className="new_medecine">
          <div><label>Nom : </label><input type="text" required /></div>
          <div><label>Type : </label><input type="text" required /></div>
          <div><label>Stock initial : </label><input type="number" required /></div>
          <div><label>Stock actuel : </label><input type="number" required /></div>
          <div>
            <button type="button" className="btn_border" onClick={toggleNewMedicine}>Annuler</button>
            <button className="btn_blue">Ajouter</button>
          </div>
        </form>
      </Slide>

      {/* Slide Rapport */}
      <Slide title={"Créer un rapport de visite"} isOpen={isNewRapportOpen} toggleOpen={toggleNewRapport} zIndex={500}>
        <form className="add_report" onSubmit={handleSubmitRapport}>
          <div>
            <label>Nom de l'aidé : </label>
            <input type="text" name="nom_aide" required />
          </div>
          <div>
            <label>Médicaments pris : </label>
            <button type="button" className="btn_blue add_medi" onClick={togglePopup}>Ajouter médicament</button>
          </div>
          <div>
            <label>Information supplémentaire : </label>
            <textarea name="description" required></textarea>
          </div>
          <div>
            <button type="button" className="btn_border" onClick={toggleNewRapport}>Annuler</button>
            <button type="submit" className="btn_blue">Ajouter</button>
          </div>
        </form>
      </Slide>
    </div>
  )
}

export default LastVisitReport;