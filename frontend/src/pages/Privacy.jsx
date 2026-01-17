import LayoutMenu from '../LayoutMenu';

const Privacy = () => {

    return (
        <LayoutMenu
            title={"Politique de confidentialité"}
        >
            <>
            <div className='privacy'>
                <div>
                    <div>
                        <h2>Article 1 : Préambule et Conformité RGPD</h2>
                        <p>La présente politique a pour but d'informer les utilisateurs de l'application Serena sur la manière dont leurs données personnelles sont collectées et traitées. Elle complète les Mentions Légales et les Conditions Générales d'Utilisation (CGU).</p>
                        <p>Conformément au Règlement européen 2016/679 (RGPD), les données sont : </p>
                        <ul>
                            <li>Traitées de manière licite, loyale et transparente.</li>
                            <li>Collectées pour des finalités déterminées et légitimes.</li>
                            <li>Limitées au strict nécessaire (minimisation des données).</li>
                            <li>Conservées avec une sécurité appropriée.</li>
                        </ul>
                    </div>
                    <div>
                        <h2>Article 2 : Données Collectées</h2>
                        <p>L'application collecte les catégories de données suivantes :</p>
                        <ul>
                            <li>Identité : Nom, prénom, date de naissance, adresse email, lien avec l’aidé, statut professionnel, objectif.</li>
                            <li>Données de santé : Niveau de GIR, statut d'aidant, situation médicale.</li>
                            <li>Données financières et fiscales : dépenses engagées pour la personne aidée et informations sur la situation fiscale du foyer</li>
                            <li>Documents : Justificatifs administratifs téléchargés (PDF, images).</li>
                            <li>Données de connexion : Adresse IP, logs de connexion.</li>
                        </ul>
                    </div>
                    <div>
                        <h2>Article 3 : Finalités du Traitement</h2>
                        <p>Vos données sont exclusivement utilisées pour :</p>
                        <ul>
                            <li>Les données identitaires seront utilisées pour la gestion du compte utilisateur, de l'espace famille, du calcul d'éligibilité aux aides via le simulateur et pour vérifier l’identité de l’utilisateur lors de la première connexion.</li>
                            <li>Les données de santé seront utilisées pour le suivi des stocks de médicament, les alertes de renouvellement et le calcul d'éligibilité aux aides via le simulateur.</li>
                            <li>Les données financières et fiscales seront utilisées pour le calcul d'éligibilité aux aides via le simulateur.</li>
                            <li>Les documents seront utilisés pour le suivi des stocks de médicament avec les ordonnances et le stockage sécurisé de vos documents.</li>
                            <li>Les données de connexion seront utilisées pour permettre aux créateurs d’une famille d’identifier les actions réalisées par les autres utilisateurs.</li>
                        </ul>
                        <p>Aucune donnée n'est revendue à des tiers.</p>
                    </div>
                    <div>
                        <h2>Article 5 : Conservation et Sécurité</h2>
                        <p>Les données personnelles sont stockées de manière sécurisée et les mots de passe sont systématiquement chiffrés. L’accès est strictement restreint par famille et par profil utilisateur autorisé.</p>
                        <p>Les données et la base de données sont hébergées en France sur des serveurs sécurisés (Prestataire AlwaysData).</p>
                        <p>Les données sont conservées uniquement pendant la durée d'existence du compte utilisateur. En cas de suppression du compte, la totalité des données personnelles et des documents associés seront immédiatement et définitivement effacée des serveurs.</p>
                    </div>
                    <div>
                        <h2>Article 6 : Vos Droits</h2>
                        <p>Conformément au RGPD, vous disposez des droits suivants : </p>
                        <ul>
                            <li>Accès et rectification : Consultation et modification via votre profil.</li>
                            <li>Effacement : Suppression de votre compte et de vos documents sur demande.</li>
                            <li>Opposition et limitation : Droit de limiter ou de vous opposer au traitement.</li>
                            <li>Portabilité : Droit de récupérer vos données dans un format structuré.</li>
                        </ul>
                        <p>Le responsable du traitement est Coeurdevey Nathan, pour toute question, contactez le responsable à : sere-na@alwaysdata.net.</p>
                    </div>
                    <div>
                        <h2>Article 7 : Cookies et Modifications</h2>
                        <ul>
                            <li>Cookies : L'application utilise uniquement des cookies essentiels (session) nécessaires à la connexion, ne nécessitant pas de consentement préalable.</li>
                            <li>Mises à jour : L'éditeur se réserve le droit de modifier cette politique à tout moment pour garantir sa conformité légale.</li>
                        </ul>
                    </div>
                    <p>Dernière mise à jour : © 2026 Serena. Tous droits réservés.</p>
                </div>
            </div>
            {/* mettre les PopUp ou slide en dessous */}

            </>
        </LayoutMenu>
    )
}

export default Privacy;