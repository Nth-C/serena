import { useState } from 'react';
import AssistanceDisponnible from '../../pages/AssistanceDisponnible';

const FormulaireAides = ({ step, setStep, isDejaFait, setIsDejaFait }) => {

    const [formData, setFormData] = useState({
        statut_pro: "",
        depenses: "",
        fiscalite: "",
        role: "",
        age_aide: "",
        gir: "",
        situation_medicale: "",
        aide_apa: false,
        aide_pch: false,
        aide_aucune: false,
        objectif: ""
    });

    const apiUrl = import.meta.env.VITE_API_URL;


    const [aidesResultats, setAidesResultats] = useState([]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    // Envoi des données au contrôleur PHP pour calculer les 22 aides
    const finaliser = async (e) => {
        e.preventDefault();
        const form = e.target.closest('form');
        if (form.reportValidity()) {
            try {
                // L'URL doit pointer vers ton fichier getAides.ctrl.php
                const response = await fetch(`${apiUrl}/?route=aides/calculer`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                const data = await response.json();
                setAidesResultats(data);
                setIsDejaFait(true); 
            } catch (error) {
                console.error("Erreur de récupération :", error);
                // On active quand même l'affichage pour ne pas bloquer l'utilisateur
                setIsDejaFait(true);
            }
        }
    };

    const recommancer = (e) => {
        e.preventDefault();
        setIsDejaFait(false);
        setAidesResultats([]);
        setStep(1);
    };

    const handleNextStep = (e, nextStep) => {
        const form = e.target.closest('form');
        if (form.reportValidity()) {
            setStep(nextStep);
        }
    };

    return (
        <>
            {isDejaFait ? (
                <AssistanceDisponnible aides={aidesResultats} resetForm={recommancer} />
            ) : step === 1 ? (  // profil Aidant
                <>
                    <div>
                        <h2>Profil de l'Aidant (Vous)</h2>
                        <div>
                            <label htmlFor="">Votre statut professionnel : </label>
                            <select name="statut_pro" value={formData.statut_pro} onChange={handleChange} required>
                                <option value="">-- Choisir un statut --</option>
                                <option value="Salarie">Salarié</option>
                                <option value="Independant">Indépendant</option>
                                <option value="Chomeur">Chômeur</option>
                                <option value="Retraite">Retraité</option>
                                <option value="SansActivite">Sans activité</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="">Vos dépenses : </label>
                            <select name="depenses" value={formData.depenses} onChange={handleChange} required>
                                <option value="">-- Choisir une situation de dépenses --</option>
                                <option value="DonneArgent">Je verse de l'argent à mon proche</option>
                                <option value="PayeFacture">Je paye des factures pour lui</option>
                                <option value="AucuneDepense">Aucune dépense</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="">Votre fiscalité : </label>
                            <div className="selector_container">
                                <input type="radio" name="fiscalite" value="imposable" id="imposable" checked={formData.fiscalite === "imposable"} onChange={handleChange} required/>
                                <label htmlFor="imposable" className="card">
                                    <p>Je suis imposable</p>
                                </label>
                                <input type="radio" name="fiscalite" value="nonImposable" id="nonImposable" checked={formData.fiscalite === "nonImposable"} onChange={handleChange} required />
                                <label htmlFor="nonImposable" className="card">
                                    <p>Je suis non-imposable</p>
                                </label>
                            </div>
                        </div>

                        <div className="lien_aide">
                            <h2>Lien avec l'aidé</h2>
                            <div className="selector_container">
                                <div>
                                    <input type="radio" name="role" value='conjoint' id='conjoint' checked={formData.role === "conjoint"} onChange={handleChange} required/>
                                    <label htmlFor="conjoint" className='choice'>Conjoint</label>
                                </div>
                                <div>
                                    <input type="radio" name="role" value='famille' id='famille' checked={formData.role === "famille"} onChange={handleChange} required/>
                                    <label htmlFor="famille" className='choice'>Enfant-Famille</label>
                                </div>
                                <div>
                                    <input type="radio" name="role" value='proche' id='proche' checked={formData.role === "proche"} onChange={handleChange} required/>
                                    <label htmlFor="proche" className='choice'>Ami-Voisin</label>
                                </div>
                            </div>
                        </div>

                        <button type="button" className="btn_blue" onClick={(e) => handleNextStep(e, 2)}>Continuer</button>
                    </div>

                </>
            ) : step === 2 ? (  // profil Aidé
                <>
                    <div>
                        <h2>Information sur l'aidé</h2>
                        <div>
                            <label htmlFor="">Âge de l'aidé : </label>
                            <select name="age_aide" value={formData.age_aide} onChange={handleChange} required>
                                <option value="">-- Choisir une situation de santée --</option>
                                <option value="moinsLimiteAge">Moins de 70 ans</option>
                                <option value="plusLimiteAge">70 ans et plus</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="">Niveau de dépendance de l'aidé (GIR) : </label>
                            <select name="gir" value={formData.gir} onChange={handleChange} required>
                                <option value="">-- Choisir un niveau de dépendance --</option>
                                <option value="GIR 1-2">GIR 1-2</option>
                                <option value="GIR 3-4">GIR 3-4</option>
                                <option value="GIR 5-6">GIR 5-6</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="">Situation médicale de l'aidé : </label>
                            <select name="situation_medicale" value={formData.situation_medicale} onChange={handleChange} required>
                                <option value="">-- Choisir une situation médical --</option>
                                <option value="Vieillesse">Maladie-Vieillesse</option>
                                <option value="FinDeVie">Fin de vie (pronostic engagé)</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="">Aides déjà perçues par l'aidé : </label>
                            <div className="box_check">
                                <input type="checkbox" name='aide_apa' id="APA" checked={formData.aide_apa} onChange={handleChange}/>
                                <label htmlFor="APA">APA (Allocation Personnalisée d'Autonomie)</label>
                            </div>
                            <div className="box_check">
                                <input type="checkbox" name='aide_pch' id="PCH" checked={formData.aide_pch} onChange={handleChange}/>
                                <label htmlFor="PCH">PCH (Prestation de Compensation du Handicap)</label>
                            </div>
                            <div className="box_check">
                                <input type="checkbox" name='aide_aucune' id="aucune" checked={formData.aide_aucune} onChange={handleChange}/>
                                <label htmlFor="aucune">Aucune</label>
                            </div>
                        </div>
                        <div>
                            <button type="button" className="btn_border" onClick={() => setStep(1)}>Retour</button>
                            <button type="button" className="btn_blue" onClick={(e) => handleNextStep(e, 3)}>Continuer</button>
                        </div>
                    </div>

                </>
            ) : step === 3 ? (  // Vos besoins
                <>
                    <div>
                        <h2>Vos besoins</h2>
                        <div>
                            <label htmlFor="">Quel est votre objectif prioritaire : </label>
                            <select name="objectif" value={formData.objectif} onChange={handleChange} required>
                                <option value="">-- Choisir un objectif --</option>
                                <option value="compenser">Recevoir un revenu pour compenser un arrêt de travail</option>
                                <option value="PCH">PCH (Prestation de Compensation du Handicap)</option>
                                <option value="remunere">Être rémunéré/dédommagé directement par l'aidé</option>
                                <option value="retraite">Préparer ma retraite</option>
                                <option value="repos">Prendre du repos</option>
                            </select>
                        </div>
                        <div>
                            <button type="button" className="btn_border" onClick={() => setStep(2)}>Retour</button>
                            <button type="submit" className="btn_blue" onClick={finaliser}>Finaliser</button>
                        </div>
                    </div>

                </>
            ) : null}
        </>
    );
}

export default FormulaireAides;