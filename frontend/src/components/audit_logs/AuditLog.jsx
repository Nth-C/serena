import React, { useEffect, useState, useMemo } from 'react';
import styles from './AuditLog.module.css';
import LayoutMenu from '../../LayoutMenu';

const AuditLog = ({ isOpen, onClose }) => {
    const [listLogs, setListLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [sortOrder, setSortOrder] = useState('DESC');
    const [filters, setFilters] = useState({
        INSERT: true,
        UPDATE: true,
        DELETE: true
    });

    const apiUrl = import.meta.env.VITE_API_URL;

    const getLogs = async () => {
        if (loading) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${apiUrl}/?route=audit/list`, {
                method: 'GET',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' }
            });

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Réponse serveur invalide (pas de JSON)");
            }

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            setListLogs(Array.isArray(data) ? data : []);
            
        } catch (err) {
            console.error("Erreur Audit:", err);
            setError(err.message || "Impossible de récupérer l'historique");
  
            if (listLogs.length === 0) setListLogs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            getLogs();
        }
    }, [isOpen]);

    const filteredAndSortedLogs = useMemo(() => {
        let result = listLogs.filter(log => filters[log.operation]);

        result.sort((a, b) => {
            const dateA = new Date(a.action_tstamp);
            const dateB = new Date(b.action_tstamp);
            return sortOrder === 'ASC' ? dateA - dateB : dateB - dateA;
        });

        return result;
    }, [listLogs, filters, sortOrder]);

    const toggleFilter = (type) => {
        setFilters(prev => ({ ...prev, [type]: !prev[type] }));
    };

    const toggleSort = () => {
        setSortOrder(prev => prev === 'ASC' ? 'DESC' : 'ASC');
    };

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

    const formatTableName = (table) => {
        const mapNames = {
            'stock_medics': 'Stock Médoc',
            'documents': 'Document',
            'ordonnances': 'Ordonnance',
            'personnes': 'Profil',
            'familles': 'Famille',
            'evenements': 'Agenda'
        };
        return mapNames[table] || table || 'Inconnu';
    };

    return (
        <LayoutMenu
            title={"Historique des actions"}
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className={styles.audit_log}>
                
                {/* --- BARRE D'OUTILS --- */}
                <div className={styles.filter_bar}>
                    
                    {/* Filtres Checkbox */}
                    <div className={styles.filter_group}>
                        <p><strong>Filtres :</strong></p>
                        <label className={styles.checkbox_label}>
                            <input type="checkbox" checked={filters.INSERT} onChange={() => toggleFilter('INSERT')} />
                            Ajouts
                        </label>
                        <label className={styles.checkbox_label}>
                            <input type="checkbox" checked={filters.UPDATE} onChange={() => toggleFilter('UPDATE')} />
                            Modifs
                        </label>
                        <label className={styles.checkbox_label}>
                            <input type="checkbox" checked={filters.DELETE} onChange={() => toggleFilter('DELETE')} />
                            Suppr.
                        </label>
                    </div>

                    {/* Boutons d'action (Tri + Refresh) */}
                    <div className={styles.filter_group}>
                        <button className={styles.sort_btn} onClick={toggleSort}>
                            {sortOrder === 'DESC' ? (
                                <>
                                    <svg viewBox="0 -960 960 960"><path d="M440-160v-487L216-423l-56-57 320-320 320 320-56 57-224-224v487h-80Z"/></svg>
                                    Plus récent
                                </>
                            ) : (
                                <>
                                    <svg viewBox="0 -960 960 960"><path d="M440-800v487l-224-224-56 57 320 320 320-320-56-57-224 224v-487h-80Z"/></svg>
                                    Plus ancien
                                </>
                            )}
                        </button>

                        {/* --- NOUVEAU BOUTON ACTUALISER --- */}
                        <button 
                            className={styles.refresh_btn} 
                            onClick={getLogs} 
                            disabled={loading}
                            title="Actualiser la liste"
                        >
                            <svg 
                                className={loading ? styles.spinning : ''} 
                                viewBox="0 -960 960 960"
                            >
                                <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"/>
                            </svg>
                            {loading ? '...' : 'Actualiser'}
                        </button>
                    </div>
                </div>

                {/* --- CONTENU --- */}
                {loading && listLogs.length === 0 ? (
                    <p className={styles.loading}>Chargement de l'historique...</p>
                ) : error ? (
                    <div className={styles.error}>
                        <p>{error}</p>
                        <button onClick={getLogs} className={styles.retry_btn}>Réessayer</button>
                    </div>
                ) : filteredAndSortedLogs.length > 0 ? (
                    <div className={styles.table_container}>
                        <table className={styles.audit_table}>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Utilisateur</th>
                                    <th>Action</th>
                                    <th>Cible</th>
                                    <th>Détails</th>
                                </tr>
                            </thead>
                        <tbody>
                            {filteredAndSortedLogs.map((log) => (
                                <tr key={log.id_audit || Math.random()}>
                                    <td style={{whiteSpace: 'nowrap'}}>{formatDate(log.action_tstamp)}</td>
                                    <td>{log.user_name}</td>
                                    <td>{formatOperation(log.operation)}</td>
                                    <td>{formatTableName(log.table_name)}</td>
                                    <td>
                                        {/* On vérifie s'il y a des données à afficher (old_values ou new_values) */}
                                        {(log.old_values || log.new_values) ? (
                                            <details className={styles.details}>
                                                <summary>Voir</summary>
                                                <div className={styles.json_box}>
                                                    
                                                    {/* CAS UPDATE : Avant / Après */}
                                                    {log.operation === 'UPDATE' && (
                                                        <>
                                                            <strong>Avant :</strong> {log.old_values}
                                                            <hr/>
                                                            <strong>Après :</strong> {log.new_values}
                                                        </>
                                                    )}

                                                    {/* CAS INSERT : On montre ce qui a été ajouté */}
                                                    {log.operation === 'INSERT' && (
                                                        <>
                                                            <strong>Ajouté :</strong> {log.new_values}
                                                        </>
                                                    )}

                                                    {/* CAS DELETE : On montre ce qui a été supprimé (old_values) */}
                                                    {log.operation === 'DELETE' && (
                                                        <>
                                                            <strong>Supprimé :</strong> {log.old_values}
                                                        </>
                                                    )}
                                                </div>
                                            </details>
                                        ) : (
                                            <span style={{color: '#ccc'}}>-</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                ) : (
                    <p className={styles.empty}>
                        {listLogs.length === 0 
                            ? "Aucun historique disponible." 
                            : "Aucun résultat pour ces filtres."}
                    </p>
                )}
            </div>
        </LayoutMenu>
    );
};

export default AuditLog;    