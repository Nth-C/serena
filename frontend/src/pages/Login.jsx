import { NavLink} from 'react-router-dom';
import { useEffect, useState } from 'react';

function Login() {

    return (
        <div className="login">
            <h1>Se connecter</h1>

            <label htmlFor="">E-mail : </label>
            <input type="email" />

            <label htmlFor="">Mot de passe : </label>
            <input type="password" />

            <a href="">mot de passe oublié ?</a>

            <button type="submit">Se connecter</button>

            <hr />

            <NavLink to={"/create_account"}>
                <button>Créer un compte</button>
            </NavLink>
        </div>
    )
};

export default Login