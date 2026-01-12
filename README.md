<a id="readme-top"></a>




<br />
<div align="center">
  <a href="https://gricad-gitlab.univ-grenoble-alpes.fr/iut2-info-stud/2025-s3/s3.01/team-14/serena">
    <img src="frontend/public/img/logo.svg" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Serena</h3>

  <p align="center">
    Le pillier de votre sérénité
    <br />
    <a href="https://gricad-gitlab.univ-grenoble-alpes.fr/iut2-info-stud/2025-s3/s3.01/team-14/serena"><strong>Explorer le document »</strong></a>
    <br />
    <br />
    ·
    <a href="https://gricad-gitlab.univ-grenoble-alpes.fr/iut2-info-stud/2025-s3/s3.01/team-14/serena">Signaler un Bug</a>
    ·

  </p>
</div>



<details>
  <summary>Sommaire</summary>
  <ol>
    <li>
      <a href="#about-the-project">à propos du projet</a>
      <ul>
        <li><a href="#built-with">Languages utilisés</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Où commencer</a>
      <ul>
        <li><a href="#prerequisites">Prérequis</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Utilisation</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contribuer</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



## A propos du projet


En France, le « grand âge » est un enjeu social et sanitaire majeur. Avec le vieillissement de la population, la France compte de plus en plus de personnes en situation de grand âge. En 2025, on estime que plus de 5 millions de personnes ont plus de 75 ans.
En France, il existe une volonté de faciliter le maintien à domicile des personnes âgées, y compris dans le cadre de la dépendance. Ce maintien à domicile repose sur la présence d'aidants.
C'est pour cela que nous devons développer une plateforme à destination des aidants familiaux dans le cadre de l'accompagnement du grand âge.
Notre application doit pouvoir faciliter le maintien à domicile des personnes âgées en fournissant aux aidants familiaux, à la famille proche et aux différents intervenants (aides à domicile, infirmiers) un outil centralisant les informations utiles au suivi médical (prise de rendez-vous, stock de médicaments), au suivi administratif (suivi des demandes d'aides) ou au quotidien.


<p align="right">(<a href="#readme-top">Retourner en haut</a>)</p>



### Languages Utilisés

Pour ce projet nous avons utilisés pour le front end des languages comme PHP et react avec des éléments plus minimes comme CSS ou HTML. Pour le backend nous avons utilisés POSTGRESQL

### Languages et Outils

* [![React][React-shield]][React-url]
* [![PHP][PHP-shield]][PHP-url]
* [![PostgreSQL][PostgreSQL-shield]][PostgreSQL-url]
* [![Docker][Docker-shield]][Docker-url]
* [![HTML5][HTML5-shield]][HTML5-url]
* [![CSS3][CSS3-shield]][CSS3-url]

<p align="right">(<a href="#readme-top">Retourner en haut</a>)</p>


## Où commencer



### Prérequis

Pour pouvoir lancer l'application en local il vous faudra installer DOCKER, PHP (à mettre dans les variables d'environnement windows) et POSTGRESQL.

### Installation

._

1. Cloner le repo
   ```sh
   git clone https://github.com/github_username/repo_name.git
   ```
2. Composer le docker
   ```sh
    docker compose up --build                                                                                     
   ```
3. Changer le .env pour VOTRE base de donnée
   ```js
   DB_HOST= 'L''ADRESSE_DE_VOTRE_DATABASE'
   DB_PORT= 'LES_PORTS_DE_VOTRE_DATABASE'
   DB_NAME= 'LE_NOM_DE_VOTRE_DATABASE'
   DB_USER= 'L''UTILISATEUR_DE_VOTRE_DATABASE'
   DB_PASSWORD= 'LE_MOT_DE_PASSE_DE_VOTRE_DATABASE'
   ```


<p align="right">(<a href="#readme-top">Retourner en haut</a>)</p>



## Utilisation



<p align="right">(<a href="#readme-top">Retourner en haut</a>)</p>



## Roadmap

- [x] Création,synchronisation et administration d'un agenda
- [x] Création d'un espace de dépot de fichiers
- [ ] Lecture automatique d'une ordonnance
- [ ] Add "components" document to easily copy & paste sections of the readme


<p align="right">(<a href="#readme-top">Retourner en haut</a>)</p>



## Contribuer

1. Fork le projet
2. Créer votre Branch (`git checkout -b feature/VotreFeature`)
3. Commit vos changements (`git commit -m 'ajout de changements'`)
4. Push to the Branch (`git push origin feature/VotreFeature`)
5. Ouvrer une requête de Pull 


<p align="right">(<a href="#readme-top">Retourner en haut</a>)</p>


## License

Distribué sous license. Aller voir `LICENCE.TXT` pour plus d'informations.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## Contact

 - sere-na@alwaysdata.net

Lien du projet: [https://gricad-gitlab.univ-grenoble-alpes.fr/iut2-info-stud/2025-s3/s3.01/team-14/serena](https://gricad-gitlab.univ-grenoble-alpes.fr/iut2-info-stud/2025-s3/s3.01/team-14/serena)

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