import { useEffect, useState } from 'react'
import LayoutMenu from '../LayoutMenu';
import PopUpDelete from '../components/popup_delete/PopUpDelete'
import PopUpConfirmation from '../components/popup_confirmation/PopUpConfirmation'

const Compte = () => {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        mail: '',
        username: '',
        date_naissance: ''
    });

    // sauvegarde les données si on souhaite les annuler
    const [initialData, setInitialData] = useState({});

    const [isPopUpDeleteOpen, setIsPopUpDeleteOpen] = useState(false);
    const [isShowRemove, setIsShowRemove] = useState(false);
    const [isShowModify, setIsShowModify] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const apiUrl = import.meta.env.VITE_API_URL;

    useEffect(() => {
        fetch(`${apiUrl}/?route=user/profile`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (!data.error) {
                    let profile = {
                        nom: data.nom || '',
                        prenom: data.prenom || '',
                        mail: data.mail || '',
                        username: data.username || '',
                        date_naissance: data.date_naissance || ''
                    }
                    setFormData(profile);
                    setInitialData(profile);
                }
            })
            .catch(err => console.error(err));
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // remet les données initial
    const handleCancel = () => {

    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        try {
            const response = await fetch(`${apiUrl}/?route=user/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            if (result.success) {
                setIsShowModify(true); // Déclenche la popup de confirmation
                setIsEditing(false);
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour', error);
        }
    };

    const togglePopUpDelete = () => setIsPopUpDeleteOpen(!isPopUpDeleteOpen);

    const handleDeleteAccount = async () => {
        try {
            const response = await fetch(`${apiUrl}/?route=user/delete`, {
                method: 'POST',
                credentials: 'include'
            });
            const result = await response.json();
            if (result.success) {
                setIsPopUpDeleteOpen(false);
                setIsShowRemove(true);
                // On attend que l'utilisateur voit le message avant de rediriger
                setTimeout(() => {
                    window.location.href = "/login";
                }, 2000);
            }
        } catch (err) {
            console.error("Erreur suppression", err);
        }
    };

    return (
        <>
        <LayoutMenu title={"Compte"}>
            <div className="compte">
                <h2>Mes informations</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>E-mail : </label>
                        <input type="email" name="mail" value={formData.mail} onChange={handleChange} required disabled={!isEditing}/>
                    </div>
                    <div>
                        <label>Nom : </label>
                        <input type="text" name="nom" value={formData.nom} onChange={handleChange} required disabled={!isEditing}/>
                    </div>
                    <div>
                        <label>Prénom : </label>
                        <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required disabled={!isEditing}/>
                    </div>
                    <div>
                        <label>Date de naissance : </label>
                        <input type="date" name="date_naissance" value={formData.date_naissance} onChange={handleChange} required disabled={!isEditing}/>
                    </div>
                    <div>
                        <label>Nom d'utilisateur : </label>
                        <input type="text" name="username" value={formData.username} onChange={handleChange} required disabled={!isEditing}/>
                    </div>
                    <div>
                        <button type="button" className="btn_red" onClick={togglePopUpDelete}>Supprimer</button>                       
                        {/* change de bouton en fonction de si on modifie les données ou pas   */}
                        {isEditing ? (
                            <button type="button" className="btn_border" onClick={() => {setIsEditing(false); handleCancel()}}>Annuler</button>
                        ) : (
                            <button type="button" className="btn_blue" onClick={() => setIsEditing(true)}>Modifier</button>
                        )}
                    </div>
                    <div className={isEditing ? 'active' : ''}>
                        <button type="submit" className="btn_blue">Enregistrer</button>                       
                    </div>
                </form>
            </div>
        </LayoutMenu>

        {/* Popups */}
        <PopUpDelete
            toDelete={formData.username}
            handleDelete={handleDeleteAccount}
            isOpen={isPopUpDeleteOpen}
            onClose={togglePopUpDelete}
        />

        <PopUpConfirmation 
            sentence={`Vos informations ont bien été modifiées.`} 
            show={isShowModify} 
            setShow={setIsShowModify} 
        />

        <PopUpConfirmation 
            sentence={`Votre compte a été supprimé.`} 
            show={isShowRemove} 
            setShow={setIsShowRemove} 
        />
        </>

    );
}

export default Compte;