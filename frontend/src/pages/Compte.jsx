import { useEffect, useState } from 'react'
import LayoutMenu from '../LayoutMenu';

const Compte = () => {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        mail: '',
        username: '',
        date_naissance: ''
    });
    const [message, setMessage] = useState('');
    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetch(`${apiUrl}/?route=user/profile`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (!data.error) {
                    setFormData({
                        nom: data.nom || '',
                        prenom: data.prenom || '',
                        mail: data.mail || '',
                        username: data.username || '',
                        date_naissance: data.date_naissance || ''
                    });
                }
            })
            .catch(err => console.error(err));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${apiUrl}/?route=user/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            if (result.success) setMessage('Modifications enregistrées !');
        } catch (error) {
            setMessage('Erreur lors de la mise à jour');
        }
    };

    return (
        <LayoutMenu title={"Compte"}>
            <>
                <div>
                    <h1>Mes informations</h1>

                    {message && <p>{message}</p>}

                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>E-mail : </label>
                            <input type="email" name="mail" value={formData.mail} onChange={handleChange} required />
                        </div>

                        <div>
                            <label>Nom : </label>
                            <input type="text" name="nom" value={formData.nom} onChange={handleChange} required />
                        </div>

                        <div>
                            <label>Prénom : </label>
                            <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required />
                        </div>

                        <div>
                            <label>Date de naissance : </label>
                            <input type="date" name="date_naissance" value={formData.date_naissance} onChange={handleChange} required />
                        </div>

                        <div>
                            <label>Nom d'utilisateur : </label>
                            <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                        </div>

                        <div>
                            <button type="submit">Enregistrer les modifications</button>
                        </div>
                    </form>
                </div>
            </>
        </LayoutMenu>
    );
}

export default Compte;