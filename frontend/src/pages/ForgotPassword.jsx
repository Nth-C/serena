import { useState } from 'react';
import { NavLink } from 'react-router-dom';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const apiUrl = import.meta.env.VITE_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("Envoi en cours...");

        try {
            const response = await fetch(`${apiUrl}/?route=forgot_password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await response.json();

            if (data.success) {
                // Succès : On prévient l'utilisateur
                setMessage("Succès ! " + data.message + " Vérifiez vos spams.");
                setEmail('');
            } else {
                setMessage(data.message || "Une erreur est survenue.");
            }
        } catch (error) {
            setMessage('Erreur réseau : Impossible de contacter le serveur.');
        }
    };

    return (
        <div className="forgot_password">
            <img src="/img/logo-name.png" alt="" />

            <h1>Mot de passe oublié</h1>
            
            {/* Affichage des messages (succès ou erreur) */}
            {message && <p className="message-box">{message}</p>}
            
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Votre Email : </label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                </div>
                <div>
                    <button type="submit" className="btn_blue">Envoyer le lien</button>
                </div>
            </form>

            <span className='border'></span>

            <NavLink to="/login">Retour connexion</NavLink>

            <img src="/img/logo.svg" alt="" />
        </div>
    );
}

export default ForgotPassword;