import { useEffect, useState } from 'react'
import Slide from '../components/slide/Slide';
import PopUpDelete from '../components/popup_delete/PopUpDelete'
import PopUpConfirmation from '../components/popup_confirmation/PopUpConfirmation'
import PopUpAddStock from '../components/popup_add_stock/PopUpAddStock'


function Medecine() {
  const [loading, setLoading] = useState(true);

  // recuperer les medicaments (les variables sont dans la class medicaments)
  const [listMedecine , setListMedecine] = useState([])
  const [activeInList , setActiveInList] = useState(null)
  const [nameCurrentMedecine , setNameCurrentMedecine] = useState(null)

  // pour mettre les erreurs
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null)

  // ajout medicament
  const [isNewMedecineOpen , setIsNewMedecineOpen] = useState(false) // page
  const [nameMedecine , setNameMedecine] = useState("")
  const [typeMedecine , setTypeMedecine] = useState("")
  const [initialStock , setInitialStock] = useState("")
  const [currentStock , setCurrentStock] = useState("")

  // ajout stock
  const [isAddStockOpen , setIsAddStockOpen] = useState(false) // page
  const [addStock , setAddStock] = useState("")

  // popup suppression
  const [isPopUpDeleteOpen , setIsPopUpDeleteOpen] = useState(false) // page
  const [idCurrentMedecine , setIdCurrentMedecine] = useState(null)

  // popup confirmation
  const [isShowRemove , setIsShowRemove] = useState(false)
  const [isShowAdd , setIsShowAdd] = useState(false)
  const [nameMedecineToDisplay , setNameMedecineToDisplay] = useState('')

  
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleResetForm = () => {
    setNameMedecine("")
    setTypeMedecine("") 
    setCurrentStock("")
    setInitialStock("")
  }

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
    setError(null);
  } catch (err) {
    console.error("Erreur de récupération:", err.message);
    setError(err.message || "Impossible de contacter le serveur");
    setListMedecine([]); // Évite le crash du .map() en cas d'erreur
  } finally {
    // Si tu as un état de chargement, tu peux le stopper ici
    setLoading(false); 
  }
};

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
      } else {
        alert("Erreur: " + result.error);
      }

    } catch (error) {
      console.error("Erreur réseau:", error);
    }
  }

  const handleUpdateMedecine = async (quantiteAjoutee) => {
    try {
        const response = await fetch(`${apiUrl}/?route=medicament/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            // On envoie l'ID du médicament actuel et la quantité
            body: JSON.stringify({ 
                id_medicament: activeInList, 
                nouveauStock: quantiteAjoutee 
            }),
        });
        const data = await response.json();
        if (data.success) {
            getMedecine(); // On rafraîchit la liste
            toggleAddStock(); // On ferme la popup
        }
    } catch (err) {
        console.error("Erreur mise à jour stock:", err);
    }
};

  const handleAddMedecine = async (e) => {
    e.preventDefault()

    const nouveauMedoc = {
      name: nameMedecine,
      type: typeMedecine,
      stock: currentStock,
      stockTotal: initialStock
    }

    try {
      const response = await fetch(`${apiUrl}/?route=medicament/add`, {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nouveauMedoc)
      });

      const result = await response.json();

      if (result.success) {
        handleResetForm()
        // mettre a jour la liste
        getMedecine()
        // fermer le slide
        toggleNewMedecine()
        // affiche le message d'ajout
        setIsShowAdd(true)
        setNameMedecineToDisplay(nameMedecine)
      } else {
        setMessage("Erreur: " + result.error);
      }
    } catch (error) {
      setMessage("error");
      console.error(error);
    }
  };

  // fonction pour ouvrir/fermer le newMedecine
  const toggleNewMedecine = () => {
    setIsNewMedecineOpen(!isNewMedecineOpen)
  }
  
  const toggleAddStock = () => {
    setIsAddStockOpen(!isAddStockOpen)
  }

  const togglePopUpDelete = () => {
    setIsPopUpDeleteOpen(!isPopUpDeleteOpen)
  }

  

  // quand la page se lance on affiche les medicaments
  useEffect(() => {
    getMedecine()
  }, []);

  return (
    <div className="medecine">
      <h1>Liste médicaments</h1>
      <div className="list">
          {loading ? (
            <p>Chargement des médicaments...</p>
          ) : listMedecine.length > 0 ? (
            listMedecine.map((med) => (
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
                    <progress max="100" value={med.stockTotal > 0 ? (med.stock / med.stockTotal) * 100 : 0}></progress>
                    {<p>{med.stock}/{med.stockTotal}</p> }
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
                      togglePopUpDelete()
                    }}>Supprimer</button>
                    <button className="btn_blue" onClick={() => {
                      toggleAddStock()
                    }}>Modifier stock</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="aucun">Aucun médicaments pour cette famille.</p>
          )}
      </div>

      <p className='end_list' >Aucun autre médicament</p>

      <button className="btn_add" onClick={toggleNewMedecine}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg></button>;

      <Slide 
        title={"Ajouter un médicament"}
        isOpen={isNewMedecineOpen}
        toggleOpen={toggleNewMedecine}
        >
        <form className="new_medecine" onSubmit={handleAddMedecine}>
          <div>
            <label>Nom du médicament : </label>
            <input
              type="text"
              value={nameMedecine}
              onChange={(e) => setNameMedecine(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Type de médicament : </label>
            <select 
              value={typeMedecine} 
              onChange={(e) => setTypeMedecine(e.target.value)} 
              name="type_medecine"
              required
            >
              <option value="" disabled>-- Choisir un type --</option>
              
              <option value="pils">Comprimé / Gélule</option>
              <option value="injection">Injection / Piqûre</option>
              <option value="sirop">Sirop / Liquide</option>
              <option value="creme">Pommade / Crème</option>
              <option value="patch">Pansement / Patch</option>
            </select>
          </div>
          <div>
            <label>Stock initiale du médicament : </label>
            <input
              type="number"
              value={initialStock}
              onChange={(e) => setInitialStock(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Stock actuel du médicament :</label>
            <input
              type="number"
              value={currentStock}
              onChange={(e) => setCurrentStock(e.target.value)}
              required
            />
          </div>
          <div>
            <button type="reset" className="btn_border" onClick={handleResetForm}>Réinitialiser</button>
            <button type="submit" className="btn_blue">Ajouter</button>
          </div>
        </form>
      </Slide>

      <PopUpAddStock
        // il manque le handler pour ajouter le stock
        nameMedecine={nameCurrentMedecine}
        isOpen={isAddStockOpen}
        toggleOpen={toggleAddStock}
        onConfirm={handleUpdateMedecine}
      />

      <PopUpDelete
        toDelete={nameCurrentMedecine}
        handleDelete={() => handleDeleteMedecine(idCurrentMedecine)}
        isOpen={isPopUpDeleteOpen}
        onClose={togglePopUpDelete}
        showConfirmation={() => setIsShowRemove(true)} /*pas obligatoire*/
      />

      <PopUpConfirmation
        sentence={`Le médicament ${nameCurrentMedecine} a bien été supprimé.`}
        show={isShowRemove}
        setShow={setIsShowRemove}
      />

      <PopUpConfirmation
        sentence={`Le médicament ${nameMedecineToDisplay} a bien été ajouter.`}
        show={isShowAdd}
        setShow={setIsShowAdd}
      />
    </div>
  )
}

export default Medecine