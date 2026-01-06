import { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Menu.module.css';

function Menu({isOpen , onHamburgerClick}) {
    const navigate = useNavigate();
    const apiUrl = import.meta.env.VITE_API_URL;

    const handleLogout = async () => {
        try {
            await fetch(`${apiUrl}/?route=logout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            navigate('/login');
        } catch (error) {
            console.error('Erreur lors de la déconnexion', error);
        }
    };

    return (
        <div className={[
                    styles.menu,
                    isOpen ? styles.active : '', // si isOpen on ajoute la classe active
                ].join(' ')}>
            <div className={styles.main_container}>
                <div className={styles.header_container}>
                    <div>
                        <button className={styles.hamburger_btn} onClick={onHamburgerClick}>
                            <span></span>
                            <span></span>
                        </button>
                        <p>Paramètre</p> 
                        <img src="" alt="" />
                    </div>
                    <span className={styles.border}></span>
                </div>

                <div className={styles.admin_container}>
                    <div>
                        <h3>Administrateur</h3>
                        <NavLink to={"/"}>
                            <p>Logs</p>
                            <img src="/icons/chevron_right.svg" alt=">" />
                        </NavLink>
                        <NavLink to={"/"}>
                            <p>Inviter des contact</p>
                            <img src="/icons/chevron_right.svg" alt=">" />
                        </NavLink>
                        <NavLink to={"/"}>
                            <p>Gérer les roles</p>
                            <img src="/icons/chevron_right.svg" alt=">" />
                        </NavLink>
                    </div>

                    <span className={styles.border}></span> {/* les span sont pour une annimation */}
                </div>

                <div className={styles.user_container}>
                    <div>
                        <h3>Utilisateur</h3>
                        <NavLink to={"/"}>
                            <p>Profile</p>
                            <img src="/icons/chevron_right.svg" alt=">" />
                        </NavLink>
                        <NavLink to={"/"}>
                            <p>Compte</p>
                            <img src="/icons/chevron_right.svg" alt=">" />
                        </NavLink>
                        <NavLink to={"/"}>
                            <p>Données personnelles</p>
                            <img src="/icons/chevron_right.svg" alt=">" />
                        </NavLink>
                        <NavLink to={"/"}>
                            <p>Notifications</p>
                            <img src="/icons/chevron_right.svg" alt=">" />
                        </NavLink>
                    </div>

                    <span className={styles.border}></span>
                </div>

                <div className={styles.other_container}>
                    <div>
                        <h3>Autre</h3>
                        <NavLink to={"/"}>
                            <p>Accessibilité</p>
                            <img src="/icons/chevron_right.svg" alt=">" />
                        </NavLink>
                        <NavLink to={"/"}>
                            <p>Liste membres</p>
                            <img src="/icons/chevron_right.svg" alt=">" />
                        </NavLink>
                    </div>

                    <span className={styles.border}></span>
                </div>

                <div className={styles.legal_container}>
                    <div>
                        <h3>Legal</h3>
                        <NavLink to={"/"}>
                            <p>Politique de confidentialité</p>
                            <img src="/icons/chevron_right.svg" alt=">" />
                        </NavLink>
                        <NavLink to={"/"}>
                            <p>Conditions d’utilisation</p>
                            <img src="/icons/chevron_right.svg" alt=">" />
                        </NavLink>
                    </div>
                </div>

                <div className={styles.change_container}>
                    <div>
                        <NavLink to={"/"}>
                            <p>Changer de suivi</p>
                            <img src="/icons/chevron_right.svg" alt=">" />
                        </NavLink>
                    </div>

                    <span className={styles.border}></span>
                </div>

                <div className={styles.logout_container}>
                    <div>
                        <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
                            <p>Déconnexion</p>
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.background} onClick={onHamburgerClick}></div>
        </div>
    )
}

export default Menu