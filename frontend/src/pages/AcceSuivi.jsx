import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react'
import Slide from '../components/slide/Slide';

// Le sous-composant reçoit maintenant l'information de visibilité du parent
function FamilleItem({ famille, onModifier, isOpen, onToggle }) {
    return (
        <div className={`container_suivi_groupe ${isOpen ? 'open' : ''}`}>
            <div 
                className="principal_infos" 
                onClick={onToggle} // Déclenche la fonction du parent
            >
                <p>{famille.nom}</p> 
            </div>

            {isOpen && (
                <div className="drop">
                    <p>{famille.desc}</p>                     
                    <div className="actions_buttons">
                        <button 
                            className="simple" 
                            onClick={(e) => {
                                e.stopPropagation(); 
                                onModifier(famille); 
                            }}
                        >
                            Modifier
                        </button>
                        <button className="fill">Accéder</button>
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
        nom_aide: '',
        nom_groupe: '',
        description: ''
    });

    const [isNewSuiviOpen, setIsNewSuiviOpen] = useState(false);
    const [isModifSuiviOpen, setIsModifSuiviOpen] = useState(false);

    const toggleFamille = (id) => {
        setOpenFamilleId(openFamilleId === id ? null : id);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const fetchFamilles = async () => {
        try {
            const response = await fetch(`${apiUrl}/?route=famille/all`);
            const data = await response.json();
            setFamilles(data);
        } catch (error) {
            console.error("Erreur chargement familles:", error);
        }
    };

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
                setFormData({ nom_aide: '', nom_groupe: '', description: '' });
                fetchFamilles(); 
            } else {
                setMessage("Erreur : " + result.error);
            }
        } catch (error) {
            setMessage("Erreur technique lors de l'enregistrement.");
            console.error("Détails:", error);
        }
    };

    const toggleNewSuvi = () => setIsNewSuiviOpen(!isNewSuiviOpen);
    
    const handleOpenModif = (famille) => {
        setFormData({
            nom_aide: famille.nom_aide,
            nom_groupe: famille.nom,
            description: famille.desc
        });
        setIsModifSuiviOpen(true);
    };

    useEffect(() => {
        fetchFamilles();
    }, []);

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
                            // L'élément est ouvert si son ID correspond à l'état stocké
                            isOpen={openFamilleId === famille.id_famille}
                            onToggle={() => toggleFamille(famille.id_famille)}
                        />
                    ))
                ) : (
                    <p>Aucun suivi disponible.</p>
                )}
            </div>

            <hr />

            <button className="simple fill" onClick={toggleNewSuvi}>Creer un nouveau suivi</button>
            {message && <p className="success-msg">{message}</p>}

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
                        <button type="submit" className="simple fill">Créer</button>
                    </div>
                </form>
            </Slide>

            <Slide title={`Modifier le suivi de ${formData.nom_groupe}`} isOpen={isModifSuiviOpen} onClickNewMedecine={() => setIsModifSuiviOpen(false)}>
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
                    <div className="form-actions">
                        <button type="button" onClick={() => setIsModifSuiviOpen(false)}>Annuler</button>
                        <button type="submit">Enregistrer les modifications</button>
                    </div>
                </form>
            </Slide>

            <img src="/img/logo.svg" alt="Footer Logo" />
        </div>
    );
}

export default AcceSuivi;