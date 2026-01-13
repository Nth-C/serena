import React, { useEffect, useState, useMemo } from 'react';
import LayoutMenu from '../LayoutMenu';

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
            case 'INSERT': return <span className='tag_add'>Ajout</span>;
            case 'UPDATE': return <span className='tag_update'>Modif</span>;
            case 'DELETE': return <span className='tag_delete'>Suppr</span>;
            default: return op;
        }
    };

    const formatTableName = (table) => {
        const mapNames = {
            'stock_medics': 'Médicament',
            'documents': 'Document',
            'ordonnances': 'Ordonnance',
            'personnes': 'Profil',
            'familles': 'Famille',
            'evenements': 'Agenda',
            'rapports': 'Rapport'
        };
        return mapNames[table] || table;
    };


    const formatLogDetails = (log) => {
        try {
            const oldData = log.old_values ? JSON.parse(log.old_values) : {};
            const newData = log.new_values ? JSON.parse(log.new_values) : {};
            
            let nomItem = "Inconnu";
            const dataToRead = log.operation === 'DELETE' ? oldData : newData;

            switch (log.table_name) {
                case 'stock_medics':
                    nomItem = dataToRead.designation_med || dataToRead.nom || 'Médicament';
                    break;
                case 'documents':
                    nomItem = dataToRead.nom_doc || 'Fichier';
                    break;
                case 'personnes':
                    nomItem = (dataToRead.prenom && dataToRead.nom) 
                        ? `${dataToRead.prenom} ${dataToRead.nom}` 
                        : (dataToRead.username || 'Utilisateur');
                    break;
                case 'evenements':
                    nomItem = dataToRead.titre || dataToRead.nom || 'Événement';
                    break;
                case 'rapports':
                    nomItem = dataToRead.nom || 'Rapport';
                    break;
                default:
                    nomItem = dataToRead.nom || dataToRead.titre || 'Élément';
            }

            if (log.operation === 'DELETE') {
                return <span style={{color: 'var(--red)'}}>A supprimé : <strong>{nomItem}</strong></span>;
            } else if (log.operation === 'INSERT') {
                return <span style={{color: 'green'}}>A ajouté : <strong>{nomItem}</strong></span>;
            } else if (log.operation === 'UPDATE') {

                return (
                    <span>
                        A modifié : <strong>{nomItem}</strong>
                        <div style={{fontSize: '0.8em', color: 'gray', marginTop: '4px'}}>
                            {Object.keys(newData).map(key => {
                                if (key.startsWith('id_') || key.includes('date') || key.includes('password') || key.includes('mdp')) return null;
                                if (oldData[key] !== newData[key]) {
                                    return <div key={key}>Change {key}: {oldData[key]} → {newData[key]}</div>
                                }
                                return null;
                            })}
                        </div>
                    </span>
                );
            }
        } catch (e) {
            return <span style={{color: 'gray'}}>Détails techniques non disponibles</span>;
        }
    };

    return (
        <LayoutMenu
            title={"Historique des actions"}
        >
            <div className='audit_log'>
                
                <div className='filter_bar'>
                    <div className='filter_group'>
                        <p><strong>Filtres :</strong></p>
                        <label className='checkbox_label'>
                            <input type="checkbox" checked={filters.INSERT} onChange={() => toggleFilter('INSERT')} />
                            Ajouts
                        </label>
                        <label className='checkbox_label'>
                            <input type="checkbox" checked={filters.UPDATE} onChange={() => toggleFilter('UPDATE')} />
                            Modifs
                        </label>
                        <label className='checkbox_label'>
                            <input type="checkbox" checked={filters.DELETE} onChange={() => toggleFilter('DELETE')} />
                            Suppr.
                        </label>
                    </div>

                    <div className='filter_group'>
                        <button className='sort_btn' onClick={toggleSort}>
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

                        <button 
                            className='refresh_btn'
                            onClick={getLogs} 
                            disabled={loading}
                            title="Actualiser la liste"
                        >
                            <svg className={loading ? 'spinning' : ''} viewBox="0 -960 960 960">
                                <path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"/>
                            </svg>
                            {loading ? '...' : 'Actualiser'}
                        </button>
                    </div>
                </div>

                {loading && listLogs.length === 0 ? (
                    <p className='loading'>Chargement de l'historique...</p>
                ) : error ? (
                    <div className='error'>
                        <p>{error}</p>
                        <button onClick={getLogs} className='retry_btn'>Réessayer</button>
                    </div>
                ) : filteredAndSortedLogs.length > 0 ? (
                    <div className='table_container'>
                        <table className='audit_table'>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Utilisateur</th>
                                    <th>Action</th>
                                    <th>Cible</th>
                                    <th>Description</th> {/* Changé "Détails" en "Description" */}
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
                                            {/* On appelle notre nouvelle fonction de formatage */}
                                            {formatLogDetails(log)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className='empty'>
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