import { useEffect, useState } from 'react'

function Assistance() {
  return (
    <div className="assistance">
      <form action="">
        <h1>Simulateur d'aides disponible</h1>
        <div>
          <h2>Profil de l'Aidant (Vous)</h2>
          <div>
            <label htmlFor="">Statut professionnel : </label>
            <select name="statut_pro" value="" required>
              <option value="">-- Choisir un statut professionnel --</option>
              <option>
                Salarié
              </option>
              <option>
                Indépendant
              </option>
              <option>
                Chômeur
              </option>
              <option>
                Retraité
              </option>
              <option>
                Sans activité
              </option>
            </select>
          </div>
          <div>
            <label htmlFor="">Lien avec la personne aidée : </label>
            <select name="statut_pro" value="" required>
              <option value="">-- Choisir un lien avec l'aidé --</option>
              <option>
                Conjoint
              </option>
              <option>
                Enfant-Famille
              </option>
              <option>
                Ami-Voisin
              </option>
            </select>
          </div>
          <div>
            <label htmlFor="">Fiscalité : </label>
            <select name="statut_pro" value="" required>
              <option value="">-- Choisir une situation fiscal --</option>
              <option>
                je paye des impôts
              </option>
              <option>
                je suis Non imposable
              </option>
            </select>
          </div>
          <div>
            <label htmlFor="">Dépenses : </label>
            <select name="statut_pro" value="" required>
              <option value="">-- Choisir une situation de dépenses --</option>
              <option>
                Je verse de l'argent à mon proche
              </option>
              <option>
                Je paye des factures pour lui
              </option>
              <option>
                Aucune dépense
              </option>
            </select>
          </div>
        </div>
        <div>
          <h2>Profil de l'Aidé (La personne âgée)</h2>
          <div>
            <label htmlFor="">Niveau de dépendance (GIR) : </label>
            <select name="statut_pro" value="" required>
              <option value="">-- Choisir un niveau de dépendance --</option>
              <option>
                GIR 1-2
              </option>
              <option>
                GIR 3-4
              </option>
              <option>
                GIR 5-6
              </option>
            </select>
          </div>
          <div>
            <label htmlFor="">Situation médicale spécifique : </label>
            <select name="statut_pro" value="" required>
              <option value="">-- Choisir une situation médical --</option>
              <option>
                Maladie-Vieillesse
              </option>
              <option>
                Fin de vie (pronostic engagé)
              </option>
            </select>
          </div>
          <div>
            <label htmlFor="">Âge : </label>
            <select name="statut_pro" value="" required>
              <option value="">-- Choisir une situation de santée --</option>
              <option>
                Moins de 70 ans
              </option>
              <option>
                70 ans et plus
              </option>
            </select>
          </div>
          <div>
            <label htmlFor="">Aides déjà perçues par l'aidé : </label>
            <select name="statut_pro" value="" required>
              <option value="">-- Choisir une situation de santée --</option>
              <option>
                APA (Allocation Personnalisée d'Autonomie)
              </option>
              <option>
                PCH (Prestation de Compensation du Handicap)
              </option>
              <option>
                Aucune
              </option>
            </select>
          </div>
          <div>
            <h2>Nature du besoin</h2>
            <div>
              <label htmlFor="">Objectif prioritaire : </label>
              <select name="statut_pro" value="" required>
                <option value="">-- Choisir une situation de santée --</option>
                <option>
                  Recevoir un revenu pour compenser un arrêt de travail
                </option>
                <option>
                  PCH (Prestation de Compensation du Handicap)
                </option>
                <option>
                  Être rémunéré/dédommagé directement par l'aidé
                </option>
                <option>
                  Préparer ma retraite
                </option>
                <option>
                  Prendre du repos
                </option>
              </select>
            </div>
          </div>
        </div>
        <button className="btn_border">Annuler</button>
        <button type="submit" className="btn_blue">Valider</button>
      </form>
    </div>
  )
}

export default Assistance