import React, { useState, useEffect } from 'react';
import './signalement.css';
import Slide from '../components/slide/Slide';
import LayoutMenu from '../LayoutMenu';

const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>;
const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const XCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;

const Signalement = () => {
    const [signalements, setSignalements] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isNewOpen, setIsNewOpen] = useState(false);
    const [formData, setFormData] = useState({ sujet: '', message: '' });
    const [statusMsg, setStatusMsg] = useState({ type: '', msg: '' });

    const apiUrl = import.meta.env.VITE_API_URL;

    // --- 1. CHARGEMENT DES DONNÉES ---
    const fetchSignalements = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}/?route=signalement/list`, {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (Array.isArray(data)) {
                setSignalements(data);
            } else {
                setSignalements([]); // Sécurité si retour vide ou erreur
            }
        } catch (error) {
            console.error("Erreur chargement:", error);
        } finally {
            setLoading(false);
        }
    };

    // Charger les signalements au montage du composant
    useEffect(() => {
        fetchSignalements();
    }, []);

    useEffect(() => {
        fetchSignalements();
    }, []);

    // --- 2. AJOUTER UN SIGNALEMENT (BDD + MAIL) ---
    const handleAdd = async (e) => {
        e.preventDefault();
        setStatusMsg({ type: 'info', msg: 'Envoi en cours...' });

        console.log("DEBUG: API URL =", apiUrl);
        console.log("DEBUG: Form data =", formData);

        try {
            // Enregistrement BDD
            const url = `${apiUrl}/?route=signalement/add`;
            console.log("DEBUG: Sending to URL:", url);
            console.log("DEBUG: Request body:", JSON.stringify(formData));

            const resDb = await fetch(url, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            console.log("DEBUG: Response status:", resDb.status);
            console.log("DEBUG: Response OK:", resDb.ok);

            const dataDb = await resDb.json();
            console.log("DEBUG: Response data:", dataDb);

            if (dataDb.error) throw new Error(dataDb.error);
            if (!dataDb.success) throw new Error("L'ajout a échoué");

            // B. Envoi du Mail (Optionnel)
            try {
                await fetch(`${apiUrl}/?route=mail/send`, { 
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        subject: `[SIGNALEMENT] ${formData.sujet}`,
                        message: formData.message
                    })
                });
            } catch (mailError) {
                console.warn("Mail non envoyé, mais signalement créé:", mailError);
            }

            setStatusMsg({ type: 'success', msg: 'Signalement envoyé avec succès !' });
            setFormData({ sujet: '', message: '' });
            setIsNewOpen(false);
            fetchSignalements(); // Rafraîchir la liste

        } catch (error) {
            console.error("ERROR:", error);
            setStatusMsg({ type: 'error', msg: "Erreur lors de l'envoi : " + error.message });
        }
    };

    // --- 3. MODIFIER LE STATUT ---
    const handleStatusChange = async (id, newStatus) => {
        try {
            const response = await fetch(`${apiUrl}/?route=signalement/update`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_signalement: id,
                    status: newStatus
                })
            });
            const result = await response.json();
            if (result.success) {
                fetchSignalements(); // On recharge la liste pour voir le changement
            }
        } catch (error) {
            console.error("Erreur update:", error);
        }
    };

    // --- 4. SUPPRIMER ---
    const handleDelete = async (id, idPers) => {
        if (!window.confirm("Voulez-vous vraiment supprimer ce signalement ?")) return;

        try {
            const response = await fetch(`${apiUrl}/?route=signalement/delete`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_signalement: id,
                    id_pers_signal: idPers // Nécessaire pour ton DAO
                })
            });
            const result = await response.json();
            if (result.success) {
                fetchSignalements();
            } else {
                alert("Erreur: " + result.error);
            }
        } catch (error) {
            console.error("Erreur delete:", error);
        }
    };

    // Rendu d'un badge de statut
    const renderStatusBadge = (status) => {
        const isClosed = status === 'cloture' || status === 'Clôturé';
        return (
            <span className={`status-badge ${isClosed ? 'closed' : 'open'}`}>
                {isClosed ? 'Clôturé' : 'En cours'}
            </span>
        );
    };

    return (
        <LayoutMenu
            title={"Signalement"}
        >
            <>
            <div className='signalement'>
                <div className="page-header">
                    <h1>Mes Signalements</h1>
                    <button className="btn-primary btn-add" onClick={() => setIsNewOpen(true)}>
                        <PlusIcon /> Nouveau Signalement
                    </button>
                </div>

                {/* LISTE DES SIGNALEMENTS */}
                <div className="signalement-list">
                    {loading ? (
                        <p>Chargement...</p>
                    ) : signalements.length === 0 ? (
                        <div className="empty-state">
                            <p>Aucun signalement pour le moment.</p>
                        </div>
                    ) : (
                        signalements.map((sig) => (
                            <div key={sig.id_signalement} className="signalement-card">
                                <div className="card-header">
                                    <div className="header-left">
                                        <h3>{sig.sujet}</h3>
                                        <span className="date">{new Date(sig.date_creation).toLocaleDateString()}</span>
                                    </div>
                                    <div className="header-right">
                                        {renderStatusBadge(sig.status)}
                                        <button 
                                            className="btn-icon delete"
                                            title="Supprimer"
                                            onClick={() => handleDelete(sig.id_signalement, sig.id_pers_signal)}
                                        >
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="card-body">
                                    <p>{sig.message}</p>
                                </div>

                                <div className="card-footer">
                                    {/* Actions de changement de statut */}
                                    {sig.status !== 'cloture' && (
                                        <button 
                                            className="btn-text success" 
                                            onClick={() => handleStatusChange(sig.id_signalement, 'cloture')}
                                        >
                                            <CheckCircleIcon /> Marquer comme résolu
                                        </button>
                                    )}
                                    {sig.status === 'cloture' && (
                                        <button 
                                            className="btn-text warning" 
                                            onClick={() => handleStatusChange(sig.id_signalement, 'ouvert')}
                                        >
                                            <XCircleIcon /> Rouvrir
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            {/* FORMULAIRE NOUVEAU */}
            <Slide title="Nouveau Signalement" isOpen={isNewOpen} toggleOpen={() => setIsNewOpen(false)}>
                <form onSubmit={handleAdd} className="signalement-form">
                    {statusMsg.msg && (
                        <div className={`alert ${statusMsg.type}`}>
                            {statusMsg.msg}
                        </div>
                    )}
                    
                    <div className="form-group">
                        <label>Sujet</label>
                        <input 
                            type="text" 
                            className="form-input"
                            value={formData.sujet}
                            onChange={(e) => setFormData({...formData, sujet: e.target.value})}
                            required
                            placeholder="Ex: Bug sur l'agenda..."
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Message</label>
                        <textarea 
                            className="form-textarea"
                            value={formData.message}
                            onChange={(e) => setFormData({...formData, message: e.target.value})}
                            required
                            placeholder="Décrivez votre problème en détail..."
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => setIsNewOpen(false)}>Annuler</button>
                        <button type="submit" className="btn-primary">Envoyer</button>
                    </div>
                </form>
            </Slide>
            </>
        </LayoutMenu>
        
    );
};

export default Signalement;