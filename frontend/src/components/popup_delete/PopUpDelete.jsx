import styles from './PopUpDelete.module.css';

function PopUpDelete({toDelete, handleDelete, isOpen, onClose, showConfirmation /*pas obligatoire*/}) {
    return (
        <div className={[
            styles.container_pop_up_delete,
            isOpen ? styles.active : '', // si isOpen on ajoute la classe active
        ].join(' ')}>
            
            <div className={styles.pop_up_delete}>
                <div>
                   <h2>Suppression ?</h2>
                   <p>Êtes-vous sûr de vouloir supprimer <span>{toDelete}</span> ? <br />Cette action est irréversible.</p>
                </div>
                <div>
                    <button className='btn_border' onClick={onClose}>Annuler</button>
                    <button className='btn_red' onClick={() => {
                        handleDelete()
                        onClose()
                        showConfirmation()
                    }}>Supprimer</button>
                </div>
            </div>

            <div className={styles.background} onClick={onClose}></div>
        </div>
    )
}


export default PopUpDelete