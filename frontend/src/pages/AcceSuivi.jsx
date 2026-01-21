import { useEffect, useState } from 'react'
import Slide from '../components/slide/Slide';

function FamilleItem({ famille, onModifier, onAcceder, isOpen, onToggle }) {
    return (
        <div className={`container_suivi_groupe ${isOpen ? 'open' : ''}`}>
            <div className="principal_infos" onClick={onToggle}>
                <p>Espace du groupe : {famille.nom}</p> 
            </div>

            {isOpen && (
                <div className="drop">
                    <p>{famille.desc}</p>                     
                    <div className="actions_buttons">
                        <button
                            className="btn_border"
                            onClick={(e) => {
                                e.stopPropagation();
                                onModifier(famille);
                            }}
                        >
                            Modifier
                        </button>
                        <button 
                            className="btn_blue" 
                            onClick={(e) => {
                                e.stopPropagation();
                                onAcceder(famille.id_famille);
                            }}
                        >
                            Entrer
                        </button>                    
                    </div>
                </div>
            )}
        </div>
    );
}


function InvitationItem({ invitation, onModifier, onAcceder, isOpen, onToggle }) {
    return (
        <div className={`container_suivi_groupe ${isOpen ? 'open' : ''}`}>
            <div className="principal_infos" onClick={onToggle}>
                <p>invitation de {invitation.id_invitation} dans le groupe : {invitation.nom_famille}</p> 
            </div>

            {isOpen && (
                <div className="drop">
                    <p>{invitation.desc}</p>                     
                    <div className="actions_buttons">
                        <button
                            className="btn_border"
                            onClick={(e) => {
                                e.stopPropagation();
                                onModifier(invitation);
                            }}
                        >
                            Refuser
                        </button>
                        <button 
                            className="btn_blue" 
                            onClick={(e) => {
                                e.stopPropagation();
                                onAcceder(invitation.id_famille_invitee);
                            }}
                        >
                            Accepter
                        </button>                    
                    </div>
                </div>
            )}
        </div>
    );
}

