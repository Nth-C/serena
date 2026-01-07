import { useEffect, useState } from 'react'
import Slide from '../components/slide/Slide';

function LastVisitReport() {
  // États pour les données
  const [rapports, setRapports] = useState([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  // États pour les fenêtres coulissantes (Slides) et Popups
  const [isNewRapportOpen, setIsNewRapportOpen] = useState(false);
  const [isNewMedicineOpen, setIsMedicineOpen] = useState(false);
  const [isNewPopupOpen, setIsPopupOpen] = useState(false);

  // Fonctions de bascule (Toggle)
  const toggleNewRapport = () => setIsNewRapportOpen(!isNewRapportOpen);
  const toggleNewMedicine = () => setIsMedicineOpen(!isNewMedicineOpen);
  const togglePopup = (e) => {
    if (e) e.preventDefault(); // Empêche la soumission du formulaire si cliqué dedans
    setIsPopupOpen(!isNewPopupOpen);
  };

  // 1. Charger les rapports de la famille active au montage du composant
  useEffect(() => {
    const fetchRapports = async () => {
      try {
        const response = await fetch(`${apiUrl}/?route=famille/reports`, {
          credentials: 'include' // Obligatoire pour envoyer le cookie de session PHP
        });
        const data = await response.json();
        
        if (data.error) throw new Error(data.error);
        setRapports(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Erreur de chargement des rapports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRapports();
  }, [apiUrl]);

  // Gestion des classes CSS pour le menu actif
  useEffect(() => {
    const active = isNewRapportOpen || isNewMedicineOpen;
    document.documentElement.classList.toggle('menu-active', active);
  }, [isNewRapportOpen, isNewMedicineOpen]);

  // 2. Fonction pour envoyer un nouveau rapport
  const handleSubmitRapport = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const bodyData = {
      description: formData.get('description'),
      nom_aide: formData.get('nom_aide')
      // Les IDs (famille et personne) sont gérés par le serveur via la session
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
        alert("Rapport ajouté !");
        setIsNewRapportOpen(false);
        e.target.reset();
        // Recharger la liste
        window.location.reload(); 
      }
    } catch (err) {
      alert("Erreur lors de l'envoi du rapport.");
    }
  };

  return (
    <div className="last_visit_report">
      <div className="contener_report">
        <h1>Rapport de visite</h1>

        <div className="search_report">
          <input type="search" placeholder="Rechercher un rapport" />
          <div>
            <img src="/icons/sort.svg" alt="" />
            <p>Trier par</p>
          </div>
        </div>

        <div className="liste_report">
          {loading ? (
            <p>Chargement des rapports...</p>
          ) : rapports.length > 0 ? (
            rapports.map((rapport) => (
              <div className="report_case" key={rapport.id_rapport}>
                <div>
                  <h2>Rapport de {rapport.auteur || "Auteur inconnu"}</h2>
                  <p>{new Date(rapport.date).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'long', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
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
      <div className={`popup_report_add_medicament ${isNewPopupOpen ? 'popu-medi-active' : ''}`}>
        <div className="search_report">
          <div>
            <img src="/icons/arrow_back.svg" alt="Retour" onClick={togglePopup} />
            <input type="search" placeholder="Rechercher un médicament" />
          </div>
        </div>
        <button onClick={toggleNewMedicine} className="btn_blue">Ajouter un nouveau médicament</button>
        <div className="list">
          <div className="container_medecine">
            <div className="principal_infos">
              <p>Xanax</p>
            </div>
            <div className="drop">
              <button className="fill">Ajouter</button>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Nouveau Médicament */}
      <Slide title={"Ajouter un médicament"} isOpen={isNewMedicineOpen} toggleOpen={toggleNewMedicine}>
        <form className="new_medecine">
          <div><label>Nom : </label><input type="text" required /></div>
          <div><label>Type : </label><input type="text" required /></div>
          <div><label>Stock initial : </label><input type="number" required /></div>
          <div><label>Stock actuel : </label><input type="number" required /></div>
          <div>
            <button type="button" className="btn_border" onClick={toggleNewMedicine}>Annuler</button>
            <button type="submit" className="btn_blue">Ajouter</button>
          </div>
        </form>
      </Slide>

      {/* Slide Nouveau Rapport */}
      <Slide title={"Créer un rapport de visite"} isOpen={isNewRapportOpen} toggleOpen={toggleNewRapport}>
        <form className="add_report" onSubmit={handleSubmitRapport}>
          <div>
            <label>Nom du rapport : </label>
            <input type="text" name="nom_aide" required />
          </div>
          <div>
            <label>Médicaments pris : </label>
            <div className="list_medicament_report">
              <div><p>Xanax</p><input type="text" placeholder="Dosage" /></div>
            </div>
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