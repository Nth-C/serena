import { NavLink } from 'react-router-dom';
import { useState } from 'react';

function Login() {
    const [formData, setFormData] = useState({ username: '', mdp: '' });
    const [message, setMessage] = useState('');

    const apiUrl = import.meta.env.VITE_API_URL; 

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${apiUrl}/?route=login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username : formData.username, mdp : formData.mdp  })
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
            <img src="/img/logo-name.svg" alt="" />

            <h1>Se connecter</h1>
            {message && <p>{message}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <div>
                        <label>Nom d'utilisateur : </label>
                        <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="John_Doe" required />
                    </div>

                    <div>
                        <label>Mot de passe : </label>
                        <input type="password" name="mdp" value={formData.mdp} onChange={handleChange} required />
                    </div>

                    <NavLink to="/create_account">
                        <p>Mot de passe oublié ?</p>
                    </NavLink>
                </div>

                <button type="submit" className="simple fill">Se connecter</button>

                <hr />

                <NavLink to={"/create_account"}>
                    <button className="simple">Créer un compte</button>
                </NavLink>
            </form>

            <img src="/img/logo.svg" alt="" />
        </div>
    )
};

export default Login