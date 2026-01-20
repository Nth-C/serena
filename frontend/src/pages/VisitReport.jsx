import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom';
import Slide from '../components/slide/Slide';
import PopUpDelete from '../components/popup_delete/PopUpDelete'
import PopUpConfirmation from '../components/popup_confirmation/PopUpConfirmation'

import { ROLES, hasPermission } from './../utils/roleManager';

function MedicItem({ medicament, isOpen, onToggle, onAdd }) {
  return (
    <div className={`container_medecine ${isOpen ? 'open' : ''}`}>
      <div className="principal_infos" onClick={onToggle}>
        <p>{medicament.nomMedicament}</p>
      </div>

      {isOpen && (
        <div className="drop">
          <p>{medicament.type}...</p>
          <div>
            <button className="btn_blue" onClick={() => onAdd(medicament)}>Ajouter au rapport</button>
          </div>
        </div>
      )}
    </div>
  );
}

function LastVisitReport() {
  const [rapports, setRapports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const [listMedecine, setListMedecine] = useState([])

  const [message, setMessage] = useState('');
  const [error, setError] = useState(null)

  const [isNewRapportOpen, setIsNewRapportOpen] = useState(false);
  const [isNewMedicineOpen, setIsMedicineOpen] = useState(false);
  const [listNomMedecine, setListNomMedecine] = useState([])
  const [isNameGood, setIsNameGood] = useState(false);
  const [listTypeMedecine, setListTypeMedecine] = useState([])
  const [idCatalogueMedecine, setIdCatalogueMedecine] = useState("")
  const [isNewPopupOpen, setIsPopupOpen] = useState(false);
  const [isDetailsReportOpen, setIsDetailsReportpen] = useState(false);
  const [isPopUpDeleteOpen, setIsPopUpDeleteOpen] = useState(false);

  const [selectedMedicsForReport, setSelectedMedicsForReport] = useState([]);

  const [nameMedecineToDisplay, setNameMedecineToDisplay] = useState('')

  const [selectedRapport, setSelectedRapport] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [nomRapport, setNomRapport] = useState("");
  const [descRapport, setDescRapport] = useState("");

  const [idCurrentRapport, setIdCurrentRapport] = useState(null);
  const [nameToDelete, setNameToDelete] = useState("");

  /* pop up confirmation */
  const [showConfirmation , setShowConfirmation] = useState(false)
  const [msgConfirmation , setMsgConfirmation] = useState('')


  const [nameMedecine, setNameMedecine] = useState("");
  const [typeMedecine, setTypeMedecine] = useState("");
  const [initialStock, setInitialStock] = useState("");
  const [currentStock, setCurrentStock] = useState("");
  const [openMedicId, setOpenMedicId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // trie
  const [sortOpen, setSortOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState('desc');

  const apiUrl = import.meta.env.VITE_API_URL;

  const sortedRapports = [...rapports].sort((a, b) => {
    // On combine la date et l'heure pour un tri chronologique précis
    const dateTimeA = new Date(`${a.date}T${a.heure || '00:00:00'}`);
    const dateTimeB = new Date(`${b.date}T${b.heure || '00:00:00'}`);

    return sortOrder === 'desc' ? dateTimeB - dateTimeA : dateTimeA - dateTimeB;
  });

  const sortRapport = (listeRapport) => {
    const listSort = [...listeRapport].sort((a, b) => {
      const dateTimeA = new Date(`${a.date}`);
      const dateTimeB = new Date(`${b.date}`);

      return sortOrder === 'desc' ? dateTimeB - dateTimeA : dateTimeA - dateTimeB;
    });

    return listSort
  }

  useEffect(() => {
    setRapports(sortRapport(rapports))
  }, [sortOrder]);

  useEffect(() => {
    fetchRapports()
    setMounted(true);
  }, []);

  const handleResetForm = () => {
    setNameMedecine("")
    setIdCatalogueMedecine("")
    setCurrentStock("")
    setInitialStock("")
  }

  const fetchRapports = async () => {
    try {
      const response = await fetch(`${apiUrl}/?route=rapport/list`, {
        credentials: 'include'
      });

      const result = await response.json();

      if (result.error) throw new Error(result.error);

      if (result.success) {
        let data = Array.isArray(result.data) ? result.data : []
        setRapports(sortRapport(data))
      } else {
        alert("Erreur: " + result.error);
      }

      //setRapports(Array.isArray(data) ? data : []);

    } catch (err) {
      console.error("Erreur de chargement:", err);
    } finally {
      setLoading(false);
    }
  };

  const getMedecine = async () => {
    try {
      const response = await fetch(`${apiUrl}/?route=medicament/list`, {
        credentials: 'include'
      });
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setListMedecine(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error("Erreur de récupération:", err.message);
      setError(err.message || "Impossible de contacter le serveur");
      setListMedecine([]);
    } finally {
      setLoading(false);
    }
  }

  const handleMedecine = async (e) => {
    e.preventDefault()

    const nouveauMedoc = {
      name: nameMedecine,
      idCatalogueMedecine: idCatalogueMedecine,
      stock: currentStock,
      stockTotal: initialStock
    }

    const route = isEditing ? 'medicament/update' : 'medicament/add';

    try {
      const response = await fetch(`${apiUrl}/?route=${route}`, {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nouveauMedoc)
      });

      const result = await response.json();

      if (result.success) {
        handleResetForm()
        getMedecine()
        setIsMedicineOpen(false)

        //!isEditing ? setIsShowAdd(true) : setIsShowModify(true)
        if(!isEditing) {
          setMsgConfirmation(`Le rapport ${nouveauMedoc.name} a bien été ajouté.`)
        } else {
          setMsgConfirmation(`Le rapport ${nouveauMedoc.name} a bien été modifié.`)
        }
        setShowConfirmation(true)

        setNameMedecineToDisplay(nameMedecine)
      } else {
        setMessage("Erreur: " + result.error);
      }
    } catch (error) {
      setMessage("error");
      console.error(error);
    }
  };

  const handleSearchMedecine = async (e) => {
    // change le controleur appeler en fonction de (créer / modifier)
    const route = 'nommedicament/search';

    try {
      const response = await fetch(`${apiUrl}/?route=${route}`, {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          // change les donné envoyer (créer / modifier)
          {
            texteNomMedicament: e
          }
        )
      });

      const result = await response.json();
      setListNomMedecine(result.resultats)
      if (result.isUnique) {
        setListTypeMedecine(result.types)
        setIsNameGood(true)

      } else {
        setListTypeMedecine([])
        setIdCatalogueMedecine("")
        setIsNameGood(false);
      }
    } catch (error) {
      setMessage("error");
      console.error(error);
    }
  };

  const addMedicToSelection = (medicament) => {
    if (!selectedMedicsForReport.find(m => (m.id_med || m.id_medicament) === medicament.id_medicament)) {
      setSelectedMedicsForReport([...selectedMedicsForReport, {
        id_med: medicament.id_medicament,
        nomMedicament: medicament.nomMedicament,
        quantite: ""
      }]);
    }
    setIsPopupOpen(false);
  };

  const removeMedicFromSelection = (id) => {
    setSelectedMedicsForReport(selectedMedicsForReport.filter(m => (m.id_med || m.id_medicament) !== id));
  };

  const updateMedicQuantite = (id, value) => {
    setSelectedMedicsForReport(selectedMedicsForReport.map(m =>
      (m.id_med || m.id_medicament) === id ? { ...m, quantite: value } : m
    ));
  };

  const handleOpenDetails = (rapport) => {
    setSelectedRapport(rapport);
    setIsDetailsReportpen(true);
  };

  const toggleDetailsReport = () => {
    if (isDetailsReportOpen) setSelectedRapport(null);
    setIsDetailsReportpen(!isDetailsReportOpen);
  };

  const toggleNewRapport = () => {
    if (isNewRapportOpen) {
      handleResetRapport();
      setSelectedMedicsForReport([]);
      setIsEditing(false);
    }
    setIsNewRapportOpen(!isNewRapportOpen);
  };

  const handleEditClick = () => {
    setNomRapport(selectedRapport.nom);
    setDescRapport(selectedRapport.description);

    // Ajout : Charger les médicaments existants pour la modification
    if (selectedRapport.medics_details) {
      const medicsToEdit = selectedRapport.medics_details.map(m => ({
        id_med: m.id_medicament,
        nomMedicament: m.nom,
        quantite: m.quantite
      }));
      setSelectedMedicsForReport(medicsToEdit);
    }

    setIsEditing(true);
    setIsDetailsReportpen(false);
    setIsNewRapportOpen(true);
  };

  const handleSubmitRapport = async (e) => {
    e.preventDefault();

    // Ajout : Sauvegarder le nom avant le reset pour la popup
    const nomPourNotification = nomRapport;

    const route = isEditing ? 'rapport/update' : 'rapport/add';
    const bodyData = {
      nom: nomRapport,
      description: descRapport,
      id_rapport: isEditing ? selectedRapport.id_rapport : null,
      medicaments: selectedMedicsForReport.map(m => ({
        id_med: m.id_med || m.id_medicament,
        quantite: m.quantite
      }))
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

        // Ajout : Utiliser le nom sauvegardé
        setMsgConfirmation(`Le rapport ${nomPourNotification} a bien été ajouté.`)
        setShowConfirmation(true)

        //isEditing ? setIsShowModify(true) : setIsShowAdd(true);
        handleResetRapport();
        setSelectedMedicsForReport([]);
        setIsEditing(false);
        fetchRapports();
      }
    } catch (err) {
      alert("Erreur lors de l'envoi");
    }
  };

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

        setShowConfirmation(true)

        fetchRapports();
      }
    } catch (error) {
      console.error("Erreur réseau", error);
    }
  };

  const toggleNewMedicine = () => setIsMedicineOpen(!isNewMedicineOpen);
  const togglePopup = (e) => { if (e) e.preventDefault(); setIsPopupOpen(!isNewPopupOpen); }
  const handleResetRapport = () => { setNomRapport(""); setDescRapport(""); };
  const handleResetMedecine = () => { setNameMedecine(""); setTypeMedecine(""); setInitialStock(""); setCurrentStock(""); };
  const toggleMedic = (id) => {
    setOpenMedicId(openMedicId === id ? null : id);
  };

  useEffect(() => {
    document.documentElement.classList.toggle('menu-active', isNewRapportOpen || isNewMedicineOpen || isDetailsReportOpen || isPopUpDeleteOpen);
  }, [isNewRapportOpen, isNewMedicineOpen, isDetailsReportOpen, isPopUpDeleteOpen]);

  return (
    <>
    <div className="last_visit_report">
      <div className="contener_report">

        <div className='container_top'>
          <div>
            <h1>Rapport de visite</h1>
            <div className='filter_group'>
              <button className='sort' onClick={() => setSortOpen(!sortOpen)}>
                <img src="/icons/sort.svg" alt="" />
                <p>Trier par</p>
              </button>
              <div className={sortOpen ? 'active' : ''}>
                <button
                  className={sortOrder === 'desc' ? 'active' : ''}
                  onClick={() => { setSortOrder('desc'); setSortOpen(false) }}>
                  Plus récent
                </button>
                <button
                  className={sortOrder === 'asc' ? 'active' : ''}
                  onClick={() => { setSortOrder('asc'); setSortOpen(false) }}>
                  Plus ancien
                </button>
              </div>
            </div>
          </div>

          <div className="search_report">
            <input type="search" placeholder="Rechercher un rapport" />
          </div>
        </div>

        <div className="liste_report">
          {loading ? (
            <p>Chargement des rapports...</p>
          ) : sortedRapports.length > 0 ? (
            sortedRapports.map((rapport) => (
              <div className="report_case hover_blue" key={rapport.id_rapport} onClick={() => handleOpenDetails(rapport)}>
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
        <div>
          <div className={`popup_report_add_medicament ${isNewPopupOpen ? 'popu-medi-active' : ''}`}>
            <div className="search_report">
              <div>
                <img src="/icons/arrow_back.svg" alt="" onClick={() => setIsPopupOpen(false)} />
                <input type="search" placeholder="Rechercher un médicament" />
              </div>
          {/* <div>
                <img src="/icons/sort.svg" alt="" />
                <p>Trier par</p>
              </div>*/}
            </div>
            {hasPermission("Famille") && (
            <div className="add_medi">
              <button onClick={toggleNewMedicine} className="btn_blue">Ajouter un nouveau médicament</button>
            </div>
            )}
            <div className="list">

              {listMedecine.map((med) => (
                <MedicItem
                  key={med.id_medicament}
                  medicament={med}
                  isOpen={openMedicId === med.id_medicament}
                  onToggle={() => toggleMedic(med.id_medicament)}
                  onAdd={addMedicToSelection}
                />

              ))}
            </div>
          </div>
          <div className='report_close_popup' onClick={() => setIsPopupOpen(false)}></div>
        </div>,
        document.body
      )}
    </div>

    {/* Slide Ajout Médicament */}
    <Slide title={"Ajouter un médicament"} isOpen={isNewMedicineOpen} toggleOpen={toggleNewMedicine} zIndex={700}>
      <form className="new_medecine" onSubmit={handleMedecine}>
        <div>
          <label>Nom du médicament : </label>
          <input
            type="text"
            list="medication-suggestions"
            value={nameMedecine}
            onChange={(e) => {
              setCurrentStock("");
              setInitialStock("");
              setIdCatalogueMedecine("");
              setNameMedecine(e.target.value);
              if (e.target.value != "") {
                handleSearchMedecine(e.target.value);
              }
            }}
            required
            disabled={isEditing}
          />
          <datalist id="medication-suggestions">
            {listNomMedecine?.map((suggestion, i) => (
              <option key={i} value={suggestion.denomination_substance} />
            ))}
          </datalist>
        </div>
        <div>
          <label>Type de médicament : </label>
          <select value={idCatalogueMedecine} onChange={(e) => {
            setIdCatalogueMedecine(e.target.value)
          }}
            required
            disabled={!isNameGood}>
            <option value=""></option>
            {listTypeMedecine.map((listeMedicament) => (
              <option key={listeMedicament.id_medics} value={listeMedicament.id_medics}>
                {listeMedicament.designation_elem_pharma}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Stock initiale du médicament : </label>
          <input
            type="number"
            value={initialStock}
            onChange={(e) => setInitialStock(e.target.value)}
            required
            disabled={!isNameGood || isEditing} // on ne peut pas modifier l'input si on modifie un medicament
          />
        </div>
        <div>
          <label>Stock actuel du médicament :</label>
          <input
            type="number"
            value={currentStock}
            onChange={(e) => setCurrentStock(e.target.value)}
            required
            disabled={!isNameGood}
          />
        </div>
        <div>
          <button type="reset" className="btn_border" onClick={handleResetMedecine}>Réinitialiser</button>
          <button type="submit" className="btn_blue">Ajouter</button>
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
        <div>
          <label>Médicaments pris : </label>
          <div className="selected_medics_container">
            {selectedMedicsForReport.map((m) => {
              const id = m.id_med || m.id_medicament;
              return (
                <div key={id} className="list_medicament_report">
                  <div>
                    <p>{m.nomMedicament}</p>
                    <input
                      type="number"
                      placeholder=""
                      value={m.quantite}
                      min="1"
                      onChange={(e) => updateMedicQuantite(id, e.target.value)}
                    />
                    <button type="button" onClick={() => removeMedicFromSelection(id)}>✕</button>
                  </div>
                </div>
              );
            })}
          </div>
          <button type="button" className="btn_blue add_medi" onClick={() => {
            togglePopup();
            getMedecine()
          }}
          >Ajouter médicament</button>
        </div>
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
    <Slide title={selectedRapport ? selectedRapport.nom : "Détails"} isOpen={isDetailsReportOpen} toggleOpen={toggleDetailsReport} zIndex={100}>
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
              {selectedRapport.medics_details && selectedRapport.medics_details.length > 0 ? (
                selectedRapport.medics_details.map((m, i) => (
                  <li key={i}>
                    <strong>{m.nom}</strong> : {m.quantite}
                  </li>
                ))
              ) : (
                <li>Aucun médicament enregistré.</li>
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
              setMsgConfirmation(`Le rapport ${selectedRapport.nom} a bien été suprimmé.`)
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
      onClose={() => togglePopUpDelete()}
    />

    <PopUpConfirmation sentence={msgConfirmation} show={showConfirmation} setShow={setShowConfirmation} />
    
    </>
  )
}

export default LastVisitReport;