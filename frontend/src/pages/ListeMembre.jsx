import { useState, useEffect } from 'react'
import LayoutMenu from '../LayoutMenu'

import Slide from '../components/slide/Slide'

const RoleMembre = ({ isOpen, onClose }) => {
    // Les états pour la modification sont toujours là mais ne servent plus
    const [infosMembre, setSettingsOf] = useState({ id: '', name: '', role: '' })
    const [settingsOfOpen, setSettingsOfOpen] = useState(false)
    const [membresFamille, setMembresFamille] = useState([])

    const apiUrl = import.meta.env.VITE_API_URL;

    const fetchMembres = async () => {
        try {
            const response = await fetch(`${apiUrl}/?route=getfamillepersonne`, {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setMembresFamille(data.membres);
            }
        } catch (error) {
            console.error("Erreur chargement famille", error);
        }
    };

    const handleDeletePersonneFromFamille = async (id) => {
        try {
            const response = await fetch(`${apiUrl}/?route=deletefamillepersonne`, {
                method: "POST",
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id_personne: id })
            });

            const data = await response.json();

            if (data.success) {
                setSettingsOfOpen(false);
                fetchMembres();
            } else {
                console.error("Erreur : " + data.error);
            }
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
        }
    };

    useEffect(() => {
        fetchMembres();
    }, [apiUrl]);

    const UpdateRole = async (e) => {
        if (e) e.preventDefault();
        const donneesAModifier = {
            idPersonne: infosMembre.id,
            nouveauRole: infosMembre.role
        };
        const route = 'rolepersonne/update';

        try {
            const response = await fetch(`${apiUrl}/?route=${route}`, {
                method: "POST",
                credentials: 'include',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(donneesAModifier)
            });
            const result = await response.json();
            if (result.success) {
                setSettingsOfOpen(false);
                fetchMembres();
            } else {
                console.error("Erreur serveur:", result.error);
            }
        } catch (error) {
            console.error("Erreur réseau:", error);
        }
    };

    return (
        <>
            <LayoutMenu
                title={"Liste membre"}
                isOpen={isOpen}
                onClose={onClose}
            >
                <div className="add_membre">
                    <div className="container_search">
                        <input type="search" placeholder="Rechercher" />
                    </div>

                    <div className="membre_list">
                        {membresFamille.map((membre) => (
                            <div key={membre.id}>
                                <div className="container_name">
                                    <p>{membre.nom} {membre.prenom}</p>
                                    <p>{membre.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </LayoutMenu>

            <Slide
                title={infosMembre.name || ''}
                isOpen={settingsOfOpen}
                toggleOpen={() => setSettingsOfOpen(false)}
                zIndex={"9999"}
            >
                <form className="form_role_membre" onSubmit={UpdateRole}>
                    <div>
                        <label>Role :</label>
                        <select
                            name="role"
                            value={infosMembre.role}
                            onChange={(e) => setSettingsOf({ ...infosMembre, role: e.target.value })}
                        >
                            <option value="Aidant">Aidant</option>
                            <option value="Visiteur">Visiteur</option>
                        </select>
                    </div>
                    <div>
                        <div>
                            <button
                                onClick={() => handleDeletePersonneFromFamille(infosMembre.id)}
                                type="button"
                                className='btn_red'
                            >Retirer l’aidant
                            </button>
                        </div>
                        <div>
                            <button type="button" className='btn_border'>Annuler</button>
                            <button className='btn_blue'>Valider</button>
                        </div>
                    </div>
                </form>
            </Slide>
        </>
    )
}

export default RoleMembre;