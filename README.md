<a id="readme-top"></a>

<div align="center">
  <a href="https://gricad-gitlab.univ-grenoble-alpes.fr/iut2-info-stud/2025-s3/s3.01/team-14/serena">
    <img src="frontend/public/img/logo.svg" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Serena</h3>

  <p align="center">
    Le pilier de votre sérénité.
    <br />
    <a href="https://gricad-gitlab.univ-grenoble-alpes.fr/iut2-info-stud/2025-s3/s3.01/team-14/serena"><strong>Explorer la documentation »</strong></a>
    <br />
    <br />
    <a href="https://gricad-gitlab.univ-grenoble-alpes.fr/iut2-info-stud/2025-s3/s3.01/team-14/serena/-/issues">Signaler un Bug</a>
  </p>
</div>

<div align="center">

[![React][React-shield]][React-url]
[![PHP][PHP-shield]][PHP-url]
[![PostgreSQL][PostgreSQL-shield]][PostgreSQL-url]
[![Docker][Docker-shield]][Docker-url]
[![HTML5][HTML5-shield]][HTML5-url]
[![CSS3][CSS3-shield]][CSS3-url]

</div>

---

<details>
  <summary>Table des matières</summary>
  <ol>
    <li>
      <a href="#à-propos-du-projet">À propos du projet</a>
      <ul>
        <li><a href="#technologies">Technologies</a></li>
      </ul>
    </li>
    <li>
      <a href="#mise-en-route">Mise en Route</a>
      <ul>
        <li><a href="#prérequis">Prérequis</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#utilisation">Utilisation</a></li>
    <li><a href="#feuille-de-route">Feuille de Route</a></li>
    <li><a href="#contribuer">Contribuer</a></li>
    <li><a href="#licence">Licence</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

---

## À propos du projet

En France, le « grand âge » est un enjeu social et sanitaire majeur. Face au vieillissement de la population et à la volonté de faciliter le maintien à domicile, la coordination entre les aidants et les professionnels de santé devient primordiale.

