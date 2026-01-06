import { NavLink } from 'react-router-dom';
import { useState } from 'react';

function AcceSuivi() {

    return (
        <div className="acce_suivi">
            <img src="/img/logo-name.svg" alt="" />

            <h1>Accéder au suivi</h1>

            <div className="list"></div>

            <div className="container_suivi_groupe">
                <div className="principal_infos">
                    <div>
                        <p>Mr Parker</p>
                    </div>
                </div>

                <div className="drop">
                    <p>Description lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>

                    <div>
                        <button>Modifier</button>
                        <button>Accéder</button>
                    </div>
                </div>
            </div>
            <div className="container_suivi_groupe">
                <div className="principal_infos">
                    <div>
                        <p>Mr Parker</p>
                    </div>
                </div>
            </div>

            <hr />

            <NavLink to={"/create_account"}>
                <button className="simple">Créer un nouveau suivi</button>
            </NavLink>

            <div className="information_suivi">
                <h1>Créer un nouveau suivi</h1>

                <div>
                    <label htmlFor="">Nom de l'aidé : </label>
                    <input type="text" />
                </div>
                <div>
                    <label htmlFor="">Courte description : </label>
                    <textarea name="" id=""></textarea>
                </div>
                <div>
                    <button>Annuler</button>
                    <button>Créer</button>
                </div>
            </div>

            <div className="information_suivi">
                <h1>Modifier le suivi de </h1>

                <div>
                    <label htmlFor="">Nom de l'aidé : </label>
                    <input type="text" />
                </div>
                <div>
                    <label htmlFor="">Courte description : </label>
                    <textarea name="" id=""></textarea>
                </div>
                <div>
                    <button>Supprimer</button>
                    <div>
                        <button>Annuler</button>
                        <button>Modifier</button>
                    </div>
                </div>
            </div>

            <img src="/img/logo.svg" alt="" />
        </div>
    )
};

export default AcceSuivi