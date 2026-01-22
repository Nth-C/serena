# Revue de Code Globale - Serena (2026-01-22)

**Portée :** Analyse manuelle des composants clés du Backend (PHP), Frontend (React) et de la Base de Données (PostgreSQL).
**Objectif :** Identifier les vulnérabilités de sécurité critiques, les incohérences architecturales et les points d'amélioration de la qualité du code.

## 1. Architecture & Stabilité

*   **Point Fort (Sécurité Backend) :** L'architecture de sécurité du backend est robuste. Le `login.ctrl.php` démontre une excellente connaissance des pratiques modernes : protection contre le brute-force, usage de `pepper` pour les mots de passe et régénération des ID de session. C'est une base solide.
*   **Point Faible (Architecture API) :** Comme identifié dans les revues précédentes, le système de routing basé sur `?route=...` est une dette technique. Il est fragile, non-standard et rend l'API difficile à documenter et à maintenir.
*   **Point Faible (Gestion de la Configuration) :** L'approche de la configuration est une faille de sécurité majeure et un problème de maintenabilité.

## 2. Backend (PHP)

### A. Sécurité Critique & Configuration (`config.php`)
*   **Vulnérabilité P0 (Critique) : Données sensibles hardcodées.**
    *   *Défaut :* Le fichier `backend/config.php` contient en clair le mot de passe SMTP et le `APP_PEPPER`. Si le code source fuite, ces informations sont compromises.
    *   *Risque :* Prise de contrôle du compte email, possibilité de déchiffrer des mots de passe si la base de données est compromise.
    *   *Correction :* **Action immédiate requise.** Utiliser des variables d'environnement.
        1.  Installer un package comme `vlucas/phpdotenv` (`composer require vlucas/phpdotenv`).
        2.  Créer un fichier `.env` à la racine du backend (et l'ajouter au `.gitignore`).
        3.  Y déplacer les secrets :
            ```ini
            SMTP_PASS="abraham38Rayan"
            APP_PEPPER="8f4b2e1a9c3d5e7f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f"
            ```
        4.  Charger ces variables dans `init.php` ou `app.php`.

### B. Modèles (`personneDAO.class.php`)
*   **Qualité du code :**
    *   *Positif :* L'usage systématique des requêtes préparées est excellent et protège efficacement contre les injections SQL.
    *   *Incohérence :* Les méthodes `find` ne retournent pas des types de données cohérents. `findByUsername` retourne un objet `Personne` typé, mais `findByEmail` retourne un `stdClass`.
    *   *Correction :* Standardiser toutes les méthodes `find` pour qu'elles retournent soit un objet du domaine (ex: `Personne`), soit `null`.

### C. Contrôleurs (`login.ctrl.php`)
*   **Testabilité :**
    *   *Défaut :* L'usage intensif de `exit()` et `die()` empêche toute forme de test unitaire sur la logique des contrôleurs.
    *   *Impact :* Il est impossible de vérifier automatiquement le comportement des contrôleurs sans passer par des tests `end-to-end` lourds.
    *   *Correction (P2) :* Adopter une approche de retour de réponse, comme suggéré dans la revue du 20/01. Isoler la logique de la présentation.

## 3. Frontend (React)

### A. Qualité du Code & UI (`Dashboard.jsx`)
*   **Code "Spaghetti" d'icônes :**
    *   *Défaut :* Le composant contient de gros blocs de code SVG hardcodés, ce qui le rend difficile à lire et à maintenir.
    *   *Correction (P2) :* Créer un composant `<Icon name="arrow_forward" />` qui charge dynamiquement le SVG approprié depuis un dossier (`public/icons`). Cela nettoiera considérablement le JSX.

### B. Robustesse des Appels API
*   **Gestion d'erreur incomplète :**
    *   *Défaut :* Les appels `fetch` ne vérifient pas si `response.ok` est `true`. Si l'API retourne une erreur HTTP (404, 500), le `response.json()` va échouer et provoquer un crash côté client.
    *   *Correction (P1) :* Systématiquement ajouter un check après chaque `fetch`:
      ```javascript
      const response = await fetch(...);
      if (!response.ok) {
          // Tenter de lire le message d'erreur du backend, sinon message par défaut
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      ```
*   **Feedback utilisateur :**
    *   *Défaut :* Dans `accepterDemandeTrajet`, si l'appel échoue, l'erreur est juste logguée en console. L'utilisateur n'a aucun retour et pense que son action a peut-être fonctionné.
    *   *Correction (P1) :* Utiliser un state pour stocker les erreurs et afficher une notification à l'utilisateur en cas d'échec (`toast`, `alert`, ou un simple message).

## 4. Base de Données (`create.sql`)

*   **Points Forts :**
    *   La structure est bien pensée, avec usage de `UUID`, de contraintes `FOREIGN KEY` et de `ON DELETE CASCADE` qui assurent une bonne intégrité des données.
    *   La mise en place de triggers pour l'audit (`audit_trigger_function`) est une fonctionnalité avancée et très précieuse pour la traçabilité.
    *   La présence d'une table `login_attempts` et d'index pertinents (`idx_attempts_ip_time`) montre que la performance et la sécurité ont été considérées au niveau de la base de données.
*   **Points Faibles :**
    *   **Absence de stratégie de migration :** Le script est destructif (`DROP TABLE`). Pour un environnement de production, il est impératif d'utiliser un outil de migration (ex: Phinx, Doctrine Migrations) pour faire évoluer le schéma sans perdre les données.
    *   **Nettoyage :** Des commentaires non professionnels (`epstein boss`, `mathieu 67`) sont présents et doivent être retirés.

---

## Synthèse des Actions Prioritaires (Plan de Bataille)

| Priorité | Composant | Action Requise |
| :--- | :--- | :--- |
| **P0 (Critique)** | Backend | **Externaliser les secrets** de `config.php` vers un fichier `.env`. |
| **P1 (Majeur)** | Frontend | **Robustesse Fetch** : Ajouter la vérification `response.ok` et la gestion d'erreur visible pour l'utilisateur sur tous les appels API. |
| **P1 (Majeur)** | Backend | **Standardiser les retours des DAO** pour qu'ils soient cohérents (toujours des objets typés ou `null`). |
| **P2 (Moyen)** | Frontend | **Refactoring UI** : Extraire les SVG des composants pour créer un système d'icônes réutilisable. |
| **P2 (Moyen)** | Backend/DB | **Mettre en place un outil de migration** de base de données et nettoyer les commentaires du fichier `create.sql`. |

