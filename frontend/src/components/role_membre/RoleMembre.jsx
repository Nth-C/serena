import styles from './RoleMembre.module.css';
import { useState, useEffect } from 'react'
import LayoutMenu from '../../LayoutMenu'

import Slide from '../slide/Slide'

// Il ne faut pas qu'on puisse afficher tout les aidants d'un coup (il faut une limite)
const RoleMembre = ({isOpen, onClose }) => {
const [infosMembre, setSettingsOf] = useState({id : '',name: '', role: ''})
const [settingsOfOpen, setSettingsOfOpen] = useState(false)
const [membresFamille, setMembresFamille] = useState([]) 


const apiUrl = import.meta.env.VITE_API_URL;
// Déclare la fonction en dehors du useEffect
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
    // Petit ajout de sécurité : confirmer la suppression
    
    try {
        const response = await fetch(`${apiUrl}/?route=deletefamillepersonne`, {
            method: "POST", // Indispensable pour envoyer un body
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_personne: id }) // On envoie un objet structuré
        });
        
        const data = await response.json();

        if (data.success) {
            setSettingsOfOpen(false); // Ferme le Slide
            fetchMembres(); // Rafraîchit la liste des membres
        } else {
            console.error("Erreur : " + data.error);
        }
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
    }
};

// Appelle-la au chargement
useEffect(() => {
    fetchMembres();
}, [apiUrl]);

// Appelle-la aussi dans UpdateRole après le succès
const UpdateRole = async (e) => {
if (e) e.preventDefault(); // Empêche le rechargement de page

const donneesAModifier = {
idPersonne: infosMembre.id, // L'identifiant du membre
nouveauRole: infosMembre.role // Le rôle sélectionné dans le <select>
};

console.log(infosMembre.id);

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
// Actions en cas de succès
setSettingsOfOpen(false); // Ferme le Slide
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
            title={"Gérer rôle"} 
            isOpen={isOpen} 
            onClose={onClose}
        >
            <div className={styles.role_membre}>
                <div className={styles.container_search}>
                    <input type="search" placeholder="Rechercher"/>
                </div>

                <div className={styles.membre_list}>
                {membresFamille.map((membre) => (
                    <div key={membre.id}>
                        <div className={styles.container_name}>
                            <p>{membre.nom} {membre.prenom}</p>
                            <p>{membre.role}</p>
                        </div>
                        <button onClick={() => {
                            setSettingsOf({
                            id: membre.id, // <--- AJOUTE CETTE LIGNE (vérifie si c'est .id ou .id_personne dans ton JSON)
                            name: `${membre.nom} ${membre.prenom}`, 
                            role: membre.role,
                            })
                            setSettingsOfOpen(true)
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg>                        
                        </button>
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
            <form className={styles.form_role_membre} onSubmit={UpdateRole}>
                <div>
                    <label>Role :</label>
                    <select
                        name="role" 
                        value={infosMembre.role} 
                        onChange={(e) => setSettingsOf({ ...infosMembre, role: e.target.value })} // selectionne directement le bon role
                    >
                        <option value="Aidant">Aidant</option>
                        <option value="Visiteur">Visiteur</option>
                    </select>
                </div>
                <div>
                    <div>
                        <button 
                            onClick={() => 
                                handleDeletePersonneFromFamille(infosMembre.id)} // Ajoute () => 
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