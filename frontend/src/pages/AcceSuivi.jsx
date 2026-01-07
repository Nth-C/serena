import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react'
import Slide from '../components/slide/Slide';

// Composant pour chaque ligne de famille (Accordéon)
function FamilleItem({ famille, onModifier, isOpen, onToggle }) {
    return (
        <div className={`container_suivi_groupe ${isOpen ? 'open' : ''}`}>
            <div
                className="principal_infos"
                onClick={onToggle}
            >
                <p>{famille.nom}</p>
            </div>

            {isOpen && (
                <div className="drop">
                    {/* On utilise famille.desc car le PHP mappe 'description' vers 'desc' */}
                    <p>{famille.desc}</p>
                    <div className="actions_buttons">
                        <button
                            className="btn_border"
                            onClick={(e) => {
                                e.stopPropagation();
                                onModifier(famille);
                            }}
                        >
                            Modifier
                        </button>
                        <button className="btn_blue">Accéder</button>
                    </div>
                </div>
            )}
        </div>
    );
}

function AcceSuivi() {
    const [message, setMessage] = useState("");
    const apiUrl = import.meta.env.VITE_API_URL;
    const [familles, setFamilles] = useState([]);
    const [openFamilleId, setOpenFamilleId] = useState(null);

    // État du formulaire incluant l'ID pour la modification
    const [formData, setFormData] = useState({
        id_famille: null,
        nom_aide: '',
        nom_groupe: '',
        description: ''
    });

    const [isNewSuiviOpen, setIsNewSuiviOpen] = useState(false);
    const [isModifSuiviOpen, setIsModifSuiviOpen] = useState(false);

    // Chargement des données
    const fetchFamilles = async () => {
        try {
            const response = await fetch(`${apiUrl}/?route=famille/all`);
            const data = await response.json();
            setFamilles(data);
        } catch (error) {
            console.error("Erreur chargement familles:", error);
        }
    };

    useEffect(() => {
        fetchFamilles();
    }, []);

    // Gestion des inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Ouvrir un volet et fermer les autres
    const toggleFamille = (id) => {
        setOpenFamilleId(openFamilleId === id ? null : id);
    };

    // Soumission pour AJOUT
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        try {
            const response = await fetch(`${apiUrl}/?route=famille/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const result = await response.json();

            if (result.success) {
                setMessage("Suivi créé avec succès !");
                setIsNewSuiviOpen(false);
                setFormData({ id_famille: null, nom_aide: '', nom_groupe: '', description: '' });
                fetchFamilles();
            } else {
                setMessage("Erreur : " + result.error);
            }
        } catch (error) {
            setMessage("Erreur technique lors de l'enregistrement.");
            console.error(error);
        }
    };

    // Soumission pour MODIFICATION
    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage("");
        try {
            const response = await fetch(`${apiUrl}/?route=famille/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const result = await response.json();

            if (result.success) {
                setMessage("Modification enregistrée !");
                setIsModifSuiviOpen(false);
                fetchFamilles();
            } else {
                setMessage("Erreur : " + result.error);
            }
        } catch (error) {
            console.error("Erreur mise à jour:", error);
        }
    };

    // Pré-remplissage du formulaire de modification
    const handleOpenModif = (famille) => {
        setFormData({
            id_famille: famille.id_famille,
            nom_aide: famille.nom_aide,
            nom_groupe: famille.nom,
            description: famille.desc // On mappe vers le champ description du formulaire
        });
        setIsModifSuiviOpen(true);
    };

    const toggleNewSuvi = () => {
        setFormData({ id_famille: null, nom_aide: '', nom_groupe: '', description: '' });
        setIsNewSuiviOpen(!isNewSuiviOpen);
    };

    useEffect(() => {
        const isActive = isNewSuiviOpen || isModifSuiviOpen;
        document.documentElement.classList.toggle('menu-active', isActive);
    }, [isNewSuiviOpen, isModifSuiviOpen]);

    return (
        <div className="acce_suivi">
            <img src="/img/logo-name.svg" alt="Logo" />
            <h1>Accéder au suivi</h1>

            <div className="list">
                {familles.length > 0 ? (
                    familles.map((famille) => (
                        <FamilleItem
                            key={famille.id_famille}
                            famille={famille}
                            onModifier={handleOpenModif}
                            isOpen={openFamilleId === famille.id_famille}
                            onToggle={() => toggleFamille(famille.id_famille)}
                        />
                    ))
                ) : (
                    <p>Aucun suivi disponible.</p>
                )}
            </div>

            <span className='border'></span>

            <button className="btn_blue creer_suivi" onClick={toggleNewSuvi}>Creer un nouveau suivi</button>
            {message && <p className="success-msg">{message}</p>}

            {/* Slide AJOUT */}
            <Slide title={"Créer un nouveau suivi"} isOpen={isNewSuiviOpen} onClickNewMedecine={toggleNewSuvi}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nom de l'aidé : </label>
                        <input type="text" name="nom_aide" value={formData.nom_aide} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Nom du groupe : </label>
                        <input type="text" name="nom_groupe" value={formData.nom_groupe} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Courte description : </label>
                        <textarea name="description" value={formData.description} onChange={handleChange} required></textarea>
                    </div>
                    <div>
                        <button className="btn_border">Annuler</button>
                        <button type="submit" className="btn_blue">Créer</button>
                    </div>
                </form>
            </Slide>

            {/* Slide MODIFICATION */}
            <Slide title={`Modifier le suivi de ${formData.nom_groupe}`} isOpen={isModifSuiviOpen} onClickNewMedecine={() => setIsModifSuiviOpen(false)}>
                <form onSubmit={handleUpdate}>
                    <div className="form-group">
                        <label>Nom de l'aidé : </label>
                        <input type="text" name="nom_aide" value={formData.nom_aide} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Nom du groupe : </label>
                        <input type="text" name="nom_groupe" value={formData.nom_groupe} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Courte description : </label>
                        <textarea name="description" value={formData.description} onChange={handleChange} required></textarea>
                    </div>
                    <div className="form-actions">
                        <button className="btn_red">Supprimer</button>
                        <div>
                            <button type="button" className="btn_border" onClick={() => setIsModifSuiviOpen(false)}>Annuler</button>
                            <button type="submit" className="btn_blue">Enregistrer</button>
                        </div>
                    </div>
                </form>
            </Slide>

            <img src="/img/logo.svg" alt="Footer Logo" />
        </div>
    );
}

export default AcceSuivi;