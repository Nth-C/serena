# Revue de Code - Serena (2026-01-19)

## Contexte

Cette revue fait suite à celle du 18 janvier. Un travail considérable a été accompli pour traiter les vulnérabilités de sécurité critiques, notamment la gestion des fichiers `.env`, la configuration des cookies, la politique CORS et l'utilisation d'utilisateurs non-root dans Docker. **Félicitations pour ces avancées majeures !**

L'objectif de cette nouvelle revue est de se concentrer sur la **cohérence architecturale** et de s'assurer que les différentes parties du projet communiquent de manière logique et sécurisée.

## Problèmes Critiques (à traiter en priorité)

### 1. Architecture Backend Ambiguë : Conflit entre API JSON et Pages PHP Traditionnelles

*   **Observation :** Le projet contient deux logiques de backend qui coexistent difficilement :
    *   **Une approche API moderne (la bonne)** : Représentée par `login.ctrl.php`, qui reçoit du JSON, communique avec des classes DAO, et retourne des réponses JSON structurées. C'est ce que le frontend React devrait consommer.
    *   **Une approche PHP traditionnelle (à déprécier)** : Représentée par des fichiers comme `login_action.php`, `profile.php`, `login.php`. Ces fichiers agissent comme des pages web classiques, gérant des soumissions de formulaires (`$_POST`) et des redirections `header()`.
*   **Risque :** Cette dualité crée de la confusion, du code redondant et des failles de sécurité potentielles. Par exemple, le fichier `login_action.php` contient une logique de création de session qui semble obsolète par rapport à celle de `login.ctrl.php`.
*   **Recommandation :**
    *   **Standardiser sur l'approche API.** Le backend PHP ne devrait exposer que des endpoints JSON.
    *   **Déprécier et supprimer** les fichiers `login_action.php`, `logout.php`, ainsi que les fichiers PHP de vue comme `login.php` et `profile.php`. Le frontend React est seul responsable de l'interface utilisateur.

### 2. Protection CSRF Incompatible avec les API JSON

*   **Observation :** Votre protection CSRF dans `csrf_guard.php` est excellente pour les formulaires web classiques, car elle vérifie la présence du jeton dans `$_POST['_csrf_token']`. Cependant, votre endpoint `login.ctrl.php` (et probablement vos futures API) reçoit des données via `file_get_contents('php://input')`, c'est-à-dire du JSON. Le tableau `$_POST` sera donc toujours vide pour ces requêtes.
*   **Risque :** **Votre protection CSRF actuelle ne fonctionne pas pour votre API.** Toutes les requêtes JSON sont actuellement vulnérables aux attaques CSRF.
*   **Recommandation :** Mettre à jour la fonction `csrf_validate_request()` pour qu'elle vérifie également la présence du jeton dans un en-tête HTTP, ce qui est la norme pour les Single Page Applications (SPA).

    ```php
    // Dans csrf_guard.php
    function csrf_validate_request() {
        csrf_ensure_session_started();
        if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT' || $_SERVER['REQUEST_METHOD'] === 'DELETE']) {
            // Le jeton peut venir d'un formulaire ou d'un en-tête HTTP (pour AJAX/Fetch)
            $token_from_form = $_POST['_csrf_token'] ?? '';
            $token_from_header = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
            
            $submitted_token = $token_from_form ?: $token_from_header;
            $stored_token = $_SESSION['csrf_token'] ?? ' ';
    
            if (!hash_equals($stored_token, $submitted_token)) {
                http_response_code(403);
                die('Erreur de sécurité : Jeton CSRF invalide.');
            }
        }
    }
    ```
    Le frontend React devra ensuite inclure ce jeton dans l'en-tête `X-CSRF-Token` de toutes ses requêtes `fetch` ou `axios`.

## Améliorations Recommandées

*   **Mettre en place un Routeur "Front Controller" :** Votre fichier `.htaccess` redirige bien les appels API vers `index.php`. Il faut maintenant créer ou compléter ce fichier `index.php` à la racine pour qu'il agisse comme un routeur, analysant l'URL (`/home/dashboard`) et appelant le bon contrôleur (ex: `dashboard.ctrl.php`). Cela centralisera la gestion des requêtes.

*   **Finaliser la Gestion des Dépendances :** Le fichier `composer.json` ne liste pas `vlucas/phpdotenv` comme une dépendance, bien qu'il soit utilisé et présent dans `composer.lock`.
    *   **Recommandation :** Exécutez `composer require vlucas/phpdotenv` pour l'ajouter officiellement au projet.

*   **Adopter un Outil de Migration de Base de Données :** Le fichier `create.sql` est très complet, mais pour faire évoluer le schéma en équipe ou en production, un outil comme **Phinx** est indispensable. Il permet de versionner chaque changement de la base de données de manière fiable.

## Prochaines Étapes Actionnables

1.  **Modifier `csrf_guard.php`** pour accepter les jetons via l'en-tête `X-CSRF-Token`.
2.  **Supprimer les anciens fichiers PHP** (`login_action.php`, `logout.php`, `login.php`, `profile.php`) pour ne conserver que l'approche API.
3.  **Créer un routeur de base** dans `index.php` pour diriger les requêtes API vers les bons fichiers `*.ctrl.php`.
4.  **Mettre à jour `composer.json`** avec la commande `composer require vlucas/phpdotenv`.
