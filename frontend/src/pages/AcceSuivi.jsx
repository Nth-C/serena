import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react'
import Slide from '../components/slide/Slide';

function AcceSuivi() {
    const [message, setMessage] = useState("");

    const apiUrl = import.meta.env.VITE_API_URL;

    const [formData, setFormData] = useState({
        nom_aide: '',
        nom_groupe: '',
        description: ''
    });

    // ajout suivi
    const [isNewSuiviOpen, setIsNewSuiviOpen] = useState(false) // page

    // ajout stock
    const [isModifSuiviOpen, setIsModifSuiviOpen] = useState(false) // page

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await fetch(`${apiUrl}/?route=famille/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                setMessage("Suivi créé avec succès !");
                setShowCreateForm(false);
            } else {
                setMessage("Erreur : " + result.error);
            }
        } catch (error) {
            setMessage("Erreur lors de la connexion au serveur.");
            console.error("Erreur:", error);
        }
    };

    // fonction pour ouvrir/fermer le newMedecine
    const toggleNewSuvi = () => {
        setIsNewSuiviOpen(!isNewSuiviOpen)
    }

    const toggleModifSuivi = () => {
        setIsModifSuiviOpen(!isModifSuiviOpen)
    }

    useEffect(() => {
        if (isNewSuiviOpen) {
            document.documentElement.classList.add('menu-active');
        } else {
            document.documentElement.classList.remove('menu-active');
        }
    }, [isNewSuiviOpen]);

    useEffect(() => {
        if (isModifSuiviOpen) {
            document.documentElement.classList.add('menu-active');
        } else {
            document.documentElement.classList.remove('menu-active');
        }
    }, [isModifSuiviOpen]);

    return (
        <div className="acce_suivi">
            <img src="/img/logo-name.svg" alt="Logo" />
            <h1>Accéder au suivi</h1>

            <div className="list">
                <div className="container_suivi_groupe">
                    <div className="principal_infos">
                        <p>Mr Parker</p>
                    </div>
                    <div className="drop">
                        <p>Description lorem ipsum...</p>
                        <div>
                            <button className="simple" onClick={toggleModifSuivi}>Modifier</button>
                            <button className="fill">Accéder</button>
                        </div>
                    </div>
                </div>
            </div>

            <hr />

            <button className="simple fill"  onClick={toggleNewSuvi}>Creer un nouveau suivi</button>
            {message && <p className="success-msg">{message}</p>}

            <Slide title={"Créer un nouveau suivi"} isOpen={isNewSuiviOpen} onClickNewMedecine={toggleNewSuvi}>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Nom de l'aidé : </label>
                        <input type="text" name="nom_aide" value={formData.nom_aide} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Nom du groupe : </label>
                        <input type="text" name="nom_groupe" value={formData.nom_groupe} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Courte description : </label>
                        <textarea name="description" value={formData.description} onChange={handleChange} required></textarea>
                    </div>
                    <div>
                        <button type="submit" className="simple fill">Créer</button>
                    </div>
                </form>
            </Slide>

            <Slide title={"Modifier le suivi de"} isOpen={isModifSuiviOpen} onClickNewMedecine={toggleModifSuivi}>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Nom de l'aidé : </label>
                        <input type="text" name="nom_aide" value={formData.nom_aide} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Nom du groupe : </label>
                        <input type="text" name="nom_groupe" value={formData.nom_groupe} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Courte description : </label>
                        <textarea name="description" value={formData.description} onChange={handleChange} required></textarea>
                    </div>
                    <div>
                        <button type="submit">Créer</button>
                    </div>
                </form>
            </Slide>

            <img src="/img/logo.svg" alt="Footer Logo" />
        </div>
    );
}

export default AcceSuivi;