import { NavLink } from 'react-router-dom';
import { useState } from 'react';

function CreateAccount() {
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
            const response = await fetch(`${apiUrl}/?route=register`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" }, // type de donnée envoyer
                body: new URLSearchParams({
                    nom: formData.nom,
                    prenom: formData.prenom,
                    mail: formData.mail,
                    username: formData.username,
                    mdp: formData.mdp,
                    date_naissance: formData.date_naissance
                })
            });
            if (response.ok) {
                setMessage('Inscription réussie !');
                // Redirect to login
                window.location.href = '/';
            } else {
                setMessage('Erreur lors de l\'inscription');
            }
        } catch (error) {
            setMessage('Erreur de connexion');
        }
    };

    return (
        <div className="login">
            <img src="../../public/img/logo-name.svg" alt="" />

            <h1>Créer un compte</h1>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
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
                        <label>Date de naissance : </label>
                        <input type="date" name="date_naissance" value={formData.date_naissance} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Nom d'utilisateur : </label>
                        <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="John_Doe" required />
                    </div>
                </div>
                <div>
                    <NavLink to="/">
                        <button type="button" className="simple">Retour</button>
                    </NavLink>

                    <button type="submit" className="simple fill">Créer</button>
                </div>
            </form>

            <img src="../../public/img/logo.svg" alt="" />
        </div>
    )
};

export default CreateAccount