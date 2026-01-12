import styles from './AddMembre.module.css';
import { useState, useEffect } from 'react'
import LayoutMenu from '../../LayoutMenu'

// Il ne faut pas qu'on puisse afficher tout les aidants d'un coup (il faut une limite)
const AddMembre = ({isOpen, onClose }) => {
    
    const [infosMembre, setSettingsOf] = useState({id : '',name: '', role: ''})
    const [membresFamille, setMembresFamille] = useState([]) 
    const [usernameSearch , setUsernameSearch] = useState("")

    const apiUrl = import.meta.env.VITE_API_URL;
    
    const handleAddInvitePersonne = async (id) => {
    // Petit ajout de sécurité : confirmer la suppression
    
    try {
        const response = await fetch(`${apiUrl}/?route=invitepersonnefamille/add`, {
            method: "POST", // Indispensable pour envoyer un body
            credentials: 'include',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: id }) // On envoie un objet structuré
        });
        
        const data = await response.json();

        if (data.success) {
            fetchMembres(); // Rafraîchit la liste des membres
        } else {
            console.error("Erreur : " + data.error);
        }
    } catch (error) {
        console.error("Erreur lors de la demande invité :", error);
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

        // On vérifie si data est un tableau (puisque c'est ce que ton PHP renvoie)
        if (Array.isArray(data)) {
            setMembresFamille(data);
        } else if (data.success) {
            // Au cas où tu modifies ton PHP plus tard pour renvoyer {success: true, membres: []}
            setMembresFamille(data.membres || []);
        }
    } catch (error) {
        console.error("Erreur chargement personnes", error);
    }
};

// Appelle-la au chargement
useEffect(() => {
    fetchMembres();
}, [apiUrl]);

    return (
        <LayoutMenu
            title={"Inviter des contact"} 
            isOpen={isOpen} 
            onClose={onClose}
        >
            <div className={styles.add_membre}>
                <div className={styles.container_search}>
                    <input type="search" placeholder="Rechercher"
                    onChange={(e) => {
                    setUsernameSearch(e.target.value);
                    if(e.target.value != ""){
                    fetchMembres(e.target.value);
                    }
               
              }}
                    
                    />
                </div>

                <div className={styles.membre_list}>
                    {membresFamille.map((membre) => (
                        <div key={membre.id}>
                            <div className={styles.container_name}>
                                <p>{membre.nom} {membre.prenom}</p>
                                <p>{membre.username}</p>
                            </div>
                            <button onClick={() => {
                                handleAddInvitePersonne(membre.username)
                            }}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>
                            </button>
                        </div>
                    ))}
                </div>

                <div className={styles.container_btn_invite}>
                    <button className='btn_blue'>Inviter un contact</button>
                </div>
            </div>
        </LayoutMenu>
    )
}

export default AddMembre;