import { useState } from 'react';
import Slide from '../components/slide/Slide'; // Vérifie que le dossier Slide a une majuscule ou pas

function AssistanceDisponnible({ aides, resetForm }) {
    const [isDetailsAssistanceOpen, setIsDetailsAssistanceOpen] = useState(false);
    const [selectedAide, setSelectedAide] = useState(null);

    const toggleDetailsAssistance = (aide) => {
        setSelectedAide(aide);
        setIsDetailsAssistanceOpen(!isDetailsAssistanceOpen);
    };

    return (
        <div className="assistance_dispo">
            <div className="list">
                {aides && aides.length > 0 ? (
                    aides.map((aide) => (
                        <div key={aide.id_aide_fin} className="container_medecine">
                            <div className="principal_infos">
                                <p><strong>{aide.nom_aide}</strong></p>
                            </div>
                            <div className="drop">
                                <p>{aide.gain_estime}</p>
                                <button className="btn_blue" onClick={() => toggleDetailsAssistance(aide)}>Voir plus</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="aucun">Aucune aide trouvée pour votre situation.</p>
                )}
                <p className='end_list'>Fin des résultats</p>
            </div>
            
            <button className="btn_blue" onClick={resetForm}>Modifier ma situation</button>

            {selectedAide && (
                <Slide 
                    title={selectedAide.nom_aide} 
                    isOpen={isDetailsAssistanceOpen} 
                    toggleOpen={() => setIsDetailsAssistanceOpen(false)}
                >
                    <div className="details_assistance">
                        <h2>Description</h2>
                        <p>{selectedAide.description || "Détails non renseignés."}</p>
                        <h2>Comment l'obtenir</h2>
                        <p>{selectedAide.comment_obtenir || "Contactez votre CAF ou MSA."}</p>
                    </div>
                </Slide>
            )}
        </div>
    );
}

export default AssistanceDisponnible;