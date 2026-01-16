import React, { useEffect, useState } from 'react';
import LayoutMenu from '../LayoutMenu';

const AddMembre = ({ isOpen, onClose }) => {
    const [infosMembre, setSettingsOf] = useState({ id: '', name: '', role: '' })
    const [membresFamille, setMembresFamille] = useState([])
    const [usernameSearch, setUsernameSearch] = useState("")
    
    // État pour suivre quels membres sont en train de charger
    const [loadingIds, setLoadingIds] = useState(new Set());

    const apiUrl = import.meta.env.VITE_API_URL;

    // Fonction pour activer/désactiver le chargement sur un ID
    const toggleLoading = (id, isLoading) => {
        setLoadingIds(prev => {
            const newSet = new Set(prev);
            if (isLoading) newSet.add(id);
            else newSet.delete(id);
            return newSet;
        });
    };

    const handleAddInvitePersonne = async (id) => {
        toggleLoading(id, true);
        try {
            const response = await fetch(`${apiUrl}/?route=invitepersonnefamille/add`, {
                method: "POST",
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: id })
            });
            const data = await response.json();
            if (data.success) {
                fetchMembres();
            } else {
                console.error("Erreur : " + data.error);
            }
        } catch (error) {
            console.error("Erreur lors de la demande invité :", error);
        } finally {
            toggleLoading(id, false);
        }
    };

    const handleRemoveInvitePersonne = async (id) => {
        toggleLoading(id, true);
        try {
            const response = await fetch(`${apiUrl}/?route=invitepersonnefamille/delete`, {
                method: "POST",
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: id })
            });
            const data = await response.json();
            if (data.success) {
                fetchMembres();
            } else {
                console.error("Erreur : " + data.error);
            }
        } catch (error) {
            console.error("Erreur lors de la demande invité :", error);
        } finally {
            toggleLoading(id, false);
        }
    };

    const fetchMembres = async (valeur = usernameSearch) => {
        try {
            const response = await fetch(`${apiUrl}/?route=allpersonne/view`, {
                method: "POST",
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ texte: valeur })
            });
            const data = await response.json();
            if (Array.isArray(data)) {
                setMembresFamille(data);
            } else if (data.success) {
                setMembresFamille(data.membres || []);
            }
        } catch (error) {
            console.error("Erreur chargement personnes", error);
        }
    };

    useEffect(() => {
        fetchMembres();
    }, [apiUrl]);

    return (
        <LayoutMenu title={"Inviter des contact"}>
            <div className='add_membre'>
                <div className='container_search'>
                    <input type="search" placeholder="Rechercher"
                        onChange={(e) => {
                            setUsernameSearch(e.target.value);
                            fetchMembres(e.target.value);
                        }}
                    />
                </div>

                <div className='membre_list'>
                    {membresFamille.map((membre) => {
                        // On vérifie si CET ID est en train de charger
                        const isThisLoading = loadingIds.has(membre.username);

                        return (
                            <div key={membre.id_personne}>
                                <div className='container_name'>
                                    <p>{membre.nom} {membre.prenom}</p>
                                    <p>{membre.username}</p>
                                </div>

                                <button
                                    onClick={() => {
                                        if (isThisLoading) return; // Empêche de recliquer si ça charge
                                        if (membre.invite) {
                                            handleRemoveInvitePersonne(membre.username);
                                        } else {
                                            handleAddInvitePersonne(membre.username);
                                        }
                                    }}
                                    className={membre.invite ? 'btn-invited' : 'btn-add'}
                                    disabled={isThisLoading}
                                >
                                    {isThisLoading ? (
                                    <svg 
                                        className="loading-icon" 
                                        viewBox="0 0 960 960" 
                                        fill="none" 
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        {/* Cercle de fond (gris léger) */}
                                        {/* Partie qui tourne */}
                                        <path 
                                            d="M480 80q-165 0-282.5 117.5T80 480" 
                                            stroke="var(--blue)" 
                                            strokeWidth="80" 
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                ) : membre.invite ? (
                                    /* Ton SVG Check */
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#4caf50">
                                        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                                    </svg>
                                ) : (
                                    /* Ton SVG Plus */
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                                        <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                                    </svg>
                                )}
                                </button>
                            </div>
                        )
                    })}
                </div>

                <div className='container_btn_invite'>
                    <button className='btn_blue'>Inviter un contact</button>
                </div>
            </div>
        </LayoutMenu>
    )
}

export default AddMembre;