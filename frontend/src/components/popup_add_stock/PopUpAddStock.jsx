import styles from './PopUpAddStock.module.css';
import { useState } from 'react';

// On ajoute 'onConfirm' pour renvoyer la valeur au parent
function PopUpAddStock({ nameMedecine, isOpen, toggleOpen, onConfirm }) {
    const [localStock, setLocalStock] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // On transforme la chaîne en nombre et on l'envoie au parent
        onConfirm(Number(localStock));
        setLocalStock(""); // On vide le champ pour la prochaine fois
    };

    return (
        <div className={[
          styles.container_popup_add_stock,
          isOpen ? styles.active : '',
        ].join(' ')}>
            <div className={styles.popup_add_stock}>
                <p>Ajouter du stock pour : <strong>{nameMedecine}</strong></p>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Stock à ajouter : </label>
                        <input 
                            type="number" 
                            value={localStock} 
                            onChange={(e) => setLocalStock(e.target.value)} 
                            required 
                            min="0"
                        />
                    </div>
                    <div className={styles.actions}>
                        <button type="button" className="btn_border" onClick={toggleOpen}>Annuler</button>
                        <button type="submit" className="btn_blue">Modifier</button>
                    </div>
                </form>
            </div>
            <div className={styles.background} onClick={toggleOpen}></div>
        </div>
    );
}

export default PopUpAddStock;