**Serena** est une plateforme conçue pour les aidants familiaux et les intervenants professionnels. Elle centralise les informations essentielles au suivi médical (gestion de rendez-vous, stocks de médicaments), administratif (suivi des demandes d'aides) et quotidien, afin de garantir une meilleure qualité de vie pour les personnes dépendantes.

## Technologies

Ce projet est construit sur une architecture moderne et robuste, séparant clairement le frontend du backend.

*   **Frontend :**
    *   [React](https://reactjs.org/) (initialisé avec Vite) pour une interface utilisateur réactive et performante.
    *   HTML5 & CSS3 pour la structure sémantique et le design.
*   **Backend :**
    *   [PHP](https://www.php.net/) pour la logique serveur et l'API REST.
*   **Base de données :**
    *   [PostgreSQL](https://www.postgresql.org/) pour un stockage de données fiable et transactionnel.
*   **Infrastructure :**
    *   [Docker](https://www.docker.com/) pour la conteneurisation de l'environnement de développement, garantissant une installation et un déploiement reproductibles.

## Mise en Route

Pour obtenir une copie locale du projet et la faire fonctionner, suivez ces étapes.

### Prérequis

Assurez-vous que les outils suivants sont installés et configurés sur votre système :

*   **Docker et Docker Compose** : Indispensable pour exécuter l'environnement conteneurisé. L'installation de PHP ou de PostgreSQL directement sur votre machine n'est pas requise.
*   **Git** : Pour cloner le dépôt et gérer les versions du code.
*   **Node.js (version LTS)** : Requis pour la gestion des dépendances et l'exécution du serveur de développement frontend. Il est recommandé d'installer la version LTS (Long-Term Support) depuis le [site officiel de Node.js](https://nodejs.org/), qui inclut une version stable de `npm`.

### Installation

1.  **Cloner le dépôt**
    ```sh
    git clone https://gricad-gitlab.univ-grenoble-alpes.fr/iut2-info-stud/2025-s3/s3.01/team-14/serena.git
    cd serena
    ```

2.  **Configurer l'environnement Backend**
    Le backend requiert un fichier `.env` pour les variables d'environnement, notamment les accès à la base de données.
    ```sh
    # Naviguer vers le dossier backend
    cd backend

    # Copier le fichier d'exemple pour créer votre configuration locale
    cp .env.example .env
    ```
    Ouvrez le fichier `.env` et vérifiez que les variables correspondent à la configuration de `docker-compose.yml`. Les valeurs par défaut sont normalement correctes pour un environnement Docker standard.

3.  **Installer les dépendances Frontend**
    ```sh
    # Naviguer vers le dossier frontend
    cd ../frontend

    # Installer les packages via npm
    npm install
    ```
    Le frontend est pré-configuré pour communiquer avec l'API via la variable d'environnement `VITE_API_URL`, définie dans les fichiers `.env.*`.

4.  **Lancer l'application**
    ```sh
    # Retourner à la racine du projet
    cd ..

    # Démarrer les services avec Docker Compose
    docker-compose up --build -d
    ```
    L'option `-d` (detached) lance les conteneurs en arrière-plan.

## Utilisation

Une fois les conteneurs démarrés, l'application est accessible aux adresses suivantes :

*   **Application Frontend** : `http://localhost:5173`
*   **API Backend** : `http://localhost:8000`
*   **Interface de gestion de base de données (PhpPgAdmin)** : `http://localhost:5050`

Pour arrêter les services, exécutez `docker-compose down` depuis la racine du projet.

## Feuille de Route

Nos efforts de développement se concentrent actuellement sur les axes suivants :

*   **Fonctionnalités finalisées :**
    *   Gestion d'un agenda partagé avec synchronisation.
    *   Espace de stockage et de classification de documents.

*   **Prochaines étapes :**
    *   Implémentation d'un module OCR pour la lecture et l'interprétation automatique d'ordonnances médicales.
    *   Enrichissement de la documentation technique pour faciliter l'intégration de nouveaux contributeurs.

Consultez les [issues ouvertes](https://gricad-gitlab.univ-grenoble-alpes.fr/iut2-info-stud/2025-s3/s3.01/team-14/serena/-/issues) pour une liste complète des fonctionnalités proposées et des bugs connus.

## Contribuer

Les contributions sont un pilier de la communauté open source. Toute contribution est la bienvenue.

Si vous avez une suggestion pour améliorer ce projet, veuillez forker le dépôt et créer une pull request. Vous pouvez aussi simplement ouvrir une issue avec le tag "enhancement".

1.  Fork le projet.
2.  Créez votre branche de fonctionnalité (`git checkout -b feature/AmazingFeature`).
3.  Commitez vos changements (`git commit -m 'Add some AmazingFeature'`).
4.  Poussez vers la branche (`git push origin feature/AmazingFeature`).
5.  Ouvrez une Pull Request.

## Licence

Ce projet est distribué sous la licence MIT. Consultez le fichier `LICENSE` pour plus d'informations.

## Contact

Pour toute question, vous pouvez nous contacter à l'adresse suivante : `sere-na@alwaysdata.net`

Lien du projet : [https://gricad-gitlab.univ-grenoble-alpes.fr/iut2-info-stud/2025-s3/s3.01/team-14/serena](https://gricad-gitlab.univ-grenoble-alpes.fr/iut2-info-stud/2025-s3/s3.01/team-14/serena)

<!-- MARKDOWN LINKS & IMAGES -->
[React-shield]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[PHP-shield]: https://img.shields.io/badge/php-%23777BB4.svg?style=for-the-badge&logo=php&logoColor=white
[PHP-url]: https://www.php.net/
[PostgreSQL-shield]: https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white
[PostgreSQL-url]: https://www.postgresql.org/
[Docker-shield]: https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white
[Docker-url]: https://www.docker.com/
[HTML5-shield]: https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white
[HTML5-url]: https://developer.mozilla.org/fr/docs/Web/HTML
[CSS3-shield]: https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white
[CSS3-url]: https://developer.mozilla.org/fr/docs/Web/CSS