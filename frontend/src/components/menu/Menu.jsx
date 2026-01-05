import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom';
import styles from './Menu.module.css';

function Menu({active}) {

    return (
        <div className={styles.menu}>
            <div className={styles.main_container}>
                <div>
                    <div>
                        <button className={styles.hamburger_btn}>
                            <span></span>
                            <span></span>
                        </button>
                        <p>Paramètre</p>
                        <img src="" alt="" />
                    </div>
                    <span className={styles.border}></span>
                </div>

                <div>
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

                    <span className={styles.border}></span>
                </div>

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

                    <span className={styles.border}></span>
                </div>

                <div>

                </div>

                <div>

                </div>

                <div>

                </div>

                <div>

                </div>
            </div>

            <div className={styles.background}></div>
        </div>
    )
}

export default Menu