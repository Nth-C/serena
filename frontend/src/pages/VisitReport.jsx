import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom';
import Slide from '../components/slide/Slide';
import PopUpDelete from '../components/popup_delete/PopUpDelete'
import PopUpConfirmation from '../components/popup_confirmation/PopUpConfirmation'

function LastVisitReport() {
  // États de base et listes
  const [rapports, setRapports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // États des Slides et Popups
  const [isNewRapportOpen, setIsNewRapportOpen] = useState(false);
  const [isNewMedicineOpen, setIsMedicineOpen] = useState(false);
  const [isNewPopupOpen, setIsPopupOpen] = useState(false);
  const [isDetailsReportOpen, setIsDetailsReportpen] = useState(false);
  const [isPopUpDeleteOpen, setIsPopUpDeleteOpen] = useState(false);

  // Gestion de la sélection et du mode édition
  const [selectedRapport, setSelectedRapport] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // États Formulaire Rapport
  const [nomRapport, setNomRapport] = useState("");
  const [descRapport, setDescRapport] = useState("");

  // États Suppression
  const [idCurrentRapport, setIdCurrentRapport] = useState(null);
  const [nameToDelete, setNameToDelete] = useState("");

  // États Notifications
  const [isShowRemove, setIsShowRemove] = useState(false);
  const [isShowAdd, setIsShowAdd] = useState(false);
  const [isShowModify, setIsShowModify] = useState(false);

  // États Formulaire Médicament
  const [nameMedecine, setNameMedecine] = useState("");
  const [typeMedecine, setTypeMedecine] = useState("");
  const [initialStock, setInitialStock] = useState("");
  const [currentStock, setCurrentStock] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    setMounted(true);
    fetchRapports();
  }, []);

  // --- FONCTIONS DE CHARGEMENT ---
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

  // --- GESTION DES DÉTAILS ---
  const handleOpenDetails = (rapport) => {
    setSelectedRapport(rapport);
    setIsDetailsReportpen(true);
  };

  const toggleDetailsReport = () => {
    if (isDetailsReportOpen) setSelectedRapport(null);
    setIsDetailsReportpen(!isDetailsReportOpen);
  };

  // --- GESTION DES FORMULAIRES (AJOUT & MODIF) ---
  const toggleNewRapport = () => {
    if (isNewRapportOpen) {
      handleResetRapport();
      setIsEditing(false);
    }
    setIsNewRapportOpen(!isNewRapportOpen);
  };

  const handleEditClick = () => {
    setNomRapport(selectedRapport.nom);
    setDescRapport(selectedRapport.description);
    setIsEditing(true);
    setIsDetailsReportpen(false); 
    setIsNewRapportOpen(true);   
  };

  const handleSubmitRapport = async (e) => {
    e.preventDefault();
    const route = isEditing ? 'rapport/update' : 'rapport/add';
    const bodyData = { 
        nom: nomRapport, 
        description: descRapport,
        id_rapport: isEditing ? selectedRapport.id_rapport : null 
    };

    try {
      const response = await fetch(`${apiUrl}/?route=${route}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(bodyData)
      });
      const result = await response.json();
      if (result.success) {
        setIsNewRapportOpen(false);
        isEditing ? setIsShowModify(true) : setIsShowAdd(true);
        handleResetRapport();
        setIsEditing(false);
        fetchRapports();
      }
    } catch (err) {
      alert("Erreur lors de l'envoi");
    }
  };

  // --- SUPPRESSION ---
  const togglePopUpDelete = () => setIsPopUpDeleteOpen(!isPopUpDeleteOpen);

  const handleDeleteRapport = async () => {
    if (!idCurrentRapport) return;
    try {
      const response = await fetch(`${apiUrl}/?route=rapport/delete`, {
        method: "POST", 
        credentials: 'include',
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ id: idCurrentRapport }) 
      });
      const result = await response.json();
      if (result.success) {
        setIsPopUpDeleteOpen(false);
        setIsDetailsReportpen(false);
        setIsShowRemove(true);
        fetchRapports();
      }
    } catch(error) {
      console.error("Erreur réseau", error);
    }
  };

  // --- MÉDICAMENTS ---
  const toggleNewMedicine = () => setIsMedicineOpen(!isNewMedicineOpen);
  const togglePopup = (e) => { if (e) e.preventDefault(); setIsPopupOpen(!isNewPopupOpen); }
  const handleResetRapport = () => { setNomRapport(""); setDescRapport(""); };
  const handleResetMedecine = () => { setNameMedecine(""); setTypeMedecine(""); setInitialStock(""); setCurrentStock(""); };

  useEffect(() => {
    document.documentElement.classList.toggle('menu-active', isNewRapportOpen || isNewMedicineOpen || isDetailsReportOpen || isPopUpDeleteOpen);
  }, [isNewRapportOpen, isNewMedicineOpen, isDetailsReportOpen, isPopUpDeleteOpen]);

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
              <div className="report_case" key={rapport.id_rapport} onClick={() => handleOpenDetails(rapport)}>
                <div>
                  <h2>{rapport.nom || "Nom rapport"}</h2>
                  <p>
                    {new Date(rapport.date).toLocaleDateString('fr-FR', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })} à {rapport.heure ? rapport.heure.substring(0, 5) : "--:--"}
                  </p>
                  <p className="truncated-text">{rapport.description}</p>
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

      {/* popup médicaments */}
      {mounted && isNewPopupOpen && createPortal(
        <div className={`popup_report_add_medicament ${isNewPopupOpen ? 'popu-medi-active' : ''}`}>
          <div className="search_report">
            <div>
              <img src="/icons/arrow_back.svg" alt="" onClick={() => setIsPopupOpen(false)} />
              <input type="search" placeholder="Rechercher un médicament" />
            </div>
            <div>
              <img src="/icons/sort.svg" alt="" />
              <p>Trier par</p>
            </div>
          </div>
          <button onClick={toggleNewMedicine} className="btn_blue">Ajouter un nouveau médicament</button>
          <div className="list">
            <div className="container_medecine">
              <div className="principal_infos"><p>Xanax</p></div>
              <div className="drop">
                <p>Anxiolytique...</p>
                <div><button className="fill">Ajouter</button></div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Slide Ajout Médicament */}
      <Slide title={"Ajouter un médicament"} isOpen={isNewMedicineOpen} toggleOpen={toggleNewMedicine} zIndex={700}>
        <form className="new_medecine">
          <div><label>Nom : </label><input type="text" value={nameMedecine} onChange={(e) => setNameMedecine(e.target.value)} required /></div>
          <div><label>Type : </label><input type="text" value={typeMedecine} onChange={(e) => setTypeMedecine(e.target.value)} required /></div>
          <div><label>Stock initial : </label><input type="number" value={initialStock} onChange={(e) => setInitialStock(e.target.value)} required /></div>
          <div><label>Stock actuel : </label><input type="number" value={currentStock} onChange={(e) => setCurrentStock(e.target.value)} required /></div>
          <div>
            <button type="button" className="btn_border" onClick={handleResetMedecine}>Réinitialiser</button>
            <button className="btn_blue">Ajouter</button>
          </div>
        </form>
      </Slide>

      {/* Slide Nouveau/Modif Rapport */}
      <Slide title={isEditing ? "Modifier le rapport" : "Créer un rapport de visite"} isOpen={isNewRapportOpen} toggleOpen={toggleNewRapport} zIndex={500}>
        <form className="add_report" onSubmit={handleSubmitRapport}>
          <div>
            <label>Nom du rapport : </label>
            <input type="text" value={nomRapport} onChange={(e) => setNomRapport(e.target.value)} required />
          </div>
          {!isEditing && (
            <div>
              <label>Médicaments pris : </label>
              <button type="button" className="btn_blue add_medi" onClick={togglePopup}>Ajouter médicament</button>
            </div>
          )}
          <div>
            <label>Information supplémentaire : </label>
            <textarea value={descRapport} onChange={(e) => setDescRapport(e.target.value)} required></textarea>
          </div>
          <div>
            <button type="button" className="btn_border" onClick={handleResetRapport}>Réinitialiser</button>
            <button type="submit" className="btn_blue">{isEditing ? "Enregistrer" : "Ajouter"}</button>
          </div>
        </form>
      </Slide>

      {/* Slide Détails Rapport */}
      <Slide title={selectedRapport ? selectedRapport.nom : "Détails"} isOpen={isDetailsReportOpen} toggleOpen={toggleDetailsReport} zIndex={500}>
        {selectedRapport ? (
            <div className="details_report">
                <div>
                    <p>Fait par : <strong>{selectedRapport.auteur || "Utilisateur"}</strong></p>
                    <p>Le : {new Date(selectedRapport.date).toLocaleDateString('fr-FR')}</p>
                    <p>À : {selectedRapport.heure ? selectedRapport.heure.substring(0, 5) : "--:--"}</p>
                </div>
                <div className="list-medic">
                    <h2>Médicaments pris :</h2>
                    <ul>
                        {selectedRapport.medics_list ? (
                            selectedRapport.medics_list.map((m, i) => <li key={i}>{m}</li>)
                        ) : (
                            <li>1 doliprane</li> // Fallback statique si vide pour le test
                        )}
                    </ul>
                </div>
                <div>
                    <h2>Informations supplémentaires :</h2>
                    <p>{selectedRapport.description}</p>
                </div>
                <div className="actions">
                    <button className="btn_red" onClick={() => {
                      setIdCurrentRapport(selectedRapport.id_rapport);
                      setNameToDelete(selectedRapport.nom);
                      togglePopUpDelete();
                    }}>Supprimer</button>
                    <button className="btn_blue" onClick={handleEditClick}>Modifier</button>
                </div>
            </div>
        ) : null}
      </Slide>

      {/* Popups de confirmation et suppression */}
      <PopUpDelete 
        toDelete={nameToDelete} 
        handleDelete={handleDeleteRapport} 
        isOpen={isPopUpDeleteOpen} 
        onClose={togglePopUpDelete} 
      />
      
      <PopUpConfirmation sentence={`Le rapport "${nameToDelete}" a bien été supprimé.`} show={isShowRemove} setShow={setIsShowRemove} />
      <PopUpConfirmation sentence={`Le rapport "${nomRapport}" a bien été ajouté.`} show={isShowAdd} setShow={setIsShowAdd} />
      <PopUpConfirmation sentence={`Le rapport a bien été modifié.`} show={isShowModify} setShow={setIsShowModify} />
    </div>
  )
}

export default LastVisitReport;