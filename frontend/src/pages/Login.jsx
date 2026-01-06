import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Login() {

    return (
        <div className="login">
            <img src="../../public/img/logo-name.svg" alt="" />

            <h1>Se connecter</h1>

            <form action="">
                <div>
                    <div>
                        <label htmlFor="">E-mail : </label>
                        <input type="email" />
                    </div>

                    <div>
                        <label htmlFor="">Mot de passe : </label>
                        <input type="password" />
                    </div>

                    <NavLink to={"/create_account"}>
                        <p>Mot de passe oublié ?</p>
                    </NavLink>
                </div>

                <NavLink to={"/"}>
                    <button type="submit" className="fill">Se connecter</button>
                </NavLink>

                <hr />

                <NavLink to={"/create_account"}>
                    <button>Créer un compte</button>
                </NavLink>
            </form>

            <img src="../../public/img/logo.svg" alt="" />
        </div>
    )
};

export default Login