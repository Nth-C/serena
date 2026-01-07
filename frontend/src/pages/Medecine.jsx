import { useEffect, useState } from 'react'
import Slide from '../components/slide/Slide';


function Medecine() {
  // recuperer les medicaments (les variables sont dans la class medicaments)
  const [listMedecine , setListMedecine] = useState([])
  const [activeInList , setActiveInList] = useState(null)
  const [nameCurrentMedecine , setNameCurrentMedecine] = useState(null)


  const [message, setMessage] = useState('');
  const [error, setError] = useState(null)

  // ajout medicament
  const [isNewMedecineOpen , setIsNewMedecineOpen] = useState(false) // page
  const [nameMedecine , setNameMedecine] = useState("")
  const [typeMedecine , setTypeMedecine] = useState("")
  const [initialStock , setInitialStock] = useState("")
  const [currentStock , setCurrentStock] = useState("")

  // ajout stock
  const [isAddMedecineOpen , setIsAddMedecineOpen] = useState(false) // page
  const [addStock , setAddStock] = useState("")

  const apiUrl = import.meta.env.VITE_API_URL;

  const getMedecine = async () => {
      fetch(`${apiUrl}/?route=medicament/list`)
        .then((response) => {
          return response.json() // recupere les données$
        })
        .then((data) => {
        // on verifie si data est un tableau
        if (Array.isArray(data)) {
          setListMedecine(data);
          setError(null);
        } else if (data.error) {
          setError(data.error);
          setListMedecine([]); // On remet à vide pour éviter le crash du .map()
        }
      })
      .catch((err) => {
        console.error("Erreur de récupération:", err);
        setError("Impossible de contacter le serveur");
        setListMedecine([]);
      });
  }

  const handleDeleteMedecine = async (id) => {
    try {
      const response = await fetch(`${apiUrl}/?route=medicament/delete`, {
        method: "POST", // pour envoyer des données
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

  const handleAddMedecine = async (e) => {
    e.preventDefault()

    const nouveauMedoc = {
      name: nameMedecine,
      stock: currentStock,
      stockTotal: initialStock
    }

    try {
      const response = await fetch(`${apiUrl}/?route=medicament/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nouveauMedoc)
      });

      const result = await response.json();

      if (result.success) {
        // reset le formulaire
        setNameMedecine('')
        setCurrentStock('')
        // mettre a jour la liste 
        getMedecine()
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

  const toggleAddMedecine = () => {
    setIsAddMedecineOpen(!isAddMedecineOpen)
  }

  useEffect(() => {
    if (isNewMedecineOpen) {
        document.documentElement.classList.add('menu-active');
    } else {
        document.documentElement.classList.remove('menu-active');
    }
  }, [isNewMedecineOpen]);

  useEffect(() => {
    if (isAddMedecineOpen) {
        document.documentElement.classList.add('menu-active');
    } else {
        document.documentElement.classList.remove('menu-active');
    }
  }, [isAddMedecineOpen]);

  // quand la page se lance on affiche les medicaments
  useEffect(() => {
    getMedecine()
  }, []);

  return (
    <div className="medecine">
      <h1>Liste médicaments</h1>

      <div className="list">
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
                <progress max="100" value={med.stockTotal > 0 ? (med.stock / med.stockTotal) * 100 : 0}></progress>
                {<p>{med.stock}/{med.stockTotal}</p> }
                
              </div>
            </div>

            <div className={[
              "drop",
              activeInList === med.id_medicament ? 'active' : '',
            ].join(' ')}>
              <p>{med.description}</p>

              <div>
                <button className="btn_red" onClick={() => handleDeleteMedecine(med.id_medicament)}>Supprimer</button>
                <button className="btn_blue" onClick={toggleAddMedecine}>Ajouter stock</button>
              </div>
            </div>
          </div>
        ))}

      </div>

      <button className="btn_add_medecine" onClick={toggleNewMedecine}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg></button>


      <Slide title={"Ajouter un médicament"} isOpen={isNewMedecineOpen} onClickNewMedecine={toggleNewMedecine}>
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
            <input 
              type="text" 
              value={typeMedecine}
              onChange={(e) => setTypeMedecine(e.target.value)} 
              required 
            />
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
            <button className="btn_border">Reinistialiser</button>
            <button className="btn_blue">Ajouter</button>
          </div>
        </form>
      </Slide>

      <div className={[
        "container_popup_add_stock",
        isAddMedecineOpen ? 'active' : '',
      ].join(' ')}>
        <div className="popup_add_stock">
          <p>{nameCurrentMedecine}</p>
          <form>
            <div>
              <label>Stock à ajouter </label>
              <input 
                type="number" 
                value={addStock} 
                onChange={(e) => setAddStock(e.target.value)} 
                required 
              />
            </div>
            <div>
              <button className="btn_border" onClick={toggleAddMedecine}>Annuler</button>
              <button className="btn_blue">Ajouter</button>
            </div>
          </form>
        </div>

        <div className="background" onClick={toggleAddMedecine}></div>
      </div>


    </div>
  )
}

export default Medecine