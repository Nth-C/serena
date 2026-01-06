import { NavLink } from 'react-router-dom';
import { useState } from 'react';

function AcceSuivi() {
    const [message, setMessage] = useState("");

    const apiUrl = import.meta.env.VITE_API_URL; 
    
    const [formData, setFormData] = useState({
        nom_aide: '',
        nom_groupe: '',
        description: ''
    });

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
    return (
        <div className="acce_suivi">
            <img src="/img/logo-name.svg" alt="Logo" />
            <h1>Accéder au suivi</h1>

            {/* Liste des suivis existants */}
            <div className="container_suivi_groupe">
                <div className="principal_infos">
                    <p>Mr Parker</p>
                </div>
                <div className="drop">
                    <p>Description lorem ipsum...</p>
                    <div>
                        <button>Modifier</button>
                        <button>Accéder</button>
                    </div>
                </div>
            </div>

            <hr />

            <div className="information_suivi">
                <button>Creer un suivi</button>
                {message && <p className="success-msg">{message}</p>}
                
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
            </div>

            <img src="/img/logo.svg" alt="Footer Logo" />
        </div>
    );
}

export default AcceSuivi;