import { useEffect, useState } from 'react'
import Slide from '../components/slide/Slide';
import PopUpDelete from '../components/popup_delete/PopUpDelete'
import PopUpConfirmation from '../components/popup_confirmation/PopUpConfirmation'

function FileExplorer() {
  const [listDocument, setListDocument] = useState([])

  const [isNewDocumentOpen, setIsNewDocumentOpen] = useState(false) // page
  const [selectedFile, setSelectedFile] = useState(null); // C'est le fichier à envoyé
  const [nameDocument, setNameDocument] = useState("")
  const [typeDocument, setTypeDocument] = useState("")
  const [emplacementDocument, setEmplacementDocument] = useState("")

  const [isNewCategorieOpen, setIsNewCategorieOpen] = useState(false) // page
  const [nameCategorie, setNameCategorie] = useState("")

  const [idCurrentCategorie , setIdCurrentCategorie] = useState(null)

  const [isUploaded, setIsUploaded] = useState(false);

  const [message, setMessage] = useState('');
  const [error, setError] = useState(null)

  const [isPopUpDeleteOpen, setIsPopUpDeleteOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [nameToDelete, setNameToDelete] = useState("");

  const [isShowRemove, setIsShowRemove] = useState(false);
  const [isShowAdd, setIsShowAdd] = useState(false);

  const [isFileError, setIsFileError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  // fonction pour ouvrir/fermer le newDocument
  const toggleNewDocument = () => {
    handleResetUploadFile()
    setIsNewDocumentOpen(!isNewDocumentOpen)
  }

  const toggleNewCategorie = () => {
    if(isEditing){
      setIsEditing(false);
      handleResetCategorie()
    }
    setIsNewCategorieOpen(!isNewCategorieOpen)
  }

  const handleResetForm = () => {
    setNameDocument('');
    setTypeDocument('')
    setEmplacementDocument('');
    setSelectedFile(null);
    setIsUploaded(false);
    setIsFileError(false);
  }

  const handleEditCategorie = (cat) => {
    // On passe en mode édition
    setIsEditing(true);

    // pré-remplit les inputs avec les données du médicament
    setNameCategorie(cat.nom);

    // stocke l'id pour savoir lequel modifier plus tard

    setIdCurrentCategorie(cat.id_cat)
    
    setIsNewCategorieOpen(true);
    // ouvrir le slide
    
};

  const handleResetUploadFile = () => {
    setNameDocument('');
    setTypeDocument('')
    setSelectedFile(null);
    setIsUploaded(false);
    setIsFileError(false);
  }

  const handleResetCategorie = () => {
    setNameCategorie('');
  }

  const getDocument = async () => {
    try {
      const response = await fetch(`${apiUrl}/?route=document/list`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setListDocument(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error("Erreur de récupération:", err.message);
      setError(err.message || "Impossible de contacter le serveur");
      setListDocument([]);
    }
  };

  useEffect(() => {
    getDocument();
  }, []);

  const handleAddDocument = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage("Veuillez sélectionner un fichier.");
      return;
    }

    const formData = new FormData();
    formData.append('document', selectedFile);
    formData.append('name', nameDocument);
    formData.append('id_categorie', emplacementDocument);

    try {
      const response = await fetch(`${apiUrl}/?route=document/add`, {
        method: "POST",
        credentials: 'include',
        body: formData
      });
      const result = await response.json();
      if (result.success) {
        setIsShowAdd(true); // Confirmation ajout
        handleResetForm();
        getDocument();
        toggleNewDocument();
      } else {
        setMessage("Erreur: " + result.error);
      }
    } catch (error) {
      setMessage("Erreur technique lors de l'envoi");
    }
  };

  const handleAddCategorie = async (e) => {
    e.preventDefault()
    const nouvelleCategorie = { name: nameCategorie }
    const updateCategorie = {id_categorie : idCurrentCategorie, name : nameCategorie}

    const route = isEditing ? 'categorie/update' : 'categorie/add';
    try {
      const response = await fetch(`${apiUrl}/?route=${route}`, {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(!isEditing ? nouvelleCategorie : updateCategorie)
      });
      const result = await response.json();
      if (result.success) {
        setNameCategorie('')
        toggleNewCategorie();
        getDocument()
      } else {
        setMessage("Erreur: " + result.error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf'];
      const extension = file.name.split('.').pop().toLowerCase();
      if (allowedExtensions.includes(extension)) {
        setIsFileError(false);
      } else {
        setIsFileError(true);
      }

      setSelectedFile(file);
      setIsUploaded(true);

      if (!nameDocument) setNameDocument(file.name);
      if (!typeDocument) setTypeDocument(extension);
    }
  };

  const handleDownload = (relativeUrl) => {
    window.open(`${apiUrl}/${relativeUrl}`, '_blank');
  };

  const openDeleteModal = (doc) => {
    setIdToDelete(doc.id_doc || doc.id_document);
    setNameToDelete(doc.nom_doc);
    setIsPopUpDeleteOpen(true);
  };

  const togglePopUpDelete = () => setIsPopUpDeleteOpen(!isPopUpDeleteOpen);

  const handleDeleteConfirm = async () => {
    if (!idToDelete) return;
    try {
      const response = await fetch(`${apiUrl}/?route=document/delete&id=${idToDelete}`, {
        method: "GET",
        credentials: 'include'
      });

      const result = await response.json();
      if (result.success) {
        setIsPopUpDeleteOpen(false);
        setIsShowRemove(true);
        getDocument();
      } else {
        alert("Erreur: " + result.error);
      }
    } catch (error) {
      console.error("Erreur suppression:", error);
    }
  };

  const [searchText, setSearchText] = useState('');

  return (
    <div className="file_explorer">
      <div className='new_categories'>
        <h1>Explorateur</h1>
        <div onClick={toggleNewCategorie}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" /></svg>
            <p>Nouvelle catégorie</p>
          </div>
      </div>
      

      <div className="search_container">
        <div className="search_document">
          <input type="search" placeholder="Rechercher un fichier..." value={searchText} onChange={(e) => setSearchText(e.target.value)} required />
        </div>
      </div>

      <button className="btn_add" onClick={toggleNewDocument}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M440-320v-326L336-542l-56-58 200-200 200 200-56 58-104-104v326h-80ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" /></svg>
      </button>

      <div className="list">
        {listDocument.map((cat) => (
          <div key={cat.id_cat} className="container_categorie">
            <div className="principal_infos">
              <div className="case_categorie">
                <div>
                  <p><strong>{cat.nom}</strong></p>
                </div>
                <div>
                  <button onClick={() => handleEditCategorie(cat)}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" /></svg>
                  </button>
                </div>
              </div>

              {cat.documents && cat.documents.map((doc) => (
                <div key={doc.id_doc || doc.id_document} className="container_document">
                  <div className="principal_infos">
                    <div className="case_document">
                      <div>
                        <p>{doc.nom_doc}</p>
                        <p>{doc.type}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <div onClick={() => handleDownload(doc.url)} style={{ cursor: 'pointer' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#0000FF"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z" /></svg>
                        </div>
                        <img
                          src="/icons/bin.svg"
                          alt="bin"
                          style={{ cursor: 'pointer' }}
                          onClick={() => openDeleteModal(doc)}
                        />
                      </div>
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
          <div className="file_input_case">
            {!isUploaded ? (
              <label className="drop_zone">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M260-160q-91 0-155.5-63T40-377q0-78 47-139t123-78q25-92 100-149t170-57q117 0 198.5 81.5T760-520q69 8 114.5 59.5T920-340q0 75-52.5 127.5T740-160H520q-33 0-56.5-23.5T440-240v-206l-64 62-56-56 160-160 160 160-56 56-64-62v206h220q42 0 71-29t29-71q0-42-29-71t-71-29h-60v-80q0-83-58.5-141.5T480-720q-83 0-141.5 58.5T280-520h-20q-58 0-99 41t-41 99q0 58 41 99t99 41h100v80H260Zm220-280Z" /></svg>
                <div><p>Glisser le document ou </p><p>rechercher</p></div>
                <input type="file" onChange={handleFileChange} />
              </label>
            ) : (
              <div className="upload_success">
                {!isFileError ? (
                  <>
                    <div className="doc_warning">
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M280-280h280v-80H280v80Zm0-160h400v-80H280v80Zm0-160h400v-80H280v80Zm-80 480q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm0-560v560-560Z" /></svg>
                      <p>Le document : {selectedFile?.name} à bien été chargé</p>
                    </div>
                    <button type="button" onClick={() => setIsUploaded(false)} className="btn_blue">Changer de fichier</button>
                  </>

                ) : (
                  <>
                    <div>
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z" /></svg>
                      <p className="doc_type_erreur">Les document en .{typeDocument} ne sont pas pris en compte seule les images et les PDF sont autorisés</p>
                    </div>
                    <button type="button" onClick={() =>  handleResetUploadFile()} className="btn_blue">Changer de fichier</button>
                  </>

                )}
              </div>
            )}
          </div>
          <div>
            <label>Choisir la catégorie : </label>
            <select value={emplacementDocument} onChange={(e) => setEmplacementDocument(e.target.value)} required>
              <option value=""></option>
              {listDocument.map((cat) => (
                <option key={cat.id_cat} value={cat.id_cat}>{cat.nom}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Nom du document :</label>
            <input type="text" value={nameDocument} onChange={(e) => setNameDocument(e.target.value)} required />
          </div>
          <div>
            <button type="button" className="btn_border" onClick={handleResetForm}>Réinitialiser</button>
            <button type="submit" className="btn_blue">Ajouter</button>
          </div>
        </form>
      </Slide>

      <Slide title={isEditing ? "Modifier une catégorie" : "Créer une catégorie"} isOpen={isNewCategorieOpen} toggleOpen={toggleNewCategorie}>
        <form className="new_categorie" onSubmit={handleAddCategorie}>
          <div>
            <label>Nom de la catégorie : </label>
            <input type="text" value={nameCategorie} onChange={(e) => setNameCategorie(e.target.value)} required />
          </div>
          <div>
            <button type="button" className="btn_border" onClick={handleResetCategorie}>Réinitialiser</button>
            <button type="submit" className="btn_blue">Ajouter</button>
          </div>
        </form>
      </Slide>

      {/* --- POPUPS --- */}
      <PopUpDelete
        toDelete={nameToDelete}
        handleDelete={handleDeleteConfirm}
        isOpen={isPopUpDeleteOpen}
        onClose={togglePopUpDelete}
      />

      <PopUpConfirmation sentence={`Le document "${nameToDelete}" a bien été supprimé.`} show={isShowRemove} setShow={setIsShowRemove} />
      <PopUpConfirmation sentence={`Le document a bien été ajouté.`} show={isShowAdd} setShow={setIsShowAdd} />

    </div>
  )
}

export default FileExplorer;