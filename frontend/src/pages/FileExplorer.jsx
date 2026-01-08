import { useEffect, useState } from 'react'
import Slide from '../components/slide/Slide';

function FileExplorer() {
  const [listDocument, setListDocument] = useState([])
  const [activeInList, setActiveInList] = useState(null)

  const [isNewDocumentOpen, setIsNewDocumentOpen] = useState(false) // page
  const [nameDocument, setNameDocument] = useState("")
  const [emplacementDocument, setEmplacementDocument] = useState("")

  const [isNewCategorieOpen, setIsNewCategorieOpen] = useState(false) // page
  const [nameCategorie, setNameCategorie] = useState("")


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
        credentials: 'include',
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
        credentials: 'include',
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
  try {
    const response = await fetch(`${apiUrl}/?route=document/list`, {
      credentials: 'include' // Indispensable pour que PHP récupère la session (id_famille)
    });
    
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    // Mise à jour de l'état avec les documents ou un tableau vide
    setListDocument(Array.isArray(data) ? data : []);
    setError(null);
  } catch (err) {
    console.error("Erreur de récupération des documents:", err.message);
    setError(err.message || "Impossible de contacter le serveur");
    setListDocument([]); // Sécurité pour éviter que le .map() ne plante
  }
};



  // 1. Déclaration de l'état pour le texte de recherche
  const [searchText, setSearchText] = useState('');


  useEffect(() => {
    getDocument();
  }, []);



  return (
    <div className="file_explorer">
      <h1>Explorateur</h1>

      <div className="search_container">
        <div className="search_document">
          <input type="search" placeholder="Rechercher un fichier..." value={searchText} onChange={(e) => setSearchText(e.target.value)} required />
          <div onClick={toggleNewCategorie}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
            <p>Nouvelle catégorie</p>
          </div>
        </div>
      </div>

      <button className="btn_add" onClick={toggleNewDocument}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" /></svg>
      </button>






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

      <Slide title={"Ajouter un document"} isOpen={isNewDocumentOpen} toggleOpen={toggleNewDocument}>

        <form className="new_document" onSubmit={handleAddDocument}>
          <div>

            <label>Emplacement : </label>
            <select value={emplacementDocument} onChange={(e) => setEmplacementDocument(e.target.value)} required>
              <option value=""></option>
              {listDocument.map((cat) => (
                <option key={cat.id_cat} value={cat.id_cat}>
                  {cat.nom}
                </option>
              ))}
            </select>

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
            <button className="btn_border">Réinitialiser</button>
            <button type="submit" className="btn_blue">Ajouter</button>
          </div>
        </form>
      </Slide>


      <Slide title={"Créer un répertoire"} isOpen={isNewCategorieOpen} toggleOpen={toggleNewCategorie}>

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
            <button className="btn_border">Réinitialiser</button>
            <button type="submit" className="btn_blue">Ajouter</button>
          </div>
        </form>
      </Slide>


    </div>
  )
}

export default FileExplorer