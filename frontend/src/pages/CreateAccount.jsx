import { NavLink, useNavigate } from 'react-router-dom'; // Ajout de useNavigate
import { useState } from 'react';

function CreateAccount() {
    const navigate = useNavigate(); // Initialisation du hook de navigation
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        mail: '',
        username: '',
        mdp: '',
        confirmMdp: '',
        date_naissance: ''
    });
    const [message, setMessage] = useState('');

    const apiUrl = import.meta.env.VITE_API_URL;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

   const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.mdp !== formData.confirmMdp) {
        setMessage('Les mots de passe ne correspondent pas');
        return;
    }

    try {
        // On utilise FormData pour que PHP reçoive les données dans $_POST
        const dataToSend = new FormData();
        dataToSend.append('nom', formData.nom);
        dataToSend.append('prenom', formData.prenom);
        dataToSend.append('mail', formData.mail);
        dataToSend.append('username', formData.username);
        dataToSend.append('mdp', formData.mdp);
        dataToSend.append('date_naissance', formData.date_naissance);

        const response = await fetch(`${apiUrl}/?route=register`, {
            method: 'POST',
            body: dataToSend 
        });

        // On vérifie si la réponse est du JSON valide
        const result = await response.json();

        if (response.ok && result.success) {
            setMessage('Inscription réussie !');
            setTimeout(() => navigate('/'), 1500);
        } else {
            setMessage(result.error || 'Erreur lors de l\'inscription');
        }
    } catch (error) {
        console.error("Erreur détaillée:", error);
        setMessage('Erreur de connexion au serveur');
    }
};

    return (
        <div className="create_account">
            <img src="/img/logo-name.svg" alt="" />

            <h1>Créer un compte</h1>
            
            {/* Affichage du message avec une couleur simple pour la visibilité */}
            {message && (
                <p style={{ color: message.includes('réussie') ? 'green' : 'red' }}>
                    {message}
                </p>
            )}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>E-mail : </label>
                    <input type="email" name="mail" value={formData.mail} onChange={handleChange} placeholder="exemple@gmail.com" required />
                </div>
                <div>
                    <label>Mot de passe : </label>
                    <input type="password" name="mdp" value={formData.mdp} onChange={handleChange} required />
                </div>
                <div>
                    <label>Confirmation de mot de passe : </label>
                    <input type="password" name="confirmMdp" value={formData.confirmMdp} onChange={handleChange} required />
                </div>
                <div>
                    <div>
                        <label>Nom : </label>
                        <input type="text" name="nom" value={formData.nom} onChange={handleChange} placeholder="Doe" required />
                    </div>
                    <div>
                        <label>Prénom : </label>
                        <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} placeholder="John" required />
                    </div>
                </div>
                <div>
                    <label>Nom d'utilisateur : </label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="John_Doe" required />
                </div>

                <div>
                    <NavLink to="/" className="btn_border">Retour</NavLink>

                    <button type="submit" className="btn_blue">Créer</button>
                </div>
            </form>

            <img src="/img/logo.svg" alt="" />
        </div>
    );
}

export default CreateAccount;