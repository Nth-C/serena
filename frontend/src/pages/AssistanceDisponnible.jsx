import React from 'react';

function AssistanceDisponnible({ aides, resetForm }) {
    return (
        <div className="assistance">
                {aides && aides.length > 0 ? (
                    <div className="lien_aide"> 
                        {aides.map((aide, index) => (
                            <div key={index} className="container_aide">
                                <div>
                                    <h2>{aide.id_aide_fin}</h2>
                                </div>
                                <div>
                                    <p>{aide.description}</p>
                                    
                                    {aide.montant && (
                                        <p><strong>Gain estimé :</strong> {aide.montant}</p>
                                    )}

                                    <div>
                                        <h3>Qui a Accés ?</h3>
                                        <p>{aide.acces}</p>
                                    </div>

                                    <div>
                                        <h3>Comment l'obtenir ?</h3>
                                        <ul>
                                            {Array.isArray(aide.obtention) ? 
                                                aide.obtention.map((item, i) => <li key={i}>{item}</li>) : 
                                                <li>{aide.obtention}</li>
                                            }
                                        </ul>
                                    </div>

                                    <div>
                                        <h3>Document requis</h3>
                                        <ul>
                                            {Array.isArray(aide.documents_req) ? 
                                                aide.document_req.map((item, i) => <li key={i}>{item}</li>) : 
                                                <li>{aide.documents_req}</li>
                                            }
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <p className='end_list'>Aucun autre aides disponnible</p>
                    </div>
                ) : (
                    <p className="aucun">Aucune aide disponnible</p>
                )}
            
            <button 
                className="btn_blue" 
                onClick={resetForm} 
                style={{ marginTop: '2rem', width: '100%' }}
            >
                Modifier situation
            </button>
        </div>
    );
}

export default AssistanceDisponnible;