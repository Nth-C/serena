import { useState } from 'react';
import Tesseract from 'tesseract.js';
import './OCR.css'; // Fichier CSS pour le style (à créer)
import Slide from '../components/slide/Slide';
import PopUpConfirmation from '../components/popup_confirmation/PopUpConfirmation';

function OCR() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ocrResult, setOcrResult] = useState({ raw_text: '', medicaments: [] });
  const [error, setError] = useState('');

  // États pour le formulaire d'ajout (comme dans Medecine.jsx)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [formIdCatalogue, setFormIdCatalogue] = useState("");
  const [formStock, setFormStock] = useState("");
  const [formStockTotal, setFormStockTotal] = useState("");
  
  const [listNomMedecine, setListNomMedecine] = useState([]);
  const [listTypeMedecine, setListTypeMedecine] = useState([]);
  const [isNameGood, setIsNameGood] = useState(false);

  // Popup confirmation
  const [isShowConfirmation, setIsShowConfirmation] = useState(false);
  const [msgConfirmation, setMsgConfirmation] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL;

  // Gère la sélection du fichier et crée un aperçu
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError('');
      setOcrResult({ raw_text: '', medicaments: [] }); // Réinitialise les résultats

      // Crée un aperçu de l'image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  // Appelle l'API pour l'analyse OCR
  const handleOcrAnalysis = async () => {
    if (!selectedFile) {
      setError("Veuillez d'abord sélectionner une image.");
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 1. Extraction du texte directement dans le navigateur
      const { data: { text } } = await Tesseract.recognize(selectedFile, 'fra');

      // 2. Envoi du texte extrait au backend pour analyse des médicaments
      const response = await fetch(`${apiUrl}/?route=ocr/extract`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ ocrText: text }),
      });

      // On lit d'abord la réponse en tant que texte. Ça fonctionne toujours.
      const responseText = await response.text();

      // Si la réponse HTTP n'est pas OK, on jette une erreur avec le texte qu'on a lu.
      if (!response.ok) {
          throw new Error(responseText || `Erreur HTTP ${response.status}`);
      }

      // Maintenant, on essaie de parser le texte en JSON.
      try {
        const data = JSON.parse(responseText);

        if (data.error) {
            throw new Error(data.error);
        }

        setOcrResult({
            raw_text: data.raw_text || '',
            medicaments: Array.isArray(data.medicaments) ? data.medicaments : []
        });

      } catch (jsonError) {
        // Si le parsing échoue, la réponse n'était pas du JSON. On affiche le texte brut.
        throw new Error("La réponse du serveur n'est pas du JSON valide. Réponse reçue : \n" + responseText);
      }

    } catch (err) {
      // Affiche l'erreur détaillée (qui contient maintenant la réponse du serveur).
      setError(err.message);
      setOcrResult({ raw_text: '', medicaments: [] }); // Vide les résultats en cas d'erreur
    } finally {
      setIsLoading(false);
    }
  };

  // Recherche les types de médicaments (logique identique à Medecine.jsx)
  const handleSearchMedecine = async (val) => {
    try {
      const response = await fetch(`${apiUrl}/?route=nommedicament/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ texteNomMedicament: val }),
      });
      const result = await response.json();
      
      setListNomMedecine(result.resultats || []);
      if (result.isUnique) {
        setListTypeMedecine(result.types || []);
        setIsNameGood(true);
      } else {
        setListTypeMedecine([]);
        setFormIdCatalogue("");
        setIsNameGood(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Ouvre le formulaire avec le nom pré-rempli
  const openAddForm = (rawName) => {
    const name = rawName ? rawName.trim() : "";
    setFormName(name);
    setFormStock("");
    setFormStockTotal("");
    setFormIdCatalogue("");
    setIsNameGood(false);
    setListTypeMedecine([]);
    
    if (name) {
        handleSearchMedecine(name);
    }
    setIsAddModalOpen(true);
  };

  // Soumet le formulaire d'ajout
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const addResponse = await fetch(`${apiUrl}/?route=medicament/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formName,
          idCatalogueMedecine: formIdCatalogue,
          stock: parseInt(formStock, 10),
          stockTotal: parseInt(formStockTotal, 10)
        }),
      });

      const addResult = await addResponse.json();

      if (addResult.success) {
        setMsgConfirmation(`Le médicament "${formName}" a été ajouté au stock.`);
        setIsShowConfirmation(true);
        setIsAddModalOpen(false);
      } else {
        setError(`Erreur lors de l'ajout : ${addResult.error}`);
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
      setError("Une erreur est survenue.");
    }
  };

  return (
    <div className="ocr_page">
      <h1>Analyse d'Ordonnance (OCR)</h1>
      <p>Téléchargez l'image d'une ordonnance pour en extraire les médicaments.</p>

      <div className="ocr_input_section">
        <input type="file" id="file-upload" onChange={handleFileChange} accept="image/png, image/jpeg" />
        <button onClick={handleOcrAnalysis} className="btn_blue" disabled={isLoading || !selectedFile}>
          {isLoading ? "Analyse en cours..." : "Lancer l'analyse"}
        </button>
      </div>

      {error && <p className="error_message">{error}</p>}

      <div className="ocr_results_container">
        {/* Colonne pour l'aperçu de l'image */}
        <div className="ocr_preview">
          <h2>Aperçu</h2>
          {preview ? <img src={preview} alt="Aperçu de l'ordonnance" /> : <p>Aucune image sélectionnée.</p>}
        </div>

        {/* --- NOUVELLE DIV POUR LES MÉDICAMENTS EXTRAITS --- */}
        <div className="ocr_medicaments">
          <h2>Médicaments identifiés</h2>
          {isLoading && <p>Chargement...</p>}
          {!isLoading && ocrResult.medicaments.length > 0 ? (
            <ul>
              {ocrResult.medicaments.map((med, index) => {
                // Gestion compatible : soit objet (ancien code), soit string (nouveau backend)
                const name = typeof med === 'string' ? med : med.nom;
                return (
                <li key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <strong>{name}</strong>
                  {typeof med !== 'string' && med.dosage && <span> - {med.dosage}</span>}
                  <button className="btn_blue" onClick={() => openAddForm(name)} style={{ padding: '0.5rem 1rem' }}>
                    Ajouter
                  </button>
                </li>
              )})}
            </ul>
          ) : (
            !isLoading && <p className="aucun">Aucun médicament extrait pour le moment.</p>
          )}
        </div>
      </div>

      {/* Slide pour ajouter manuellement les détails */}
      <Slide
        title="Ajouter un médicament"
        isOpen={isAddModalOpen}
        toggleOpen={() => setIsAddModalOpen(false)}
      >
        <form className="new_medecine" onSubmit={handleFormSubmit}>
          <div>
            <label>Nom du médicament : </label>
            <input
              type="text"
              list="medication-suggestions"
              value={formName}
              onChange={(e) => {
                setFormStock("");
                setFormStockTotal("");
                setFormIdCatalogue("");
                setFormName(e.target.value);
                if (e.target.value !== "") {
                  handleSearchMedecine(e.target.value);
                }
              }}
              required
            />
            <datalist id="medication-suggestions">
              {listNomMedecine?.map((suggestion, i) => (
                <option key={i} value={suggestion.denomination_substance} />
              ))}
            </datalist>
          </div>

          <div>
            <label>Type de médicament : </label>
            <select
              value={formIdCatalogue}
              onChange={(e) => setFormIdCatalogue(e.target.value)}
              required
              disabled={!isNameGood}
            >
              <option value=""></option>
              {listTypeMedecine.map((type) => (
                <option key={type.id_medics} value={type.id_medics}>
                  {type.designation_elem_pharma}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Stock initial (Total) : </label>
            <input
              type="number"
              value={formStockTotal}
              onChange={(e) => setFormStockTotal(e.target.value)}
              required
              disabled={!isNameGood}
            />
          </div>

          <div>
            <label>Stock actuel :</label>
            <input
              type="number"
              value={formStock}
              onChange={(e) => setFormStock(e.target.value)}
              required
              disabled={!isNameGood}
            />
          </div>

          <div>
            <button type="button" className="btn_border" onClick={() => setIsAddModalOpen(false)}>Annuler</button>
            <button type="submit" className="btn_blue" disabled={!isNameGood}>Ajouter</button>
          </div>
        </form>
      </Slide>

      <PopUpConfirmation
        sentence={msgConfirmation}
        show={isShowConfirmation}
        setShow={setIsShowConfirmation}
      />

    </div>
  );
}

export default OCR;
