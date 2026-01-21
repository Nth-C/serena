import { useState } from 'react';

const FormulaireAides = ({ step, setStep, isDejaFait, onFinaliser }) => {

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

    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            if (name === "aide_aucune") {
                setFormData({                               // Si aucun cocher alors on décoche le reste
                    ...formData,
                    aide_apa: false,
                    aide_pch: false,
                    aide_aucune: true
                });
            } else if ((name === "aide_apa" || name === "aide_pch")) {
                setFormData({                           // si une aide est coher alors on décoche aucun
                    ...formData,
                    [name]: true,
                    aide_aucune: false
                });
            } else {
                setFormData({
                    ...formData,
                    [name]: checked
                });
            }
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const finaliser = (e) => {
        e.preventDefault();
        const form = e.target.closest('form');
        if (form.reportValidity()) {
            onFinaliser(formData); // Envoie les données au parent Assistance.jsx
        }
    };

    const isAideValide = () => {
        return formData.aide_apa || formData.aide_pch || formData.aide_aucune;
    };

    const handleNextStep = (e, nextStep) => {
        const form = e.target.closest('form');

        if (step === 2 && !isAideValide()) {
            alert("Veuillez sélectionner au moins une option pour les aides déjà perçues par l'aidé.");
            return;
        }

        if (form.reportValidity()) {
            setStep(nextStep);
        }
    };

    if (isDejaFait) return null;

    return (
        <>
            {step === 1 ? (  // ÉTAPE 1 : L'AIDANT
                <>
                    <div>
                        <h2>Profil de l'Aidant (Vous)</h2>
                        <div>
                            <label htmlFor="statut_pro">Votre statut professionnel : </label>
                            <select name="statut_pro" id="statut_pro" value={formData.statut_pro} onChange={handleChange} required>
                                <option value="">-- Choisir un statut --</option>
                                <option value="Salarie">Salarié</option>
                                <option value="Independant">Indépendant</option>
                                <option value="Chomeur">Chômeur</option>
                                <option value="Retraite">Retraité</option>
                                <option value="SansActivite">Sans activité</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="depenses">Vos dépenses : </label>
                            <select name="depenses" id="depenses" value={formData.depenses} onChange={handleChange} required>
                                <option value="">-- Choisir une situation de dépenses --</option>
                                <option value="DonneArgent">Je verse de l'argent à mon proche</option>
                                <option value="PayeFacture">Je paye des factures pour lui</option>
                                <option value="AucuneDepense">Aucune dépense</option>
                            </select>
                        </div>
                        <div>
                            <label>Votre fiscalité : </label>
                            <div className="selector_container">
                                <input type="radio" name="fiscalite" value="imposable" id="imposable" checked={formData.fiscalite === "imposable"} onChange={handleChange} required />
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
                            <div className="selector_container_relation">
                                <div>
                                    <input type="radio" name="role" value='conjoint' id='conjoint' checked={formData.role === "conjoint"} onChange={handleChange} />
                                    <label htmlFor="conjoint" className='choice'>Conjoint</label>
                                </div>
                                <div>
                                    <input type="radio" name="role" value='famille' id='famille' checked={formData.role === "famille"} onChange={handleChange} />
                                    <label htmlFor="famille" className='choice'>Enfant-Famille</label>
                                </div>
                                <div>
                                    <input type="radio" name="role" value='proche' id='proche' checked={formData.role === "proche"} onChange={handleChange} />
                                    <label htmlFor="proche" className='choice'>Ami-Voisin</label>
                                </div>
                            </div>
                        </div>

                        <button type="button" className="btn_blue" onClick={(e) => handleNextStep(e, 2)} disabled={step === 2 && !isAideValide()}>Continuer</button>
                    </div>
                </>
            ) : step === 2 ? (  // ÉTAPE 2 : L'AIDÉ
                <>
                    <div>
                        <h2>Information sur l'aidé</h2>
                        <div>
                            <label htmlFor="age_aide">Âge de l'aidé : </label>
                            <select name="age_aide" id="age_aide" value={formData.age_aide} onChange={handleChange} required>
                                <option value="">-- Choisir une situation de santé --</option>
                                <option value="moinsLimiteAge">Moins de 70 ans</option>
                                <option value="plusLimiteAge">70 ans et plus</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="gir">Niveau de dépendance de l'aidé (GIR) : </label>
                            <select name="gir" id="gir" value={formData.gir} onChange={handleChange} required>
                                <option value="">-- Choisir un niveau de dépendance --</option>
                                <option value="GIR 1-2">GIR 1-2</option>
                                <option value="GIR 3-4">GIR 3-4</option>
                                <option value="GIR 5-6">GIR 5-6</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="situation_medicale">Situation médicale de l'aidé : </label>
                            <select name="situation_medicale" id="situation_medicale" value={formData.situation_medicale} onChange={handleChange} required>
                                <option value="">-- Choisir une situation médicale --</option>
                                <option value="Vieillesse">Maladie-Vieillesse</option>
                                <option value="FinDeVie">Fin de vie (pronostic engagé)</option>
                            </select>
                        </div>
                        <div>
                            <label>Aides déjà perçues par l'aidé : </label>
                            <div className="box_check">
                                <input type="checkbox" name='aide_apa' id="APA" checked={formData.aide_apa} onChange={handleChange} />
                                <label htmlFor="APA">APA (Allocation Personnalisée d'Autonomie)</label>
                            </div>
                            <div className="box_check">
                                <input type="checkbox" name='aide_pch' id="PCH" checked={formData.aide_pch} onChange={handleChange} />
                                <label htmlFor="PCH">PCH (Prestation de Compensation du Handicap)</label>
                            </div>
                            <div className="box_check">
                                <input type="checkbox" name='aide_aucune' id="aucune" checked={formData.aide_aucune} onChange={handleChange} />
                                <label htmlFor="aucune">Aucune</label>
                            </div>
                        </div>
                        <div>
                            <button type="button" className="btn_border" onClick={() => setStep(1)}>Retour</button>
                            <button type="button" className="btn_blue" onClick={(e) => handleNextStep(e, 3)}>Continuer</button>
                        </div>
                    </div>
                </>
            ) : step === 3 ? (  // ÉTAPE 3 : BESOINS
                <>
                    <div>
                        <h2>Vos besoins</h2>
                        <div>
                            <label htmlFor="objectif">Quel est votre objectif prioritaire : </label>
                            <select name="objectif" id="objectif" value={formData.objectif} onChange={handleChange} required>
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