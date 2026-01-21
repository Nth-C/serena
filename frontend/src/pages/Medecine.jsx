import { useEffect, useState } from 'react'
import Slide from '../components/slide/Slide';
import PopUpDelete from '../components/popup_delete/PopUpDelete'
import PopUpConfirmation from '../components/popup_confirmation/PopUpConfirmation'

function Medecine() {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // recuperer les medicaments (les variables sont dans la class medicaments)
  const [listMedecine, setListMedecine] = useState([])
  const [activeInList, setActiveInList] = useState(null)
  const [nameCurrentMedecine, setNameCurrentMedecine] = useState(null)

  // ajout medicament
  const [isNewMedecineOpen, setIsNewMedecineOpen] = useState(false) // page
  const [listNomMedecine, setListNomMedecine] = useState([])
  const [listTypeMedecine, setListTypeMedecine] = useState([])
  const [isNameGood, setIsNameGood] = useState(false);
  const [nameMedecine, setNameMedecine] = useState("")
  const [idCatalogueMedecine, setIdCatalogueMedecine] = useState("")
  const [initialStock, setInitialStock] = useState("")
  const [currentStock, setCurrentStock] = useState("")

  // popup suppression
  const [isPopUpDeleteOpen, setIsPopUpDeleteOpen] = useState(false) // page
  const [idCurrentMedecine, setIdCurrentMedecine] = useState(null)

  // popup confirmation
  const [isShowConfirmation, setIsShowConfirmation] = useState(false)
  const [msgConfirmation, setMsgConfirmation] = useState('')

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleResetForm = () => {
    setNameMedecine("")
    setIdCatalogueMedecine("")
    setCurrentStock("")
    setInitialStock("")
  }

  const handleEditMedecine = (med) => {
    // On passe en mode édition
    setIsEditing(true);

    // pré-remplit les inputs avec les données du médicament
    setNameMedecine(med.nomMedicament);
    setIdCatalogueMedecine(med.type);
    setInitialStock(med.stockTotal);
    setCurrentStock(med.stock);

    // stocke l'id pour savoir lequel modifier plus tard
    setIdCurrentMedecine(med.id_medicament);

    // ouvrir le slide
    setIsNewMedecineOpen(true);
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

      // On vérifie si data est un tableau, sinon on met un tableau vide
      setListMedecine(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      console.error("Erreur de récupération:", err.message);
      setListMedecine([]);
      setLoading(false);
    }
  }

  const handleDeleteMedecine = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/?route=medicament/delete`, {
        method: "POST", // pour envoyer des données
        credentials: 'include',
        headers: { "Content-Type": "application/json" }, // type de donnée envoyer
        body: JSON.stringify({ id: id }) // message a transmettre
      });

      // recupere la reponse du fetch
      const result = await response.json();

      if (result.success) {
        // rafrechir les medicaments
        getMedecine();
        // affichage confirmation
        setMsgConfirmation(`Le médicament ${nameCurrentMedecine} a bien été supprimé.`)
        setIsShowConfirmation(true)
      } else {
        alert("Erreur: " + result.error);
      }

    } catch (error) {
      console.error("Erreur réseau:", error);
    }
  }

  // handler ajoute / modifier médicament
  const handleMedecine = async (e) => {
    e.preventDefault()

    const nouveauMedoc = {
      name: nameMedecine,
      idCatalogueMedecine: idCatalogueMedecine,
      stock: parseInt(currentStock, 10),
      stockTotal: parseInt(initialStock, 10)
    }

    // change le controleur appeler en fonction de (créer / modifier)
    const route = isEditing ? 'medicament/update' : 'medicament/add';

    try {
      const response = await fetch(`${apiUrl}/?route=${route}`, {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          // change les donné envoyer (créer / modifier)
          !isEditing
            ? nouveauMedoc
            : {
              id_medicament: activeInList,
              nouveauStock: parseInt(currentStock, 10)
            }
        )
      });

      const result = await response.json();

      if (result.success) {
        handleResetForm()
        // mettre a jour la liste
        getMedecine()
        // fermer le slide
        toggleNewMedecine()
        // affichage confirmation
        if (!isEditing) {
          setMsgConfirmation(`Le médicament ${nameMedecine} a bien été ajouter.`)
        } else {
          setMsgConfirmation(`Le médicament ${nameMedecine} a bien été modifier.`)
        }
        setIsShowConfirmation(true)
      } else {
        console.log("Erreur: " + result.error);
      }
    } catch (error) {
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

  // fonction pour ouvrir/fermer le newMedecine
  const toggleNewMedecine = () => {
    if (isEditing) {
      setIsEditing(false);
      handleResetForm(); // On vide les champs
    }
    setIsNewMedecineOpen(!isNewMedecineOpen);
  }

  // quand la page se lance on affiche les medicaments
  useEffect(() => {
    getMedecine()
  }, []);

  // calcul pour changer les couleurs des progress bar
  const calcProgressBar = (totalStock, currentStock) => {
    if (totalStock > 0) {
      return ((currentStock / totalStock) * 100).toFixed(0)
    }
    return 0
  }

  return (
    <>
      <div className="medecine">
        <div className='container_top'>
          <div>
            <h1>Médicament</h1>
            <div className='filter_group'>
              <button className='sort'>
                <img src="/icons/sort.svg" alt="" />
                <p>Trier par</p>
              </button>
              <div>
                {/* bouton de trie */}
              </div>
            </div>
          </div>
          <div className="search_report">
            <input type="search" placeholder="Rechercher un médicament" />
          </div>
        </div>

        <div className="list">
          {loading ? (
            <p>Chargement des médicaments...</p>
          ) : listMedecine.length > 0 ? (
            <>
              {listMedecine.map((med) => (
                <div key={med.id_medicament} className="container_medecine">
                  <div className="principal_infos" onClick={() => {
                    setActiveInList(med.id_medicament)
                    setNameCurrentMedecine(med.nomMedicament)
                  }}>
                    <div>
                      <p>{med.nomMedicament}</p>
                      <p>{med.type}</p>
                    </div>
                    <div>
                      <progress
                        // met des class en fonction du pourcentage pour les bar de couleurs
                        className={
                          calcProgressBar(med.stockTotal, med.stock) < 33 ? "red_bar" :
                            calcProgressBar(med.stockTotal, med.stock) < 66 ? "pink_bar" :
                              "blue_bar"
                        }
                        max="100"
                        value={calcProgressBar(med.stockTotal, med.stock)}
                      ></progress>
                      <p>{med.stock}/{med.stockTotal}</p>
                    </div>
                  </div>

                  <div className={[
                    "drop",
                    activeInList === med.id_medicament ? 'active' : '',
                  ].join(' ')}>
                    {/* <p>{med.description}</p> */}
                    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Officia odit atque corrupti distinctio velit magnam nulla.</p>
                    <div>
                      <button className="btn_red" onClick={() => {
                        setIdCurrentMedecine(med.id_medicament)
                        setIsPopUpDeleteOpen(true)
                      }}>Supprimer</button>
                      <button className="btn_blue" onClick={() => {
                        handleEditMedecine(med)
                      }}>Modifier</button>
                    </div>
                  </div>
                </div>
              ))}
              <p className='end_list' >Aucun autre médicament</p>
            </>
          ) : (
            <p className="aucun">Aucun médicaments.</p>
          )}
        </div>

        <div className='btn_add_container' onClick={toggleNewMedecine}>
          <button className="btn_add"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" /></svg></button>
          <p>Ajouter un médicament</p>
        </div>

      </div>

      <Slide
        title={isEditing ? "Modifier le médicament" : "Ajouter un médicament"}
        isOpen={isNewMedecineOpen}
        toggleOpen={toggleNewMedecine}
      >
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
              disabled={isEditing} // on ne peut pas modifier l'input si on modifie un medicament
            />
            <datalist id="medication-suggestions">
              {/* On boucle sur les résultats de votre recherche PHP */}
              {listNomMedecine?.map((suggestion) => (
                <option value={suggestion.denomination_substance} />
              ))}
            </datalist>
          </div>

          <div>
            <label>Type de médicament : </label>
            <select value={idCatalogueMedecine} onChange={(e) => {
              setIdCatalogueMedecine(e.target.value)
            }}
              required
              disabled={!isNameGood || isEditing}>
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
              disabled={!isNameGood && !isEditing}
            />
          </div>

          <div>
            <button type="reset" className="btn_border" onClick={handleResetForm} disabled={isEditing}>Réinitialiser</button>
            <button type="submit" className="btn_blue">{isEditing ? "Modifier" : "Ajouter"}</button>
          </div>
        </form>
      </Slide>

      <PopUpDelete
        toDelete={nameCurrentMedecine}
        handleDelete={() => handleDeleteMedecine(idCurrentMedecine)}
        isOpen={isPopUpDeleteOpen}
        onClose={() => setIsPopUpDeleteOpen(false)}
      />

      <PopUpConfirmation
        sentence={msgConfirmation}
        show={isShowConfirmation}
        setShow={setIsShowConfirmation}
      />

    </>
  )
}

export default Medecine