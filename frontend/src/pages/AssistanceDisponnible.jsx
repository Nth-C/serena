import { useEffect, useState } from 'react'

function AssistanceDisponnible() {
      const [isDetailsAssistanceOpen, setIsDetailsAssistancepen] = useState(false);

      const toggleDetailsAssistance = () => setIsDetailsAssistancepen(!isDetailsAssistanceOpen);
    return (
        <div className="assistance_dispo">
            <div className="list">
                <div className="container_medecine">
                    <div className="principal_infos">
                        <div>
                            <p>Allocation personnalisée d'autonomie</p>
                        </div>
                    </div>

                    <div className="drop">
                        <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Officia odit atque corrupti distinctio velit magnam nulla.</p>
                        <div>
                            <button className="btn_blue" onClick={toggleDetailsAssistance}>Voir plus</button>
                        </div>
                    </div>
                </div>
                <p className='end_list' >Aucun autre aides disponnible</p>
                <p className="aucun">Aucune aide disponnible</p>
            </div>
            <button className="btn_blue">Modifier situation</button>




            {/* Slide Détails des aides */}
            <Slide title="Nom de l'aide" isOpen={isDetailsAssistanceOpen} toggleOpen={toggleDetailsAssistance}>
                    <div className="details_assistance">
                        <div>
                            <p>Description / ce que tu gagner / organisme</p>
                        </div>
                        <div >
                            <h2>Qui a Accès ?</h2>
                            <p>Lorem ipsum</p>
                        </div>
                        <div >
                            <h2>Comment l'obtenir</h2>
                            <ul>
                                <li>lorem ipsum dolor</li>
                                <li>lorem ipsum dolor</li>
                                <li>lorem ipsum dolor</li>
                                <li>lorem ipsum dolor</li>
                            </ul>
                        </div>
                        <div>
                            <h2>Document requis</h2>
                            <ul>
                                <li>lorem ipsum dolor</li>
                                <li>lorem ipsum dolor</li>
                            </ul>
                        </div>
                    </div>
            </Slide>
        </div>
    )
}

export default AssistanceDisponnible