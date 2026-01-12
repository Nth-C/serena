import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const apiUrl = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${apiUrl}/?route=forgot_password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await response.json();

            if (data.success) {
                setMessage("Si l'email existe, un lien a été envoyé (Regarde la console pour le lien factice).");
                // POUR LE TEST : On redirige après 2 secondes vers la page de reset
                // Dans la vraie vie, l'utilisateur cliquerait sur un lien dans son mail.
                console.log("LIEN TEST : http://localhost:5173/reset_password?email=" + email);
            } else {
                setMessage(data.message || "Erreur.");
            }
        } catch (error) {
            setMessage('Erreur réseau');
        }
    };

    return (
        <div className="login"> {/* On réutilise le style de login */}
            <h1>Mot de passe oublié</h1>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Votre Email : </label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
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