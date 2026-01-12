import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function ResetPassword() {
    const [formData, setFormData] = useState({ email: '', newMdp: '' });
    const [message, setMessage] = useState('');
    const [searchParams] = useSearchParams(); // Pour lire ?email=... dans l'url
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
                alert("Mot de passe modifié avec succès !");
                navigate('/login');
            } else {
                setMessage(data.message || "Erreur lors de la modification.");
            }
        } catch (error) {
            setMessage('Erreur réseau');
        }
    };

    return (
        <div className="login">
            <h1>Réinitialisation</h1>
            {message && <p style={{color:'red'}}>{message}</p>}
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
        </div>
    );
}

export default ResetPassword;