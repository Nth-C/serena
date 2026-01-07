import { useEffect, useState } from 'react'
import Slide from '../components/slide/Slide';

function FileExplorer() {
  const [listDocument , setListDocument] = useState([])
  const [activeInList , setActiveInList] = useState(null)

  const [isNewDocumentOpen, setIsNewDocumentOpen] = useState(false) // page
  const [nameDocument , setNameDocument] = useState("")
  const [emplacementDocument , setEmplacementDocument] = useState("")

  const [isNewCategorieOpen, setIsNewCategorieOpen] = useState(false) // page
  const [nameCategorie , setNameCategorie] = useState("")


  const [message, setMessage] = useState('');
  const [error, setError] = useState(null)

  // fonction pour ouvrir/fermer le newDocument
  const toggleNewDocument = () => {
    setIsNewDocumentOpen(!isNewDocumentOpen)
  }

  const toggleNewCategorie = () => {
    setIsNewCategorieOpen(!isNewCategorieOpen)
  }

  const apiUrl = import.meta.env.VITE_API_URL;
  
  const handleAddDocument = async (e) => {
    e.preventDefault()

    const nouveauDocument = {
      name: nameDocument,
      id_categorie: emplacementDocument
      }

    try {
      const response = await fetch(`${apiUrl}/?route=document/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nouveauDocument)
      });

      const result = await response.json();

      if (result.success) {
        // reset le formulaire
        setNameDocument('')
        setEmplacementDocument('')
        // mettre a jour la liste 
        getDocument()
      } else {
        setMessage("Erreur: " + result.error);
      }
    } catch (error) {
      setMessage("error");
      console.error(error);
    }
  };

  const handleAddCategorie = async (e) => {
    e.preventDefault()

    const nouvelleCategorie = {
      name: nameCategorie,
    }

    try {
      const response = await fetch(`${apiUrl}/?route=categorie/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nouvelleCategorie)
      });
      
      const result = await response.json();

      if (result.success) {
        // reset le formulaire
        setNameCategorie('')
        // mettre a jour la liste 
        getDocument()
      } else {
        setMessage("Erreur: " + result.error);
      }
    } catch (error) {
      setMessage("error");
      console.error(error);
    }
  };

  


  const getDocument = async () => {
      fetch(`${apiUrl}/?route=document/list`)
        .then((response) => {
          return response.json() // recupere les données$
        })
        .then((data) => {
        // on verifie si data est un tableau
        if (Array.isArray(data)) {
          setListDocument(data);
          setError(null);
        } else if (data.error) {
          setError(data.error);
          setListDocument([]); // On remet à vide pour éviter le crash du .map()
        }
      })
      .catch((err) => {
        console.error("Erreur de récupération:", err);
        setError("Impossible de contacter le serveur");
        setListDocument([]);
      });
  }



  // 1. Déclaration de l'état pour le texte de recherche
  const [searchText, setSearchText] = useState('');


  useEffect(() => {
  getDocument();
}, []); 



  return (
    <div className="file_explorer">
      <h1>Explorateur</h1>
      
      {/* 2. Liaison de l'input avec l'état */}
      <input 
        type="text" 
        placeholder="Rechercher un fichier..."
        value={searchText} 
        onChange={(e) => setSearchText(e.target.value)} 
        required 
      />

      <button className="btn_add_report" onClick={toggleNewDocument}> test<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" /></svg></button>
      <button className="btn_add_report" onClick={toggleNewCategorie}> test<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" /></svg></button>





      <div className="list">
        {listDocument.map((cat) => (
          <div key={cat.id_cat} className="container_categorie">
            <div className="principal_infos" onClick={() => {
              setActiveInList(cat.id_cat)
            }}>
              <div>
                <p>{cat.nom}</p>
                <p>{cat.type}</p>
              </div>

              {cat.documents.map((doc) => (
                <div key={doc.id_document} className="container_document">
                  <div className="principal_infos" onClick={() => {
                  }}>
                    <div>
                      <p>{doc.nom_doc}</p>
                      <p>{doc.type}</p>
                    </div>
                  </div>
                </div>
        ))}
            </div>
          </div>
        ))}
      </div>

      <Slide title={"Ajouter un document"} isOpen={isNewDocumentOpen} onClickNewMedecine={toggleNewDocument}>

        <form className="new_document" onSubmit={handleAddDocument}>
          <div>
            <label>Emplacement : </label>
            <input 
              type="number" 
              value={emplacementDocument} 
              onChange={(e) => setEmplacementDocument(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label>Nom du document : </label>
            <input 
              type="text" 
              value={nameDocument} 
              onChange={(e) => setNameDocument(e.target.value)} 
              required 
            />
          </div>
          <div>
            <button className="simple">Reinistialiser</button>
            <button className="fill">Ajouter</button>
          </div>
        </form>
      </Slide>


      <Slide title={"Créer un répertoire"} isOpen={isNewCategorieOpen} onClickNewMedecine={toggleNewCategorie}>

        <form className="new_categorie" onSubmit={handleAddCategorie}>
          <div>
            <label>Nom du répertoire : </label>
            <input 
              type="text" 
              value={nameCategorie} 
              onChange={(e) => setNameCategorie(e.target.value)} 
              required 
            />
          </div>
          <div>
            <button className="simple">Reinistialiser</button>
            <button className="fill">Ajouter</button>
          </div>
        </form>
      </Slide>

      
    </div>
  )
}

export default FileExplorer