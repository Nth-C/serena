import { useEffect, useState, useRef } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';

function CGUStart() {

    // Regarde si l'utilisateur a atteint le bas
    const [hasReadToBottom, setHasReadToBottom] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const termsRef = useRef(null);

    const handleScroll = () => {
        const element = termsRef.current;
        if (element) {
            const scrollTotal = element.scrollHeight - element.clientHeight;
            const scrollCurrent = element.scrollTop;

            if (scrollTotal - scrollCurrent <= 10) {
                setHasReadToBottom(true);
            }
        }
    }

    return (
        <div className='CGU_start'>
            <img src="/img/logo-name.png" alt="Logo" />

            <h1>Avant d'accéder à Serena</h1>
            <div>
                <div>
                    <label htmlFor="">Entrer votre email : </label>
                    <input type="email" />
                </div>

                <div>
                    <div class="terms-container" id="termsBox" ref={termsRef} onScroll={handleScroll}>
                        <h3>Conditions d'Utilisation</h3>
                        <div>
                            <h2>Article 1 : Objet et Présentation du Service</h2>
                            <p>Serena est une plateforme conçue pour accompagner les aidants familiaux dans la gestion quotidienne d’une personne en perte d’autonomie, notamment sur les aspects administratifs, documentaires et de suivi de la personne.</p>
                            <ul>
                                <li>Site : désigne le site internet accessible à l'adresse : sere-na.alwaysdata.net.</li>
                                <li>Utilisateur : toute personne accédant et naviguant sur le Site Serena</li>
                            </ul>
                        </div>
                        <div>
                            <h2>Article 2 : Accès au site</h2>
                            <p>L'accès au Site Serena est ouvert à tout utilisateur disposant d'une connexion Internet via un navigateur web sur ordinateur et smartphone. L’accès aux fonctionnalités est conditionné par la création d’un compte utilisateur et un abonnement mensuel ou annuel, hors coûts de connexion et d'abonnement à Internet.</p>
                            <p>Les droits d'accès varient selon le profil attribué par l'Administrateur : </p>
                            <ul>
                                <li>Créateur : personne qui créer le groupe</li>
                                <li>Famille : Aidant principal</li>
                                <li>Proche : Aidant proche</li>
                                <li>Professionnel : Professionnel de santé</li>
                            </ul>
                        </div>
                        <div>
                            <h2>Article 3 : Conditions Financières</h2>
                            <p>L’accès aux fonctionnalités de Serena est soumis à la souscription d'un abonnement payant. Les tarifs sont les suivants : </p>
                            <ul>
                                <li>Abonnement Mensuel : 9 € TTC par mois.</li>
                                <li>Abonnement Annuel : 96 € TTC par an.</li>
                            </ul>
                            <p>Le tarif choisi n’est pas modifiable pendant la durée de la période d'abonnement en cours. Serena se réserve le droit de modifier ses tarifs à tout moment, les nouveaux tarifs s'appliqueront uniquement lors du renouvellement de l'abonnement.</p>
                            <p>Le règlement s’effectue par voie de paiement sécurisé (carte bancaire ou tout autre moyen proposé sur le Site).</p>
                            <ul>
                                <li>Pour l'offre mensuelle, le prélèvement est reconduit automatiquement chaque mois</li>
                                <li>Pour l'offre annuelle, le prélèvement est reconduit automatiquement chaque année.</li>
                            </ul>
                            <p>Conformément à la législation en vigueur, l'Utilisateur dispose d'un délai de 14 jours pour exercer son droit de rétractation</p>
                        </div>
                        <div>
                            <h2>Article 4 : Description des Services</h2>
                            <p>L’utilisateur s'engage à utiliser l’application exclusivement pour les finalités suivantes : </p>
                            <ul>
                                <li>Gestion administrative : Utilisation du simulateur d’aides, système d’alertes de renouvellement de médicament, stockage et partage de documents sécurisé.</li>
                                <li>Gestion de suivi : Saisie de rapport journalier et la gestion des stocks de médicaments.</li>
                                <li>Agenda partagé et dynamique : agenda collaboratif permettant de centraliser l’ensemble des événements liés à la personne aidée.</li>
                                <li>Gestion des trajets et déplacements : module de gestion des déplacements liés à la personne aidée.</li>
                            </ul>
                            <p>Tout usage abusif, frauduleux ou non conforme aux lois en vigueur est strictement interdit.</p>
                        </div>
                        <div>
                            <h2>Article 5 : Inscription et Obligations de l'Utilisateur</h2>
                            <p>Lors de son inscription, l’utilisateur s’engage à fournir des informations exactes et sincères. Il est seul responsable de la confidentialité de ses identifiants de connexion. Toute action effectuée depuis son compte est réputée avoir été réalisée par lui-même.</p>
                        </div>
                        <div>
                            <h2>Article 6 : Protection des Données Personnelles (RGPD)</h2>
                            <p>L’application traite des données personnelles sensibles (données de santé et de vie privée). Conformément au Règlement Général sur la Protection des Données (RGPD) :</p>
                            <ul>
                                <li>Sécurité : Les données sont stockées de manière sécurisée et les mots de passe sont chiffrés.</li>
                                <li>Cloisonnement : L’accès aux données est strictement restreint par famille et par profil autorisé.</li>
                                <li>Droits des utilisateurs : Chaque utilisateur dispose d’un droit d’accès, de rectification et de suppression.</li>
                            </ul>
                            <p>Pour toute demande relative à vos données, contactez l'administrateur de l'application via l’onglet signalement.</p>
                        </div>
                        <div>
                            <h2>Article 7 : Responsabilités et Garanties</h2>
                            <p>Serena est un outil d’aide à la gestion. Les informations fournies (simulations des aides disponibles, suivi de la personne dépendante, gestion des stocks de médicaments, documents, Agenda) sont indicatives et n'ont aucune valeur légale ou médicale.</p>
                            <p>L’éditeur ne saurait être tenu responsable en cas de :</p>
                            <ul>
                                <li>Erreurs de saisie commises par les utilisateurs</li>
                                <li>Décisions prises sur la base des informations générées par l'application</li>
                                <li>Interruptions temporaires du service (maintenance, problèmes réseaux).</li>
                            </ul>
                        </div>
                        <div>
                            <h2>Article 8 : Modification et Acceptation des Condition Générales d’Utilisation</h2>
                            <p>L’éditeur se réserve le droit de modifier les présentes CGU à tout moment. L’utilisation continue de l’application implique l’acceptation pleine et entière de la version la plus récente des CGU.</p>
                        </div>
                        <p>Dernière mise à jour : © 2026 Serena. Tous droits réservés.</p>
                    </div>

                    <div>
                        <input type="checkbox"
                            id="termsCheckbox"
                            disabled={!hasReadToBottom}
                            checked={isChecked}
                            onChange={(e) => setIsChecked(e.target.checked)} />
                        <label htmlFor="termsCheckbox">J'ai lu et j'accepte les conditions.</label>
                    </div>
                </div>

                <div>
                    <NavLink to="/CGU_not_accept">
                        <button className='btn_blue' id="submitBtn">Refuser</button>
                    </NavLink>
                    <NavLink to="/login">
                        <button className='btn_blue' id="submitBtn" disabled={!isChecked}>Accepter</button>
                    </NavLink>

                </div>
            </div>

        </div>
    );
}

export default CGUStart;