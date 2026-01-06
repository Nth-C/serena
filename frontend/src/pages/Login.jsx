import { NavLink } from 'react-router-dom';
import { useState } from 'react';

function Login() {
    const [formData, setFormData] = useState({ username: '', mdp: '' });
    const [message, setMessage] = useState('');
    const apiUrl = 'http://localhost:8080';

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${apiUrl}/?route=login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData)
            });
            const text = await response.text();
            if (text === 'success') {
                window.location.href = '/home/dashboard';
            } else {
                setMessage(text);
            }
        } catch (error) {
            setMessage('Erreur de connexion');
        }
    };

    return (
        <div className="login">
            <img src="../../public/img/logo-name.svg" alt="" />

            <h1>Se connecter</h1>
            {message && <p>{message}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nom d'utilisateur : </label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                </div>

                <div>
                    <label>Mot de passe : </label>
                    <input type="password" name="mdp" value={formData.mdp} onChange={handleChange} required />
                </div>

                <NavLink to="/create_account">
                    <p>Mot de passe oublié ?</p>
                </NavLink>

                <button type="submit" className="fill">Se connecter</button>
            </form>

            <hr />

            <NavLink to="/create_account">
                <button>Créer un compte</button>
            </NavLink>

            <img src="../../public/img/logo.svg" alt="" />
        </div>
    )
};

export default Login