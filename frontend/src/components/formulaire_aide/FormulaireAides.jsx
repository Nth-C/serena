const FormulaireAides = ({ isAssisAidant = true, isAssisProche = false, isDejaFait = false }) => {

    return (
        <>
            {isDejaFait ? ( // si formulaire déja rempli
                <>
                    <div className="list">
                        <div className="container_aide">
                            <div>
                                <h2>Nom de l'aide</h2>
                            </div>
                            <div>
                                <p>Description lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                <div>
                                    <h3>Qui a Accés ?</h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</p>
                                </div>
                                <div>
                                    <h3>Comment l'obtenir ?</h3>
                                    <ul>
                                        <li>Lorem ipsum dolor</li>
                                        <li>Lorem ipsum dolor</li>
                                        <li>Lorem ipsum dolor</li>
                                        <li>Lorem ipsum dolor</li>
                                    </ul>
                                </div>
                                <div>
                                    <h3>Document requis</h3>
                                    <ul>
                                        <li>Lorem ipsum dolor</li>
                                        <li>Lorem ipsum dolor</li>
                                    </ul>
                                </div>

                            </div>
                        </div>
                    </div>
                </>
            ) : isAssisAidant ? (  // profil Aidant
                <>
                    <div>
                        <h2>Profil de l'Aidant (Vous)</h2>
                        <div>
                            <label htmlFor="">Votre statut professionnel : </label>
                            <select name="statut_pro" value="" required>
                                <option value="">-- Choisir un statut --</option>
                                <option value="Salarie">
                                    Salarié
                                </option>
                                <option value="Independant">
                                    Indépendant
                                </option>
                                <option value="Chomeur">
                                    Chômeur
                                </option>
                                <option value="Retraite">
                                    Retraité
                                </option>
                                <option value="SansActivite">
                                    Sans activité
                                </option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="">Vos dépenses : </label>
                            <select name="statut_pro" value="" required>
                                <option value="">-- Choisir une situation de dépenses --</option>
                                <option value="DonneArgent">
                                    Je verse de l'argent à mon proche
                                </option>
                                <option value="PayeFacture">
                                    Je paye des factures pour lui
                                </option>
                                <option value="AucuneDepense">
                                    Aucune dépense
                                </option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="">Votre fiscalité : </label>
                            <div className="selector_container">
                                <input type="radio" name="fiscalité" value="imposable" id="imposable" />
                                <label htmlFor="imposable" className="card">
                                    <p>Je suis imposable</p>
                                </label>
                                <input type="radio" name="fiscalité" value="nonImposable" id="nonImposable" />
                                <label htmlFor="nonImposable" className="card">
                                    <p>Je suis non-imposable</p>
                                </label>
                            </div>
                        </div>

                        <div className="lien_aide">
                            <h2>Lien avec l'aidé</h2>
                            <div className="selector_container">
                                <div>
                                    <input type="radio" name="role" value='conjoint' id='conjoint' />
                                    <label htmlFor="conjoint" className='choice'>Conjoint</label>
                                </div>
                                <div>
                                    <input type="radio" name="role" value='famille' id='famille' />
                                    <label htmlFor="famille" className='choice'>Enfant-Famille</label>
                                </div>
                                <div>
                                    <input type="radio" name="role" value='proche' id='proche' />
                                    <label htmlFor="proche" className='choice'>Ami-Voisin</label>
                                </div>
                            </div>
                        </div>

                        <button className="btn_blue" onClick={() => {
                            isAssisProche(true);
                            isAssisAidant(false);
                        }}>Continuer</button>
                    </div>

                </>
            ) : isAssisProche ? (  // profil Aidé
                <>
                    <div>
                        <h2>Information sur l'aidé</h2>
                        <div>
                            <label htmlFor="">Âge de l'aidé : </label>
                            <select name="statut_pro" value="" required>
                                <option value="">-- Choisir une situation de santée --</option>
                                <option value="moinsLimiteAge">
                                    Moins de 70 ans
                                </option>
                                <option value="plusLimiteAge">
                                    70 ans et plus
                                </option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="">Niveau de dépendance de l'aidé (GIR) : </label>
                            <select name="statut_pro" value="" required>
                                <option value="">-- Choisir un niveau de dépendance --</option>
                                <option value="GIR 1-2">
                                    GIR 1-2
                                </option>
                                <option value="GIR 3-4">
                                    GIR 3-4
                                </option>
                                <option value="GIR 5-6">
                                    GIR 5-6
                                </option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="">Situation médicale de l'aidé : </label>
                            <select name="statut_pro" value="" required>
                                <option value="">-- Choisir une situation médical --</option>
                                <option value="Vieillesse">
                                    Maladie-Vieillesse
                                </option>
                                <option value="FinDeVie">
                                    Fin de vie (pronostic engagé)
                                </option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="">Aides déjà perçues par l'aidé : </label>
                            <div className="box_check">
                                <input type="checkbox" name='aides' value="APA" id="APA" required />
                                <label htmlFor="APA">APA (Allocation Personnalisée d'Autonomie)</label>
                            </div>
                            <div className="box_check">
                                <input type="checkbox" name='aides' value="PCH" id="PCH" required />
                                <label htmlFor="PCH">PCH (Prestation de Compensation du Handicap)</label>
                            </div>
                            <div className="box_check">
                                <input type="checkbox" name='aides' value="aucune" id="aucune" required />
                                <label htmlFor="aucune">Aucune</label>
                            </div>
                        </div>
                        <button className="btn_blue" onClick={() => {
                            isAssisProche(false);
                            isAssisAidant(false);
                        }}>Continuer</button>
                    </div>

                </>
            ) : (  // Vos besoins
                <>
                    <div>
                        <h2>Vos besoins</h2>
                        <div>
                            <label htmlFor="">Quel est votre objectif prioritaire : </label>
                            <select name="statut_pro" value="" required>
                                <option value="">-- Choisir un objectif --</option>
                                <option value="compenser">
                                    Recevoir un revenu pour compenser un arrêt de travail
                                </option>
                                <option value="PCH">
                                    PCH (Prestation de Compensation du Handicap)
                                </option>
                                <option value="remunere">
                                    Être rémunéré/dédommagé directement par l'aidé
                                </option>
                                <option value="retraite">
                                    Préparer ma retraite
                                </option>
                                <option value="repos">
                                    Prendre du repos
                                </option>
                            </select>
                        </div>
                        <button type="submit" className="btn_blue" onClick={() => isDejaFait(true)}>Finaliser</button>
                    </div>

                </>
            )}
        </>
    );

}

export default FormulaireAides;