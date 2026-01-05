import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';


function CreateAccount() {

    return (
        <div className="login">
            <h1>Créer un compte</h1>

            <label htmlFor="">E-mail : </label>
            <input type="email" />

            <label htmlFor="">Mot de passe : </label>
            <input type="password" />

            <label htmlFor="">Confirmation de mot de passe : </label>
            <input type="password" />

            <div>
                <label htmlFor="">Nom</label>
                <input type="text" />

                <label htmlFor="">Prénom</label>
                <input type="text" />
            </div>

            <label htmlFor="">Nom d'utilisateur : </label>
            <input type="text" />

            <div>
                <NavLink to={"/"}>
                    <button>Retour</button>
                </NavLink>

                <NavLink to={"/"}>
                    <button>Valider</button>
                </NavLink>
            </div>


        </div>
    )
};

export default CreateAccount