import styles from './RoleMembre.module.css';
import { useState } from 'react'

import Slide from '../slide/Slide'

// Il ne faut pas qu'on puisse afficher tout les aidants d'un coup (il faut une limite)
const RoleMembre = ({isOpen, onClose }) => {
    const [infosMembre, setSettingsOf] = useState({name: '', role: '',})
    const [settingsOfOpen, setSettingsOfOpen] = useState(false)


    const membreTest = [
        { 
            nom: "Wood",
            prenom: "Barry",
            username: "Big D",
            role: "Aidant",
        },
        { 
            nom: "Kirk",
            prenom: "Charlie",
            username: "FreakyGuy",
            role: "Visiteur",
        },
        {
            nom: "Jeffrey",
            prenom: "Epstein",
            username: "EFN",
            role: 'Visiteur',
        },
    ];

    return (
        <>
        <div className={[
            styles.role_membre,
            isOpen ? styles.active : ''
        ].join(' ')}>
            <div className={styles.params_header}>
                <button onClick={onClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" ><path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/></svg>                </button>
                <h2>Gérer rôle</h2>
            </div>

            <div className={styles.container_search}>
                <input type="search" placeholder="Rechercher"/>
            </div>

            <div className={styles.membre_list}>
                {membreTest.map((membre, i) => (
                    <div key={i}>
                        <div className={styles.container_name}>
                            <p>{membre.nom} {membre.prenom}</p>
                            <p>{membre.role}</p>
                        </div>
                        <button onClick={() => {
                            setSettingsOf({name : `${membre.nom} ${membre.prenom}`, role: membre.role,})
                            setSettingsOfOpen(true)
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg>                        
                        </button>
                    </div>
                ))}
            </div>
        </div>

        
        <Slide
            title={infosMembre.name || ''}
            isOpen={settingsOfOpen}
            toggleOpen={() => setSettingsOfOpen(false)}
            zIndex={"9999"}
        >
            <form className={styles.form_role_membre}>
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
                        <button className='btn_red'>Retirer l’aidant</button>
                    </div>
                    <div>
                        <button className='btn_border'>Annuler</button>
                        <button className='btn_blue'>Valider</button>
                    </div>
                </div>
            </form>
        </Slide>
        </>
    )
}

export default RoleMembre;