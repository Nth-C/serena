import styles from './AddMembre.module.css';

import LayoutMenu from '../../LayoutMenu'

// Il ne faut pas qu'on puisse afficher tout les aidants d'un coup (il faut une limite)
const AddMembre = ({isOpen, onClose }) => {

    const membreTest = [
        { 
            nom: "Wood",
            prenom: "Barry",
            username: "Big D",
        },
        { 
            nom: "Kirk",
            prenom: "Charlie",
            username: "FreakyGuy",
        },
        {
            nom: "Jeffrey",
            prenom: "Epstein",
            username: "EFN",
        },
        {
            nom: "TATA",
            prenom: "Rayan",
            username: "DZ",
        },
    ];

    return (
        <LayoutMenu
            title={"Inviter des contact"} 
            isOpen={isOpen} 
            onClose={onClose}
        >
            <div className={styles.add_membre}>
                <div className={styles.container_search}>
                    <input type="search" placeholder="Rechercher"/>
                </div>

                <div className={styles.membre_list}>
                    {membreTest.map((membre, i) => (
                        <div key={i}>
                            <div className={styles.container_name}>
                                <p>{membre.nom} {membre.prenom}</p>
                                <p>{membre.username}</p>
                            </div>
                            <button>
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