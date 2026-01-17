import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Menu.module.css';

import { ROLES, hasPermission } from './../../utils/roleManager';

function Menu({isOpen , onHamburgerClick}) {

    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;
    

    const [username, setUsername] = useState(null);

    useEffect(() => {
        const userData = sessionStorage.getItem('user');
        if (userData) {
            let name = `${JSON.parse(userData).nom} ${JSON.parse(userData).prenom}`
            setUsername(name);
        }
    }, []);
    
    const handleSwitchFamille = () => {
        sessionStorage.removeItem('id_famille');
        sessionStorage.removeItem('role');
        navigate('/acce_suivi');
    }

    const handleLogout = async () => {
        try {
            await fetch(`${apiUrl}/?route=logout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include' 
            });
        } catch (error) {
            console.error('Erreur lors de la déconnexion serveur', error);
        } finally {
            localStorage.removeItem('user');
            sessionStorage.removeItem('role');
            sessionStorage.removeItem('isConnected');
            sessionStorage.removeItem('id_famille');
            onHamburgerClick(); 
            navigate('/login');
        }
    };

    return (
        <>
        <div className={[
                    styles.menu,
                    isOpen ? styles.active : '', 
                ].join(' ')}>
            <div className={styles.main_container}>
                <div className={styles.header_container}>
                    <div>
                        <button className={styles.hamburger_btn} onClick={onHamburgerClick}>
                            <span></span>
                            <span></span>
                        </button>
                        <p>Paramètre</p> 
                        <img src="/img/logo.svg" alt="" />
                    </div>
                    <span className={styles.border}></span>
                </div>

                {/* --- ADMINISTRATEUR --- */}
                {hasPermission("Famille") && 
                <div className={styles.admin_container}>
                    <div>
                        <h3>Administrateur</h3>

                        <NavLink to="/logs" onClick={onHamburgerClick}>
                            <p>Historique</p>
                            <img src="/icons/chevron_right.svg" alt=">" />
                        </NavLink>
                        <NavLink to={"/add_contact"} onClick={onHamburgerClick}>
                            <p>Inviter des contact</p>
                            <img src="/icons/chevron_right.svg" alt=">" />
                        </NavLink>
                        <NavLink to={"/role_membre"} onClick={onHamburgerClick}>
                            <p>Gérer les roles</p>
                            <img src="/icons/chevron_right.svg" alt=">" />
                        </NavLink>
                    </div >
                    <span className={styles.border}></span>
                </div>}

                {/* --- UTILISATEUR --- */}
                <div className={styles.user_container}>
                    <div>
                        <h3>Utilisateur</h3>
                        <NavLink to={"/compte"} onClick={onHamburgerClick}>
                            <p>Compte</p>
                            <img src="/icons/chevron_right.svg" alt=">" />
                        </NavLink>
                        <NavLink to={"/notification"} onClick={onHamburgerClick}>
                            <p>Notifications</p>
                            <img src="/icons/chevron_right.svg" alt=">" />
                        </NavLink>
                    </div>
                    <span className={styles.border}></span>
                </div>

                {/* --- AUTRE --- */}
                <div className={styles.other_container}>
                    <div>
                        <h3>Autre</h3>
                        <NavLink to={"/accessibilite"} onClick={onHamburgerClick}>
                            <p>Accessibilité</p>
                            <img src="/icons/chevron_right.svg" alt=">" />
                        </NavLink>
                        <NavLink to={"/liste_membre"} onClick={onHamburgerClick}>
                            <p>Liste membres</p>
                            <img src="/icons/chevron_right.svg" alt=">" />
                        </NavLink>
                        <NavLink to={"/signalement"} onClick={onHamburgerClick}>
                            <p>Signalement</p>
                            <img src="/icons/chevron_right.svg" alt=">" />
                        </NavLink>
                    </div>
                    <span className={styles.border}></span>
                </div>

                {/* --- LEGAL --- */}
                <div className={styles.legal_container}>
                    <div>
                        <h3>Legal</h3>
                        <NavLink to={"/privacy"} onClick={onHamburgerClick}>
                            <p>Politique de confidentialité</p>
                            <img src="/icons/chevron_right.svg" alt=">" />
                        </NavLink>
                        <NavLink to={"/cgu"} onClick={onHamburgerClick}>
                            <p>Conditions d’utilisation</p>
                            <img src="/icons/chevron_right.svg" alt=">" />
                        </NavLink>
                        <NavLink to={"/legals_mentions"} onClick={onHamburgerClick}>
                            <p>Mentions légales</p>
                            <img src="/icons/chevron_right.svg" alt=">" />
                        </NavLink>
                    </div>
                </div>

                {/* --- CHANGER DE SUIVI --- */}
                <div className={styles.change_container}>
                    <div>
                        <button onClick={handleSwitchFamille}>
                            <p>Changer de suivi</p>
                            <img src="/icons/chevron_right.svg" alt=">" />
                        </button>
                    </div>
                    <span className={styles.border}></span>
                </div>

                {/* --- DÉCONNEXION --- */}
                <div className={styles.logout_container}>
                    <div>
                        {/* verifie si il y a un username de connu */}
                        {username && (
                            <p>{username}</p>
                        )}
                        <button onClick={handleLogout} className={styles.logout_btn}>
                            Déconnexion
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.background} onClick={onHamburgerClick}></div>
        </div>
        
        {/* <AddMembre 
            isOpen={addMembreOpen}
            onClose ={() => setAddMembreOpen(false)}
        />
        <RoleMembre 
            isOpen={roleMembreOpen}
            onClose ={() => setRoleMembreOpen(false)}
        />
        <AuditLog 
            isOpen={logOpen}
            onClose ={() => setLogOpen(false)}
        /> */}

        </>
    )
}

export default Menu;