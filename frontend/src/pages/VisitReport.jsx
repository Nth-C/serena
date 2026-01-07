import { useEffect, useState } from 'react'
import Slide from '../components/slide/Slide';

function LastVisitReport() {
  const [rapports, setRapports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isNewRapportOpen, setIsNewRapportOpen] = useState(false);
  const [isNewMedicineOpen, setIsMedicineOpen] = useState(false);
  
  // URL de base de votre API définie dans vos variables d'environnement
  const apiUrl = import.meta.env.VITE_API_URL;

  // 1. Fonction pour charger les rapports de la famille active
  const fetchRapports = async () => {
    try {
      // On utilise la route centralisée et on inclut les credentials pour la session PHP
      const response = await fetch(`${apiUrl}/?route=famille/reports`, { 
        credentials: 'include' 
      }); 
      const data = await response.json();
      
      if (data.error) throw new Error(data.error);
      setRapports(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur de chargement :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRapports();
  }, []);

  // 2. Fonction pour envoyer le nouveau rapport lié à la famille active
  const handleSubmitRapport = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // id_personne et id_famille seront récupérés côté serveur via la session PHP
    const bodyData = {
      description: formData.get('description'),
      nom_aide: formData.get('nom_aide')
    };

    try {
      const response = await fetch(`${apiUrl}/?route=rapport/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Important pour identifier l'auteur et la famille
        body: JSON.stringify(bodyData)
      });

      const result = await response.json();

      if (result.success) {
        alert("Rapport ajouté !");
        setIsNewRapportOpen(false);
        e.target.reset();
        fetchRapports(); // Rafraîchit la liste pour voir le nouveau rapport
      } else {
        alert("Erreur : " + (result.error || "Échec de l'insertion"));
      }
    } catch (err) {
      alert("Erreur réseau : impossible de joindre le serveur.");
    }
  };

  const toggleNewRapport = () => setIsNewRapportOpen(!isNewRapportOpen);
  const toggleNewMedicine = () => setIsMedicineOpen(!isNewMedicineOpen);

  useEffect(() => {
    const active = isNewRapportOpen || isNewMedicineOpen;
    document.documentElement.classList.toggle('menu-active', active);
  }, [isNewRapportOpen, isNewMedicineOpen]);

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
            <p>Chargement...</p>
          ) : rapports.length > 0 ? (
            rapports.map((rapport) => (
              <div className="report_case" key={rapport.id_rapport}>
                <div>
                  {/* auteur est récupéré via la jointure SQL suggérée précédemment */}
                  <h2>Rapport de {rapport.auteur || "Auteur inconnu"}</h2>
                  <p>{new Date(rapport.date).toLocaleString('fr-FR')}</p>
                  <p>{rapport.description}</p>
                </div>
                <img src="/icons/arrow_forward.svg" alt="Détails" />
              </div>
            ))
          ) : (
            <p>Aucun rapport pour ce groupe.</p>
          )}
        </div>
      </div>

      <button className="btn_add" onClick={toggleNewRapport}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
          <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
        </svg>
      </button>

      {/* Slide Médicaments */}
      <Slide title={"Ajouter un médicament"} isOpen={isNewMedicineOpen} toggleOpen={toggleNewMedicine}>
          <form className="new_medecine">
            <div><label>Nom du médicament : </label><input type="text" required /></div>
            <div><label>Type : </label><input type="text" required /></div>
            <div><label>Stock initial : </label><input type="number" required /></div>
            <div><label>Stock actuel : </label><input type="number" required /></div>
            <div>
              <button type="reset" className="btn_border">Réinitialiser</button>
              <button type="submit" className="btn_blue">Ajouter</button>
            </div>
          </form>
      </Slide>

      {/* Slide Rapport */}
      <Slide title={"Créer un rapport de visite"} isOpen={isNewRapportOpen} toggleOpen={toggleNewRapport}>
        <form className="add_report" onSubmit={handleSubmitRapport}>
          <div>
            <label>Nom de l'aidé : </label>
            <input type="text" name="nom_aide" required />
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