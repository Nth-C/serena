# Revue de Code - 18 Janvier 2026

## Problèmes Critiques de Sécurité (Backend)


*   **Vulnérabilité de Fixation de Session : - FAIT**

    *   **Description :** Le fichier `serena/backend/app.php` ne régénère pas l'ID de session après une connexion réussie. Un attaquant pourrait potentiellement détourner la session d'un utilisateur.
    *   **Recommandation :** Ajouter `session_regenerate_id(true);` au début de la méthode `login()` dans `serena/backend/app.php` pour créer une nouvelle session pour chaque connexion.

*   **Absence de Validation des Entrées Côté Serveur :**
    *   **Description :** La plupart des contrôleurs (ex: `register.ctrl.php`) utilisent directement les données de `$_POST` ou `$_GET` sans validation ni nettoyage. Cela expose l'application à des risques de corruption de données, d'erreurs inattendues et de vulnérabilités de type Cross-Site Scripting (XSS) stocké.
    *   **Recommandation :** Implémenter une validation systématique pour toutes les données entrantes. Utiliser des fonctions comme `filter_input()` ou des bibliothèques de validation pour s'assurer que les données sont du type et du format attendus avant de les traiter.
    

*   **Politique CORS (Cross-Origin Resource Sharing) trop permissive :**
    *   **Description :** L'utilisation de `header("Access-Control-Allow-Origin: *");` permet à n'importe quel domaine d'envoyer des requêtes à votre API. Cela peut poser des problèmes de sécurité.
    *   **Recommandation :** Restreindre l'accès à l'API en remplaçant `*` par le domaine spécifique de votre application frontend (par exemple, `header("Access-Control-Allow-Origin: http://localhost:5173");` pour le développement local).

## Améliorations Générales (Backend)

*   **Gestion des Erreurs en Production :**
    *   **Description :** Le fichier `serena/backend/model/dal.class.php` utilise `die()` pour gérer les erreurs de connexion à la base de données. En production, cela arrête brutalement le script et peut exposer des informations sensibles.
    *   **Recommandation :** Mettre en place un système de gestion des erreurs plus robuste qui enregistre les erreurs dans un fichier de log et affiche un message d'erreur générique à l'utilisateur.

## Améliorations (Frontend)

*   **Versions de Dépendances Invalides :**
    *   **Description :** Les fichiers `serena/backend/composer.json` et `serena/frontend/package.json` contiennent des numéros de version qui ne sont pas valides (ex: `"react": "^18.2.0,"` avec une virgule en trop).
    *   **Recommandation :** Corriger les numéros de version dans ces fichiers pour assurer une gestion correcte des dépendances.

*   **Audit de Sécurité pour le XSS :**
    *   **Description :** L'analyse n'a pas pu vérifier complètement le code frontend. Il existe un risque que des données provenant du backend soient affichées de manière non sécurisée.
    *   **Recommandation :** Auditer les composants React pour s'assurer qu'ils n'utilisent jamais la propriété `dangerouslySetInnerHTML` avec des données fournies par l'utilisateur ou la base de données. Toujours nettoyer les données avant de les afficher.

## Bonnes Pratiques Observées

*   **Protection contre les Injections SQL :** L'utilisation systématique des requêtes préparées via `dal.class.php` est une excellente pratique et protège efficacement la base de données.
*   **Stockage Sécurisé des Mots de Passe :** L'utilisation de `password_hash` avec un "pepper" (poivre) dans `register.ctrl.php` est conforme aux meilleures pratiques de sécurité.
*   **Protection contre les Attaques par Force Brute :** Le mécanisme de suivi des tentatives de connexion échouées dans `login.ctrl.php` est une mesure de sécurité robuste.
*   **Logique d'Autorisation :** Les contrôleurs comme `updateUser.ctrl.php` utilisent correctement l'ID de l'utilisateur de la session pour les opérations, empêchant les utilisateurs de modifier les données d'autres utilisateurs.
