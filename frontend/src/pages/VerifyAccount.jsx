import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function VerifyAccount() {
  const [loading, setLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleVerification = async () => {
    const token = searchParams.get('token');

    if (!token) {
        setLoading(false);
        setMessage("Lien invalide : aucun token trouvé.");
        return;
    }

    try {
      const response = await fetch(`${apiUrl}/?route=verify_account`, {
        method: "POST", 
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: token })
      });

      const result = await response.json();

      if (result.success) {
        setIsSuccess(true);
        setMessage(result.message || "Votre compte a été activé avec succès !");
        
        // Redirection automatique après 3s
        setTimeout(() => {
            navigate('/login');
        }, 3000);

      } else {
        setIsSuccess(false);
        setMessage(result.message || "Erreur lors de l'activation du compte.");
      }

    } catch (error) {
      console.error("Erreur réseau:", error);
      setMessage("Impossible de contacter le serveur.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    handleVerification();
  }, []);

  return (
    // J'utilise la classe .login car ton CSS centre déjà tout parfaitement avec
    <div className="login">
      
      {/* Emplacement pour le logo, comme défini dans ton CSS .login img:first-child */}
      <img src="/icons/logo.svg" alt="Sere-na" onError={(e) => e.target.style.display='none'} />

      <h1>Activation du compte</h1>

      {/* On simule la largeur du formulaire pour garder la cohérence du design */}
      <div style={{ width: '95%', display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
          
          {loading ? (
            <p className="aucun">Vérification en cours...</p>
          ) : (
            <>
                {/* Message de statut */}
                <div style={{ textAlign: 'center', width: '100%' }}>
                    <h2 style={{ color: isSuccess ? 'var(--blue)' : 'var(--red)', marginBottom: '1rem' }}>
                        {isSuccess ? "Compte Validé" : "Erreur"}
                    </h2>
                    <p style={{ textAlign: 'center' }}>{message}</p>
                </div>

                {/* Boutons d'action */}
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    {isSuccess ? (
                        <button className="btn_blue" style={{ width: '60%' }} onClick={() => navigate('/login')}>
                            Se connecter
                        </button>
                    ) : (
                        <button className="btn_border" style={{ width: '60%' }} onClick={() => navigate('/create_account')}>
                            Retour à l'inscription
                        </button>
                    )}
                </div>
            </>
          )}
      </div>

      {/* Image de décoration du bas, si tu en as une (gérée par ton CSS .login img:last-child) */}
      <img src="/images/decor-bas.png" alt="" onError={(e) => e.target.style.display='none'} />
      
    </div>
  )
}

export default VerifyAccount;