function AcceSuivi() {
    const [message, setMessage] = useState("");
    const apiUrl = import.meta.env.VITE_API_URL;
    const [familles, setFamilles] = useState([]);
    const [invitations, setInvitations] = useState([]);
    const [openFamilleId, setOpenFamilleId] = useState(null);
    const [openInvitationId, setOpenInvitationId] = useState(null);
    
    // État pour le nom affiché
    const [nomComplet, setNomComplet] = useState(""); 

    const [formData, setFormData] = useState({
        id_famille: null,
        nom_aide: '',
        nom_groupe: '',
        description: ''
    });

    const [isNewSuiviOpen, setIsNewSuiviOpen] = useState(false);
    const [isModifSuiviOpen, setIsModifSuiviOpen] = useState(false);

    const fetchFamilles = async () => {
        try {
            const response = await fetch(`${apiUrl}/?route=famille/all`, {
                credentials: 'include' 
            });
            const data = await response.json();
            setFamilles(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Erreur chargement familles:", error);
        }
    };

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

    useEffect(() => {
        fetchFamilles();
        fetchInvites();

        // --- LOGIQUE DE NOM MODIFIEE ---
        const userStored = sessionStorage.getItem('user');
        if (userStored) {
            try {
                const user = JSON.parse(userStored);
                
                // Priorité 1 : Si on a le vrai nom et prénom dans la base
                if (user.nom && user.prenom) {
                    setNomComplet(`${user.nom} ${user.prenom}`);
                } 
                // Priorité 2 : Si on a juste le nom
                else if (user.nom) {
                    setNomComplet(user.nom);
                } 
                // Priorité 3 : On bricole le username (ex: "scapinb" -> "Scapin")
                else if (user.username) {
                    let text = user.username;
                    
                    // Si le texte est assez long, on applique la transformation
                    if (text.length > 1) {
                        // 1. On enlève le dernier caractère
                        text = text.slice(0, -1);
                        
                        // 2. On met la première lettre en majuscule + le reste en minuscule
                        text = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
                    }
                    
                    setNomComplet(text);
                }
            } catch (e) {
                console.error("Erreur lecture user", e);
            }
        }
        // ----------------------------------
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const toggleFamille = (id) => {
        setOpenFamilleId(openFamilleId === id ? null : id);
    };

    const toggleInvitation = (id) => {
        setOpenInvitationId(openInvitationId === id ? null : id);
    };

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
                fetchInvites();
                fetchFamilles();
            }
        } catch (error) {
            console.error("Erreur selection famille", error);
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
                fetchInvites();
            }
        } catch (error) {
            console.error("Erreur selection famille", error);
        }
    };

    const handleAcceder = async (id_famille) => {
        try {
            const response = await fetch(`${apiUrl}/?route=famille/select`, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', 
                body: JSON.stringify({ id_famille })
            });
            const data = await response.json();
            if (data.success) {
                localStorage.setItem('id_famille_active', id_famille);
                sessionStorage.setItem('id_famille', id_famille);
                sessionStorage.setItem('role', data.role);
                window.location.href = '/home/dashboard';
            }
        } catch (error) {
            console.error("Erreur selection famille", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        try {
            const response = await fetch(`${apiUrl}/?route=famille/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData),
            });
            const result = await response.json();

            if (result.success) {
                setMessage("Suivi créé avec succès !");
                setIsNewSuiviOpen(false);
                setFormData({ id_famille: null, nom_aide: '', nom_groupe: '', description: '' });
                fetchFamilles();
            } else {
                setMessage("Erreur : " + result.error);
            }
        } catch (error) {
            setMessage("Erreur technique lors de l'enregistrement.");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage("");
        try {
            const response = await fetch(`${apiUrl}/?route=famille/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData),
            });
            const result = await response.json();

            if (result.success) {
                setMessage("Modification enregistrée !");
                setIsModifSuiviOpen(false);
                fetchFamilles();
            } else {
                setMessage("Erreur : " + result.error);
            }
        } catch (error) {
            console.error("Erreur mise à jour:", error);
        }
    };

    const handleQuitterFamille = async (id_famille) => {
        try {
            const response = await fetch(`${apiUrl}/?route=famille/quitter`, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', 
                body: JSON.stringify({ id_famille })
            });
            const data = await response.json();
            if (data.success) {
                setIsModifSuiviOpen(false);
                fetchFamilles();
            }
        } catch (error) {
            console.error("Erreur selection famille", error);
        }
    };

    const handleOpenModif = (famille) => {
        setFormData({
            id_famille: famille.id_famille,
            nom_aide: famille.nom_aide,
            nom_groupe: famille.nom,
            description: famille.desc
        });
        setIsModifSuiviOpen(true);
    };

    const toggleNewSuvi = () => {
        setFormData({ id_famille: null, nom_aide: '', nom_groupe: '', description: '' });
        setIsNewSuiviOpen(!isNewSuiviOpen);
    };

    useEffect(() => {
        const isActive = isNewSuiviOpen || isModifSuiviOpen;
        document.documentElement.classList.toggle('menu-active', isActive);
    }, [isNewSuiviOpen, isModifSuiviOpen]);

    return (
        <div className="acce_suivi">
            <img src="/img/logo-name.png" alt="Logo" />
            
            {/* Le message affichera désormais "Bienvenue M. Scapin" pour "scapinb" */}
            <h1 className="bienvenue">Bienvenue, {nomComplet}</h1>
            
            <h1>Mes groupes : </h1>

            <div className="list">
                {familles.length > 0 ? (
                    familles.map((famille) => (
                        <FamilleItem
                            key={famille.id_famille}
                            famille={famille}
                            onModifier={handleOpenModif}
                            onAcceder={handleAcceder}
                            isOpen={openFamilleId === famille.id_famille}
                            onToggle={() => toggleFamille(famille.id_famille)}
                        />
                    ))
                ) : (
                    <p className="aucun">Vous ne faites parties d'aucun groupe.</p>
                )}
            </div>


            <h1>Invitations en attente : </h1>

            <div className="list">
                {invitations.length > 0 ? (
                    invitations.map((invitation) => (
                        <InvitationItem
                            key={invitation.id_invitation}
                            invitation={invitation}
                            onModifier={handleRefuser}
                            onAcceder={handleAccepter}
                            isOpen={openInvitationId === invitation.id_invitation}
                            onToggle={() => toggleInvitation(invitation.id_invitation)}
                        />
                    ))
                ) : (
                    <p className="aucun">Aucune Invitation en attente.</p>
                )}
            </div>

            <span className='border'></span>

            <button className="btn_blue creer_suivi" onClick={toggleNewSuvi}>Créer un nouveau groupe</button>
            {message && <p className="success-msg">{message}</p>}

            <Slide title={"Créer un nouveau groupe"} isOpen={isNewSuiviOpen} toggleOpen={toggleNewSuvi}>
                <form className='add_famille' onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nom de la personne aidé : </label>
                        <input type="text" name="nom_aide" value={formData.nom_aide} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Nom du groupe : </label>
                        <input type="text" name="nom_groupe" value={formData.nom_groupe} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Information importante sur le groupe : </label>
                        <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
                    </div>
                    <div>
                        <button type="button" className="btn_border" onClick={toggleNewSuvi}>Annuler</button>
                        <button type="submit" className="btn_blue">Créer</button>
                    </div>
                </form>
            </Slide>

            <Slide title={`Modifier le suivi de ${formData.nom_groupe}`} isOpen={isModifSuiviOpen} toggleOpen={() => setIsModifSuiviOpen(false)}>
                <form className='edit_famille' onSubmit={handleUpdate}>
                    <div className="form-group">
                        <label>Nom de l'aidé : </label>
                        <input type="text" name="nom_aide" value={formData.nom_aide} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Nom du groupe : </label>
                        <input type="text" name="nom_groupe" value={formData.nom_groupe} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Courte description : </label>
                        <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
                    </div>
                    <div className="form-actions">
                        <button type="button" className="btn_red" onClick={() => handleQuitterFamille(formData.id_famille)}>Quitter la famille</button>
                    </div>
                    <div>
                        <button type="button" className="btn_border" onClick={() => setIsModifSuiviOpen(false)}>Annuler</button>
                        <button type="submit" className="btn_blue">Enregistrer</button>
                    </div>
                </form>
            </Slide>
            <img src="/img/logo.svg" alt="Footer Logo" />
        </div>
    );
}

export default AcceSuivi;