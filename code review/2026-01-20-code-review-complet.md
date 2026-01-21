# Revue de Code Critique & Consolidée - Serena (2026-01-20)

**Portée :** Analyse approfondie du Backend (PHP), Frontend (React), Tests et Infrastructure.
**Objectif :** Identifier les dettes techniques, les failles de sécurité résiduelles et les problèmes de performance.

## 1. Architecture & Global

*   **Dette Technique Majeure (Architecture Hybride) :** Le projet souffre d'une schizophrénie architecturale.
    *   *Problème :* Coexistence de contrôleurs API modernes (`*.ctrl.php` retournant du JSON) et de scripts Legacy (`login_action.php`, `profile.php` avec redirections HTML).
    *   *Impact :* Duplication de la logique de session et confusion pour les développeurs.
    *   *Action :* **Priorité P1.** Supprimer les fichiers Legacy et migrer 100% des flux vers l'API REST.
*   **Absence de Routeur Central :**
    *   *Problème :* L'API repose sur l'accès direct aux fichiers ou des paramètres `?route=`.
    *   *Action :* Implémenter un `index.php` (Front Controller) qui centralise toutes les entrées, gère le routing et les erreurs 404.

## 2. Backend (PHP)

### A. Sécurité & Infrastructure (`init.php`, `csrf.php`)
*   **Faille CSRF sur API JSON :**
    *   *Défaut :* La protection actuelle vérifie `$_POST`. Or, les appels `fetch` en JSON (`php://input`) laissent `$_POST` vide.
    *   *Risque :* Les endpoints API sont vulnérables aux attaques CSRF.
    *   *Correction :* Modifier le middleware pour accepter le token via un Header HTTP (ex: `X-CSRF-Token`).
*   **Fuite d'informations (Connexion DB) :**
    *   *Défaut :* En cas d'échec de connexion PDO (ex: incident du 20/01), l'exception par défaut affiche l'IP et le port de la base de données.
    *   *Correction :* Encapsuler la connexion `new PDO` dans un `try/catch` et logger l'erreur en interne, sans jamais l'afficher au client.

### B. Contrôleurs (`addMedicament.ctrl.php`)
*   **Mauvaise sémantique HTTP :**
    *   *Défaut :* Le contrôleur renvoie un code HTTP `200 OK` même quand `success: false` (erreur logique ou validation).
    *   *Impact :* Complique la gestion d'erreur côté Frontend (oblige à parser le JSON pour savoir si ça a marché).
    *   *Correction :* Utiliser `http_response_code(400)` pour les erreurs client et `500` pour le serveur.
*   **Testabilité :**
    *   *Défaut :* L'utilisation de `exit()` ou `die()` dans le contrôleur rend les tests unitaires du contrôleur impossibles (arrête le script de test).
    *   *Correction :* Retourner une réponse et laisser le routeur gérer l'envoi et la fin du script.

### C. Modèles & Performance (`SecurityDAO`, `DocumentDAO`)
*   **Goulot d'étranglement (SecurityDAO) :**
    *   *Défaut :* `getSecurityStatus` effectue un `DELETE` (nettoyage des logs) à chaque lecture.
    *   *Impact :* Verrouillage de table inutile sur fort trafic.
    *   *Correction :* Passer ce nettoyage en tâche CRON ou en exécution probabiliste (1 fois sur 100).
*   **Qualité du code DAO :**
    *   *Positif :* L'utilisation systématique de `prepare/execute` protège bien des injections SQL.

## 3. Frontend (React)

### A. Qualité du Code (`Dashboard.jsx`, `ocr.jsx`)
*   **Code "Spaghetti" UI :**
    *   *Défaut :* Les icônes SVG sont hardcodées dans le JSX du Dashboard (+150 lignes inutiles).
    *   *Correction :* Extraire dans des composants `<Icon... />`.
*   **Gestion d'erreur Fetch :**
    *   *Défaut :* `fetch` ne rejette pas la promesse sur les erreurs 4xx/5xx. Le code tente de parser du JSON sur une page d'erreur HTML, provoquant un crash JS.
    *   *Correction :* Ajouter systématiquement :
      ```javascript
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      ```
*   **Nettoyage (`ocr.jsx`) :**
    *   *Défaut :* Présence de variables d'état inutilisées (`idCatalogueMedecine`) et usage de `alert()` bloquant.

## 4. Tests Unitaires (PHPUnit)

*   **Points Forts :**
    *   Les tests (`DocumentDAOTest`, `EvenementDAOTest`) sont excellents. L'utilisation de Mocks pour `DAL` et `PDOStatement` prouve une bonne compréhension de l'isolation des tests.
    *   La couverture des transactions (`testDeleteEvenementRollbackOnFailure`) est un très bon point.

*   **Manquements :**
    *   Absence de tests d'intégration. Les Mocks valident la logique PHP, mais ne garantissent pas que la requête SQL réelle fonctionne sur la base PostgreSQL.
    *   Absence de tests pour les Contrôleurs API.

## 5. DevOps & Base de Données

*   **Base de Données :**
    *   *Incident :* `SQLSTATE[08006] Connection refused`.
    *   *Action :* Vérifier les timeouts de connexion et s'assurer que le service DB redémarre automatiquement.
*   **Docker :**
    *   *Sécurité :* Les conteneurs tournent-ils bien en utilisateur non-root ? (Point marqué comme "FAIT" mais à vérifier en CI).
    *   *Secrets :* Le fichier `.env.example` est présent, c'est bien. S'assurer qu'aucun `.env` réel n'est dans l'historique Git.

---

## Synthèse des Actions Prioritaires (Plan de Bataille)

| Priorité | Composant | Action Requise |
| :--- | :--- | :--- |
| **P0 (Critique)** | Backend | **Sécuriser la connexion DB** (try/catch) pour ne pas exposer l'infra en prod. |
| **P0 (Critique)** | Backend | **Fix CSRF** : Supporter les headers `X-CSRF-Token` pour les appels API. |
| **P1 (Majeur)** | Backend | **Refactoring HTTP** : Renvoyer les bons codes (400, 401, 403) dans les contrôleurs. |
| **P1 (Majeur)** | Frontend | **Robustesse Fetch** : Gérer `response.ok` avant le parsing JSON. |
| **P2 (Moyen)** | Backend | **Performance** : Optimiser le nettoyage des logs dans `SecurityDAO`. |
| **P2 (Moyen)** | Frontend | **Refactoring UI** : Extraire les SVG du Dashboard. |

---

## Exemple de Correction : Gestionnaire d'Erreur API

Pour éviter les `200 OK` avec `{success: false}`, voici un helper suggéré :

```php
// utils/Response.php
class Response {
    public static function json($data, $status = 200) {
        http_response_code($status);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }
    
    public static function error($message, $status = 400) {
        self::json(['success' => false, 'error' => $message], $status);
    }
}

// Utilisation dans addMedicament.ctrl.php
if (!$app->checkRole('Famille')) {
    Response::error('Accès refusé', 403);
}

try {
    // ... logique ...
    Response::json(['success' => true, 'data' => $result]);
} catch (Exception $e) {
    // En prod, on log $e->getMessage() mais on affiche un message générique
    error_log($e->getMessage()); 
    Response::error('Erreur serveur interne', 500);
}
```