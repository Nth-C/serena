import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function ResetPassword() {
    const [formData, setFormData] = useState({ email: '', newMdp: '' });
    const [message, setMessage] = useState('');
    // Nouvel état pour gérer l'affichage de la popup
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    
    const [searchParams] = useSearchParams(); 
    
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        // Pré-remplir l'email s'il est dans l'URL (ex: lien venant du mail)
        const emailParam = searchParams.get('email');
        if (emailParam) {
            setFormData(prev => ({ ...prev, email: emailParam }));
        }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${apiUrl}/?route=reset_password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, newMdp: formData.newMdp })
            });
            const data = await response.json();

            if (data.success) {
                // Au lieu de l'alert, on déclenche l'affichage de la popup
                setShowSuccessPopup(true);
            } else {
                setMessage(data.message || "Erreur lors de la modification.");
            }
        } catch (error) {
            setMessage('Erreur réseau');
        }
    };

    // Fonction pour fermer la popup et rediriger vers le login
    const handleClosePopup = () => {
        setShowSuccessPopup(false);
        navigate('/login');
    };

    return (
        <div className="reset_password">
            <img src="/img/logo-name.png" alt="" />

            <h1>Réinitialisation</h1>

            {/* On cache le message d'erreur si la popup de succès est affichée */}
            {message && !showSuccessPopup && <p style={{color: 'red'}}>{message}</p>}
            
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email du compte : </label>
                    <input 
                        type="email" 
                        value={formData.email} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                        required 
                    />
                </div>
                <div>
                    <label>Nouveau mot de passe : </label>
                    <input 
                        type="password" 
                        value={formData.newMdp} 
                        onChange={(e) => setFormData({...formData, newMdp: e.target.value})} 
                        required 
                    />
                </div>
                <button type="submit" className="btn_blue">Changer le mot de passe</button>
            </form>

            <img src="/img/logo.svg" alt="" />

            {/* --- LE CODE DE LA POPUP --- */}
            {showSuccessPopup && (
                <div className="popup_overlay">
                    <div className="popup_content">
                        <h2>Succès !</h2>
                        <p>Votre mot de passe a été modifié avec succès.</p>
                        <p>Vous pouvez maintenant vous connecter.</p>
                        <button onClick={handleClosePopup} className="btn_blue">
                            Se connecter
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ResetPassword;