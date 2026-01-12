import React, { useEffect, useState } from 'react';
import styles from './AuditLog.module.css';
import LayoutMenu from '../../LayoutMenu';

const AuditLog = ({ isOpen, onClose }) => {
    const [listLogs, setListLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const apiUrl = import.meta.env.VITE_API_URL;

    const getLogs = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${apiUrl}/?route=audit/list`, {
                method: 'GET',
                credentials: 'include', // CRUCIAL pour envoyer le cookie de session
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // Vérification si la réponse est bien du JSON
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Réponse serveur invalide (pas de JSON)");
            }

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            // On s'assure que c'est bien un tableau
            setListLogs(Array.isArray(data) ? data : []);
            
        } catch (err) {
            console.error("Erreur Audit:", err);
            setError(err.message || "Impossible de récupérer l'historique");
            setListLogs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            getLogs();
        }
    }, [isOpen]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleString('fr-FR', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    const formatOperation = (op) => {
        switch (op) {
            case 'INSERT': return <span className={styles.tag_add}>Ajout</span>;
            case 'UPDATE': return <span className={styles.tag_update}>Modif</span>;
            case 'DELETE': return <span className={styles.tag_delete}>Suppr</span>;
            default: return op;
        }
    };

    const getDetailMessage = (log) => {
        let table = log.table_name;
        if (table === 'stock_medics') table = 'Stock Médicament';
        if (table === 'documents') table = 'Document';
        if (table === 'ordonnances') table = 'Ordonnance';
        if (table === 'personnes') table = 'Profil';
        
        // Sécurité si table est null
        return `Sur ${table || 'Inconnu'}`;
    };

    return (
        <LayoutMenu
            title={"Historique des actions"}
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className={styles.audit_log}>
                
                {loading ? (
                    <p className={styles.loading}>Chargement de l'historique...</p>
                ) : error ? (
                    <div className={styles.error}>
                        <p>{error}</p>
                        <button onClick={getLogs} className={styles.retry_btn}>Réessayer</button>
                    </div>
                ) : listLogs.length > 0 ? (
                    <div className={styles.list_container}>
                        {listLogs.map((log) => (
                            <div key={log.id_audit || Math.random()} className={styles.log_item}>
                                
                                <div className={styles.log_header}>
                                    <div className={styles.log_meta}>
                                        <span className={styles.date}>{formatDate(log.action_tstamp)}</span>
                                        <span className={styles.user}>Par : <strong>{log.user_name}</strong></span>
                                    </div>
                                    <div className={styles.operation}>
                                        {formatOperation(log.operation)}
                                    </div>
                                </div>

                                <div className={styles.log_body}>
                                    <p className={styles.message}>{getDetailMessage(log)}</p>
                                    
                                    {log.operation === 'UPDATE' && (
                                        <details className={styles.details}>
                                            <summary>Voir les détails</summary>
                                            <div className={styles.json_box}>
                                                <small>Avant : {log.old_values}</small>
                                                <hr/>
                                                <small>Après : {log.new_values}</small>
                                            </div>
                                        </details>
                                    )}
                                    {log.operation === 'INSERT' && (
                                         <details className={styles.details}>
                                         <summary>Voir les détails</summary>
                                         <div className={styles.json_box}>
                                             <small>Données : {log.new_values}</small>
                                         </div>
                                     </details>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className={styles.empty}>Aucun historique disponible pour votre famille.</p>
                )}
            </div>
        </LayoutMenu>
    );
};

export default AuditLog;