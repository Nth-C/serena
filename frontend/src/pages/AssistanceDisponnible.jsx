import React from 'react';

function AssistanceDisponnible({ aides, resetForm }) {
    // Fonction utilitaire pour transformer le texte en liste à puces si des virgules existent
    const renderList = (text) => {
        if (!text) return <li>Non renseigné</li>;
        
        // Si le texte contient une virgule, on le split, sinon on affiche le texte tel quel
        const items = text.includes(',') ? text.split(',') : [text];
        
        return items.map((item, i) => (
            <li key={i} >
                {item.trim()}
            </li>
        ));
    };

    return (
        <div className="assistance">
            {aides && aides.length > 0 ? (
                <div className="lien_aide"> 
                    {aides.map((aide, index) => (
                        <div key={index} className="container_aide" >
                            <div>
                                <h2>
                                    {aide.id_aide_fin}
                                </h2>
                            </div>
                            
                            <div>
                                <p>{aide.description}</p>
                                
                                {aide.montant && (
                                    <p>
                                        <strong>Gain estimé :</strong> {aide.montant}
                                    </p>
                                )}

                                <div >
                                    <h3>Qui a Accès ?</h3>
                                    <ul>
                                        {renderList(aide.acces)}
                                    </ul>
                                </div>

                                <div>
                                    <h3>Comment l'obtenir ?</h3>
                                    <ul>
                                        {renderList(aide.obtention)}
                                    </ul>
                                </div>

                                <div >
                                    <h3>Document requis</h3>
                                    <ul>
                                        {renderList(aide.documents_req)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                    <p className='end_list'>Fin des aides disponibles</p>
                </div>
            ) : (
                <p className="aucun">Aucune aide disponible pour votre situation.</p>
            )}
            
            <button 
                className="btn_blue reset" 
                onClick={resetForm} 
            >
                Modifier ma situation
            </button>
        </div>
    );
}

export default AssistanceDisponnible;