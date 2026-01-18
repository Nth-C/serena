import { useEffect, useState } from 'react';
import LayoutMenu from '../LayoutMenu';

// --- Composant pour une carte d'Invitation (Style AcceSuivi) ---
const InvitationCard = ({ invitation, onAccepter, onRefuse }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`container_suivi_groupe ${isOpen ? 'open' : ''}`}>
            <div className="principal_infos" onClick={() => setIsOpen(!isOpen)}>
                <p>Invitation : {invitation.nom_famille}</p>
                {/* Petite flèche ou indicateur visuel optionnel */}
            </div>

            {isOpen && (
                <div className="drop">
                    <p><strong>Message :</strong> {invitation.desc || "Aucune description"}</p>
                    <p>Invité par: {invitation.id_invitation}</p>
                    
                    <div className="actions_buttons">
                        <button
                            className="btn_border"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRefuse(invitation.id_famille_invitee || invitation.id_famille); // Ajuster selon votre clé API
                            }}
                        >
                            Refuser
                        </button>
                        <button
                            className="btn_blue"
                            onClick={(e) => {
                                e.stopPropagation();
                                onAccepter(invitation.id_famille_invitee || invitation.id_famille); // Ajuster selon votre clé API
                            }}
                        >
                            Accepter
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Composant pour une carte de Trajet (Style Dashboard) ---
const TrajetCard = ({ trajet }) => {
    return (
        <div className='alerte_dashbord'>
            {/* Icône Voiture/Trajet */}
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
                <path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z" />
            </svg>

            <div>
                <div>
                    <h3>Demande de Trajet</h3>
                    {/* Affichez les détails réels du trajet si disponibles dans l'objet trajet */}
                    <p>{trajet.description || "Détails du trajet non spécifiés"}</p>
                    {trajet.date && <p><small>Date : {trajet.date}</small></p>}
                </div>
            </div>

            {/* Icône Flèche/Action */}
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
                <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
            </svg>
        </div>
    );
};


const Notification = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    
    const [invitations, setInvitations] = useState([]);
    const [trajets, setTrajets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(""); // Pour les succès d'action

    // --- 1. Charger les Invitations ---
    const fetchInvites = async () => {
        try {
            const response = await fetch(`${apiUrl}/?route=invitation/view`, {
                credentials: 'include'
            });
            const data = await response.json();
            setInvitations(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Erreur chargement invitations:", error);
        }
    };

    // --- 2. Charger les Trajets (via Dashboard endpoint) ---
    const fetchTrajets = async () => {
        try {
            const response = await fetch(`${apiUrl}/?route=dashboard/view`, {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.trajets && Array.isArray(data.trajets)) {
                setTrajets(data.trajets);
            } else {
                setTrajets([]);
            }
        } catch (error) {
            console.error("Erreur chargement trajets:", error);
            setError("Impossible de charger les trajets");
        }
    };

    // Charger tout au démarrage
    useEffect(() => {
        const loadAll = async () => {
            setLoading(true);
            await Promise.all([fetchInvites(), fetchTrajets()]);
            setLoading(false);
        };
        loadAll();
    }, []);


    // --- Actions sur les invitations ---
    const handleAccepter = async (id_famille) => {
        try {
            const response = await fetch(`${apiUrl}/?route=invitation/accepter`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ id_famille })
            });
            const data = await response.json();
            if (data.success) {
                setMessage("Invitation acceptée !");
                fetchInvites(); // Rafraîchir la liste
                setTimeout(() => setMessage(""), 3000);
            }
        } catch (error) {
            console.error("Erreur acceptation", error);
        }
    };

    const handleRefuser = async (id_famille) => {
        try {
            const response = await fetch(`${apiUrl}/?route=invitation/refuser`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ id_famille })
            });
            const data = await response.json();
            if (data.success) {
                setMessage("Invitation refusée.");
                fetchInvites(); // Rafraîchir la liste
                setTimeout(() => setMessage(""), 3000);
            }
        } catch (error) {
            console.error("Erreur refus", error);
        }
    };

    return (
        <LayoutMenu title={"Notifications"}>
            <div className='notification'>
                
                {/* Feedback message */}
                {message && <div className="success-msg">{message}</div>}

                {/* --- Section Invitations --- */}
                <div className="notif_trajet">
                    <h2>Invitations aux suivis</h2>
                    
                    {invitations.length === 0 ? (
                        <p className="aucun">Aucune invitation en attente</p>
                    ) : (
                        <div className="list">
                            {invitations.map((inv) => (
                                <InvitationCard 
                                    key={inv.id_invitation} 
                                    invitation={inv} 
                                    onAccepter={handleAccepter}
                                    onRefuse={handleRefuser}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* --- Section Trajets --- */}
                <div className="notif_trajet">
                    <h2>Demandes de trajet</h2>
                    
                    {trajets.length === 0 ? (
                        <p className="aucun">Aucune demande de trajet</p>
                    ) : (
                        <div className="list">
                            {trajets.map((t, index) => (
                                <TrajetCard key={t.id || index} trajet={t} />
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </LayoutMenu>
    );
}

export default Notification;