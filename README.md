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
&nbsp;
[![PHP][PHP-shield]][PHP-url]
&nbsp;
[![PostgreSQL][PostgreSQL-shield]][PostgreSQL-url]
&nbsp;
[![Docker][Docker-shield]][Docker-url]
&nbsp;
[![HTML5][HTML5-shield]][HTML5-url]
&nbsp;
[![CSS3][CSS3-shield]][CSS3-url]

</div>

---

<details>
  <summary><strong>Sommaire</strong></summary>
  <ol>
    <li>
      <a href="#-à-propos-du-projet">À propos du projet</a>
      <ul>
        <li><a href="#-technologies-utilisées">Technologies utilisées</a></li>
      </ul>
    </li>
    <li>
      <a href="#-pour-commencer">Pour commencer</a>
      <ul>
        <li><a href="#-prérequis">Prérequis</a></li>
        <li><a href="#-installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#-utilisation">Utilisation</a></li>
    <li><a href="#-roadmap">Roadmap</a></li>
    <li><a href="#-contribuer">Contribuer</a></li>
    <li><a href="#-licence">Licence</a></li>
    <li><a href="#-contact">Contact</a></li>
  </ol>
</details>

---

## À propos du projet

En France, le « grand âge » est un enjeu social et sanitaire majeur. Avec le vieillissement de la population, la France compte de plus en plus de personnes en situation de dépendance. La volonté de faciliter leur maintien à domicile repose en grande partie sur la présence d'aidants.

**Serena** est une plateforme développée pour les aidants familiaux et les professionnels de santé dans le cadre de l'accompagnement du grand âge. Notre application vise à faciliter le maintien à domicile en centralisant les informations utiles au suivi médical (gestion des rendez-vous, stocks de médicaments), administratif (suivi des demandes d'aides) et quotidien.

<p align="right">(<a href="#readme-top">Retourner en haut</a>)</p>

### Technologies utilisées

Ce projet est construit sur une architecture moderne et robuste, séparant clairement le frontend du backend.

* **Frontend :**
    * [React](https://reactjs.org/) (via Vite) pour une interface utilisateur réactive et dynamique.
    * HTML5 & CSS3 pour la structure et le style.
* **Backend :**
    * [PHP](https://www.php.net/) pour la logique serveur et l'API REST.
* **Base de données :**
    * [PostgreSQL](https://www.postgresql.org/) pour un stockage de données fiable et performant.
* **Infrastructure :**
    * [Docker](https://www.docker.com/) pour une conteneurisation complète de l'environnement, garantissant une installation et un déploiement cohérents.

<p align="right">(<a href="#readme-top">Retourner en haut</a>)</p>

## Pour commencer

Pour obtenir une copie locale du projet et la faire fonctionner, suivez ces étapes.

### Prérequis

Assurez-vous d'avoir les outils suivants installés sur votre machine :

* **Docker** et **Docker Compose** : Pour faire tourner l'environnement conteneurisé. L'installation de PHP ou PostgreSQL n'est pas nécessaire sur votre machine locale, Docker s'en charge.
* **Git** : Pour cloner le projet.
* **Node.js** et **npm** : Pour gérer les dépendances du frontend.
    ```sh
    npm install npm@latest -g
    ```

### Installation

1.  **Clonez le projet**
    ```sh
    git clone [https://gricad-gitlab.univ-grenoble-alpes.fr/iut2-info-stud/2025-s3/s3.01/team-14/serena.git](https://gricad-gitlab.univ-grenoble-alpes.fr/iut2-info-stud/2025-s3/s3.01/team-14/serena.git)
    cd serena
    ```



2.  **Installation des dépendances Frontend**
    ```sh
    # Revenez au dossier racine du projet, puis allez dans le frontend
    cd ../frontend

    # Installez les packages npm
    npm install
    ```
    *Note : Le frontend est configuré pour communiquer avec l'API via la variable `VITE_API_URL`. La valeur par défaut `http://localhost:8000` est correcte pour l'environnement Docker.*

3.  **Lancez l'application avec Docker**
    ```sh
    # Revenez à la racine du projet
    cd ..

    # Lancez les conteneurs
    docker-compose up --build
    ```

<p align="right">(<a href="#readme-top">Retourner en haut</a>)</p>

## Utilisation

Une fois les conteneurs démarrés, vous pouvez accéder aux services :

* **Frontend** : [http://localhost:5173](http://localhost:5173)
* **Backend (API)** : [http://localhost:8000](http://localhost:8000)
* **PhpPgAdmin** (Gestion BDD) : [http://localhost:5050](http://localhost:5050)

<p align="right">(<a href="#readme-top">Retourner en haut</a>)</p>

## Roadmap

- [x] Création, synchronisation et administration d'un agenda
- [x] Création d'un espace de dépôt de fichiers (documents)
- [x] Lecture automatique d'une ordonnance via OCR

Consultez les [issues ouvertes](https://gricad-gitlab.univ-grenoble-alpes.fr/iut2-info-stud/2025-s3/s3.01/team-14/serena/-/issues) pour une liste complète des fonctionnalités proposées (et des bugs connus).

<p align="right">(<a href="#readme-top">Retourner en haut</a>)</p>

## Contribuer

Les contributions sont ce qui fait de la communauté open source un endroit extraordinaire pour apprendre, inspirer et créer. Toutes vos contributions sont grandement appréciées.

Si vous avez une suggestion pour améliorer ce projet, veuillez forker le repo et créer une pull request. Vous pouvez aussi simplement ouvrir une issue avec le tag "enhancement".

1.  Fork le projet
2.  Créez votre branche de fonctionnalité (`git checkout -b feature/AmazingFeature`)
3.  Commitez vos changements (`git commit -m 'Add some AmazingFeature'`)
4.  Poussez vers la branche (`git push origin feature/AmazingFeature`)
5.  Ouvrez une Pull Request

<p align="right">(<a href="#readme-top">Retourner en haut</a>)</p>

## Licence

Distribué sous la licence MIT. Voir `LICENSE` pour plus d'informations.

<p align="right">(<a href="#readme-top">Retourner en haut</a>)</p>

## Contact

**Équipe Serena** - sere-na@alwaysdata.net

Lien du projet : [GitLab](https://gricad-gitlab.univ-grenoble-alpes.fr/iut2-info-stud/2025-s3/s3.01/team-14/serena)

<p align="right">(<a href="#readme-top">Retourner en haut</a>)</p>

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