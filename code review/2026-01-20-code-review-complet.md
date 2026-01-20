# Revue de Code Complète - Serena (2026-01-20)

## 1. Vue d'ensemble
Cette revue couvre l'intégralité des fichiers fournis (Backend PHP, Frontend React, Tests Unitaires).

**État général :** Le projet est en transition vers une architecture API/SPA robuste. Les pratiques de sécurité (CSRF, CORS, Session) sont en place. La couverture de tests unitaires côté backend est excellente sur les DAOs, utilisant correctement les Mocks.

---

## 2. Backend (PHP)

### A. Infrastructure & Initialisation (`init.php`)
*   **Sécurité des Sessions :** Configuration très robuste (`Strict`, `HttpOnly`, `Secure`). C'est un point fort pour prévenir le vol de session XSS.
*   **CORS :** La gestion dynamique de l'`Access-Control-Allow-Origin` basée sur une liste blanche (`$allowed_origins`) est correcte.
*   **CSRF :** L'inclusion de `csrf.php` dès l'init est une bonne pratique.
    *   *Attention :* Assurez-vous que `csrf_validate_request()` sait gérer les requêtes JSON (qui n'ont pas de `$_POST`), sinon les appels API échoueront.

### B. Modèles de Données (DAO)

#### `SecurityDAO.class.php`
*   **Points forts :** Hachage des IP (`sha512`) avant stockage, respectant la confidentialité (GDPR).
*   **Problème de Performance :** La méthode `getSecurityStatus` exécute un `DELETE` (nettoyage des logs > 24h) à *chaque* appel. Sur un site à fort trafic, cela va verrouiller la table inutilement.
    *   *Action :* Déplacer ce nettoyage dans une tâche CRON ou l'exécuter de manière probabiliste (ex: `if (rand(1, 100) === 1) ...`).
*   **Robustesse :** `verifierActif` gère bien les différents types de retour booléens de PostgreSQL/MySQL (`t`, `1`, `true`).

### C. Contrôleurs (`addMedicament.ctrl.php`)
*   **Architecture :** Le contrôleur suit une logique procédurale simple, adaptée pour une API sans framework lourd.
*   **Sécurité :**
    *   Vérification du rôle (`checkRole('Famille')`) effectuée avant tout traitement.
    *   Sanitization des entrées (`filter_var`) présente.
*   **Traitement JSON :** Lecture correcte via `php://input` (nécessaire car `$_POST` est vide pour les requêtes `application/json`).
*   **Amélioration HTTP :** Le code de réponse HTTP est toujours 200, même en cas d'erreur logique `{success: false}`.
    *   *Action :* Utiliser `http_response_code(400)` ou `403` pour permettre au frontend de gérer les erreurs plus proprement.

### D. Tests Unitaires (PHPUnit)
Les tests (`DocumentDAOTest`, `EvenementDAOTest`, `CategorieDAOTest`, `FamilleDAOTest`) sont d'excellente qualité technique.

*   **Isolation :** Utilisation correcte des Mocks pour `DAL` et `PDOStatement`. Les tests ne dépendent pas d'une base de données réelle, ce qui les rend rapides et fiables.
*   **Scénarios couverts :**
    *   **Transactions :** `EvenementDAOTest::testDeleteEvenementRollbackOnFailure` vérifie que le `rollBack()` est appelé en cas d'exception. C'est critique pour l'intégrité des données.
    *   **Logique Métier :** `CategorieDAOTest` valide la logique complexe de filtrage par rôle (Createur vs Proche vs Famille).
    *   **Cas Limites :** `DocumentDAOTest` vérifie le retour de tableaux vides au lieu de `false`.

---

## 3. Frontend (React - `Dashboard.jsx`)

### A. Logique et État
*   **Appels API :** Utilisation correcte de `fetch` avec `credentials: 'include'` pour passer les cookies de session PHP.
*   **Gestion d'erreur :** Le dashboard gère l'affichage des erreurs via l'état `error`.
    *   *Manquant :* `fetch` ne rejette pas la promesse sur les erreurs HTTP (404, 500). Il faut ajouter `if (!response.ok) throw new Error(...)` avant de parser le JSON.
*   **Tri des données :** `getProchaineTache` retourne `taches[0]`. Cela suppose que l'API renvoie les tâches *déjà triées* par date. Si ce n'est pas garanti par la requête SQL, un `.sort()` côté client est nécessaire pour éviter d'afficher une tâche lointaine.

### B. Qualité du Code UI
*   **Code SVG :** Les icônes SVG sont "hardcodées" directement dans le JSX. Cela rend le composant `Dashboard` très long (plus de 150 lignes) et difficile à maintenir.
    *   *Action :* Créer des composants dédiés (ex: `<IconTrajet />`, `<IconAlert />`) ou utiliser une librairie d'icônes.
*   **Composant Slide :** Bonne réutilisation du composant pour les détails ("Détails du Trajet").

---

## 4. Synthèse des Actions Recommandées

### Priorité Haute (Sécurité & Stabilité)
1.  **Backend (`SecurityDAO`) :** Sortir la requête `DELETE` de nettoyage de la méthode de lecture `getSecurityStatus`.
2.  **Backend (`init.php` / `csrf.php`) :** Vérifier que la validation CSRF supporte la lecture des headers (ex: `X-CSRF-Token`) pour les appels AJAX/JSON, car `$_POST` sera vide.

### Priorité Moyenne (Qualité & Maintenance)
3.  **Frontend (`Dashboard.jsx`) :** Extraire les SVG dans des fichiers séparés pour alléger le code.
4.  **Frontend (`Dashboard.jsx`) :** Ajouter la vérification `response.ok` dans les appels `fetch`.
5.  **Backend (Contrôleurs) :** Implémenter les codes de réponse HTTP standards (400, 401, 403, 500).

### Priorité Basse (Optimisation)
6.  **Backend (`init.php`) :** S'assurer que la liste `$allowed_origins` est bien synchronisée avec les variables d'environnement de production pour éviter les erreurs CORS après déploiement.

---

## 5. Exemple de Refactoring (SecurityDAO)

```php
// Avant
public function getSecurityStatus(string $ip): array {
    $ip_hashed = $this->hashIp($ip);
    // Mauvais : Side-effect lourd en lecture
    $this->dal->prepare("DELETE FROM login_attempts WHERE attempt_time < NOW() - INTERVAL '24 hours'")->execute();
    // ... suite du code
}

// Après (Proposition)
public function getSecurityStatus(string $ip): array {
    $ip_hashed = $this->hashIp($ip);
    
    // Nettoyage probabiliste (1 chance sur 100) pour éviter de surcharger la DB
    if (rand(1, 100) === 1) {
        $this->cleanOldAttempts();
    }
    
    // ... suite du code
}

private function cleanOldAttempts(): void {
    try {
        $this->dal->prepare("DELETE FROM login_attempts WHERE attempt_time < NOW() - INTERVAL '24 hours'")->execute();
    } catch (Exception $e) {
        // On ignore silencieusement l'erreur de nettoyage pour ne pas bloquer le login
    }
}
```