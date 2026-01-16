function AssistanceDisponnible({ aides, recommencer }) {
    const [selectedAide, setSelectedAide] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="assistance_dispo">
            <div className="list">
                {aides.map((aide) => (
                    <div className="container_medecine" key={aide.id_aide_fin}>
                        <div className="principal_infos">
                            <p>{aide.nom}</p>
                            <span>{aide.montant}</span>
                        </div>
                        <div className="drop">
                            <p>{aide.description}</p>
                            <button className="btn_blue" onClick={() => {
                                setSelectedAide(aide);
                                setIsOpen(true);
                            }}>Voir plus</button>
                        </div>
                    </div>
                ))}
                {aides.length === 0 && <p>Aucune aide trouvée pour votre situation.</p>}
            </div>
            
            <button className="btn_blue" onClick={recommencer}>Modifier situation</button>

            {/* Slide de détails utilisant les colonnes de ta BDD */}
            {selectedAide && (
                <Slide title={selectedAide.nom} isOpen={isOpen} toggleOpen={() => setIsOpen(false)}>
                    <div className="details_assistance">
                        <p><strong>Montant estimé :</strong> {selectedAide.montant}</p>
                        <h3>Qui a accès ?</h3>
                        <p>{selectedAide.acces}</p>
                        <h3>Comment l'obtenir</h3>
                        <p>{selectedAide.obtention}</p>
                        <h3>Documents requis</h3>
                        <p>{selectedAide.documents_req}</p>
                    </div>
                </Slide>
            )}
        </div>
    );
}