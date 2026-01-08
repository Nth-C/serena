import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';

// 👇 IMPORTANT : On récupère la fonction "onLogin" envoyée par App.jsx
function Login({ onLogin }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ username: '', mdp: '' });
    const [message, setMessage] = useState('');

    const apiUrl = import.meta.env.VITE_API_URL; 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${apiUrl}/?route=login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username : formData.username, mdp : formData.mdp })
            });
            const data = await response.json();

            if (data.success) {
                // ✅ CORRECTION ICI
                // 1. On cherche le nom dans data.nom, data.user ou data.username
                // (Adaptez selon ce que votre PHP renvoie vraiment)
                const utilisateurConnecte = data.nom || data.user || data.username || formData.username;

                // 2. On prévient App.jsx que c'est bon
                if (onLogin) {
                    onLogin(utilisateurConnecte);
                }
                
                // Note : On ne fait plus de window.location.href ici, 
                // c'est App.jsx qui gère la redirection.
            } else {
                setMessage(data.message || "Identifiants incorrects");
            }
        } catch (error) {
            console.error("Erreur login:", error);
            setMessage('Erreur de connexion au serveur');
        }
    };

    return (
        <div className="login">
            <img src="/img/logo-name.svg" alt="Logo" />

            <h1>Se connecter</h1>
            {message && <p style={{color: 'red', fontWeight: 'bold'}}>{message}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nom d'utilisateur : </label>
                    <input 
                        type="text" 
                        name="username" 
                        value={formData.username} 
                        onChange={handleChange} 
                        placeholder="John_Doe" 
                        required 
                    />
                </div>
                <div>
                    <label>Mot de passe : </label>
                    <input 
                        type="password" 
                        name="mdp" 
                        value={formData.mdp} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div>
                    <NavLink to="/create_account">
                        <p>Mot de passe oublié ?</p>
                    </NavLink>
                </div>
                <div>
                    <button type="submit" className="btn_blue">Se connecter</button>
                </div>
            </form>

            <span className='border'></span>

            <NavLink className="btn_border" to={"/create_account"}>
                Créer un compte
            </NavLink>

            <img src="/img/logo.svg" alt="" />
        </div>
    )
};

export default Login;