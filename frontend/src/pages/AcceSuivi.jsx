import { useEffect, useState } from 'react'
import Slide from '../components/slide/Slide';

/**
 * Composant pour chaque ligne de famille (Accordéon)
 * Ajout de la prop onAcceder pour gérer le clic sur le bouton
 */
function FamilleItem({ famille, onModifier, onAcceder, isOpen, onToggle }) {
    return (
        <div className={`container_suivi_groupe ${isOpen ? 'open' : ''}`}>
            <div className="principal_infos" onClick={onToggle}>
                <p>{famille.nom}</p> 
            </div>

            {isOpen && (
                <div className="drop">
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
                        {/* Utilisation de la prop onAcceder passée par le parent */}
                        <button 
                            className="btn_blue" 
                            onClick={(e) => {
                                e.stopPropagation();
                                onAcceder(famille.id_famille);
                            }}
                        >
                            Accéder
                        </button>                    
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

    const [formData, setFormData] = useState({
        id_famille: null,
        nom_aide: '',
        nom_groupe: '',
        description: ''
    });

    const [isNewSuiviOpen, setIsNewSuiviOpen] = useState(false);
    const [isModifSuiviOpen, setIsModifSuiviOpen] = useState(false);

    // Chargement des familles de l'utilisateur
    const fetchFamilles = async () => {
        try {
            const response = await fetch(`${apiUrl}/?route=famille/all`, {
                credentials: 'include' // Indispensable pour la session PHP
            });
            const data = await response.json();
            setFamilles(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Erreur chargement familles:", error);
        }
    };

    useEffect(() => {
        fetchFamilles();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const toggleFamille = (id) => {
        setOpenFamilleId(openFamilleId === id ? null : id);
    };

    const handleAcceder = async (id_famille) => {
        try {
            const response = await fetch(`${apiUrl}/?route=famille/select`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ id_famille }),
            });
            const result = await response.json();
            if (result.success) {
                window.location.href = '/home/'; 
            } else {
                alert("Erreur lors de l'accès au groupe : " + result.error);
            }
        } catch (error) {
            console.error("Erreur de sélection de famille:", error);
        }
    };

    // Création d'un nouveau suivi
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        try {
            const response = await fetch(`${apiUrl}/?route=famille/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
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
        }
    };

    // Mise à jour d'un suivi existant
    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage("");
        try {
            const response = await fetch(`${apiUrl}/?route=famille/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
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

    const handleOpenModif = (famille) => {
        setFormData({
            id_famille: famille.id_famille,
            nom_aide: famille.nom_aide,
            nom_groupe: famille.nom,
            description: famille.desc
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
                            onAcceder={handleAcceder} // Transmission de la fonction de sélection
                            isOpen={openFamilleId === famille.id_famille}
                            onToggle={() => toggleFamille(famille.id_famille)}
                        />
                    ))
                ) : (
                    <p>Aucun suivi disponible.</p>
                )}
            </div>

            <span className='border'></span>

            <button className="btn_blue creer_suivi" onClick={toggleNewSuvi}>Créer un nouveau suivi</button>
            {message && <p className="success-msg">{message}</p>}

            <Slide title={"Créer un nouveau suivi"} isOpen={isNewSuiviOpen} toggleOpen={toggleNewSuvi}>
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
                        <button type="button" className="btn_border" onClick={toggleNewSuvi}>Annuler</button>
                        <button type="submit" className="btn_blue">Créer</button>
                    </div>
                </form>
            </Slide>

            <Slide title={`Modifier le suivi de ${formData.nom_groupe}`} isOpen={isModifSuiviOpen} toggleOpen={() => setIsModifSuiviOpen(false)}>
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
                        <button type="button" className="btn_red">Supprimer</button>
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