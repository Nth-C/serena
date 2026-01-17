import LayoutMenu from '../LayoutMenu';

const LegalMention = () => {

    return (
        <LayoutMenu
            title={"Mentions légales"}
        >
            <>
                <div className='legal_mention'>
                    <div>
                        <div>
                            <h2>Éditeur du site</h2>
                            <ul>
                                <li>Responsable de la publication : Serenity Dev.</li>
                                <li>Adresse du siège social : 2 Pl. Doyen Gosse, 38000 Grenoble.</li>
                                <li>Contact email : sere-na@alwaysdata.net.</li>
                                <li>Numéro de SIRET : 987 654 321 00018.</li>
                                <li>Numéro de TVA intracommunautaire : FR 38 987 654 321.</li>
                            </ul>
                        </div>
                        <div>
                            <h2>Hébergement</h2>
                            <p>Le site est hébergé par :</p>
                            <ul>
                                <li>Nom de l'hébergeur : Alwaysdata.</li>
                                <li>Adresse de l'hébergeur : 91 rue du Faubourg Saint Honoré - 75008 Paris.</li>
                                <li>Type de serveur : Serveur Cloud mutualisé (ou Cloud Privé) situé en France.</li>
                            </ul>
                        </div>
                        <div>
                            <h2>Propriété intellectuelle</h2>
                            <p>L’ensemble des éléments constituant l’application Serena (notamment les textes, graphismes, logos, sons, photos, animations, codes sources et logiciels) est la propriété exclusive de Serena.</p>
                            <p>Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sans l'autorisation écrite préalable de l'auteur. </p>
                        </div>
                        <div>
                            <h2>Gestion des cookies</h2>
                            <p>L'application utilise exclusivement des cookies essentiels (cookies de session) strictement nécessaires au maintien de votre connexion et au bon fonctionnement du service. Ces cookies ne requièrent pas de consentement préalable conformément aux directives de la CNIL.</p>
                        </div>
                        <p>Dernière mise à jour : © 2026 Serena. Tous droits réservés.</p>
                    </div>
                </div>
                {/* mettre les PopUp ou slide en dessous */}

            </>
        </LayoutMenu>
    )
}

export default LegalMention;