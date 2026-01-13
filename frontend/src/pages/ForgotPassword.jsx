import { useState } from 'react';
import { NavLink } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom'; // Pas forcément utile ici si on veut juste afficher un message

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    // const navigate = useNavigate(); // Optionnel
    const apiUrl = import.meta.env.VITE_API_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("Envoi en cours..."); // Feedback immédiat pour l'utilisateur

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
                // Optionnel : Vider le champ
                setEmail('');
            } else {
                // Erreur (Email inconnu ou erreur SMTP)
                setMessage(data.message || "Une erreur est survenue.");
            }
        } catch (error) {
            setMessage('Erreur réseau : Impossible de contacter le serveur.');
        }
    };

    return (
        <div className="login">
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
            <NavLink to="/login">Retour connexion</NavLink>
        </div>
    );
}

export default ForgotPassword;