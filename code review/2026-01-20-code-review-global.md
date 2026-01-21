# Revue de Code Globale - Serena (2026-01-20)

## Contexte

Cette revue consolide l'ensemble des analyses effectuées sur le projet (Backend PHP, Frontend React, Service OCR). Elle prend en compte l'incident critique de base de données survenu ce jour et l'état d'avancement de la refonte architecturale.

**État du projet :** En cours de stabilisation. Transition d'une architecture PHP Legacy vers une API RESTful consommée par une SPA React.

## 1. Synthèse des Problèmes Critiques (Bloquants)

### A. Stabilité et Connexion Base de Données
*   **Incident :** Erreur `SQLSTATE[08006] Connection refused` observée.
*   **Diagnostic :** Le backend expose les détails de l'infrastructure (IP, Port) en cas d'échec de connexion PDO.
*   **Action requise :**
    1.  Encapsuler la connexion PDO dans un bloc `try/catch` robuste.
    2.  Ne jamais renvoyer `$e->getMessage()` au frontend en production.
    3.  Vérifier le service PostgreSQL chez l'hébergeur (AlwaysData).

### B. Architecture Backend Hybride (Dette Technique Majeure)
*   **Problème :** Coexistence de deux paradigmes contradictoires :
    1.  **API JSON (Cible)** : `login.ctrl.php`, `medicament/add`.
    2.  **Legacy (À supprimer)** : `login_action.php`, `profile.php` (gestion par formulaires HTML classiques et redirections).
*   **Risque :** Confusion dans la gestion de session et duplication de code.
*   **Action requise :** Supprimer définitivement les fichiers "Legacy" et migrer toute la logique vers des contrôleurs JSON (`*.ctrl.php`).

### C. Sécurité des API (CSRF)
*   **Problème :** La protection CSRF actuelle (`csrf_guard.php`) vérifie `$_POST`, ce qui est inefficace pour les requêtes JSON (`fetch` avec `application/json`) où `$_POST` est vide.
*   **Action requise :** Adapter le middleware CSRF pour lire le token depuis les en-têtes HTTP (`X-CSRF-Token`).

## 2. Revue Spécifique Frontend (`ocr.jsx`)

Basée sur la dernière version du fichier :

### Qualité du Code et Nettoyage
*   **Variables inutilisées :** La variable d'état `const [idCatalogueMedecine, setIdCatalogueMedecine] = useState("")` est déclarée mais n'est plus utilisée (remplacée par `formIdCatalogue`). Elle doit être supprimée.
*   **Expérience Utilisateur (UX) :** L'utilisation de `alert()` (lignes 166, 169) bloque le thread principal et offre une UX pauvre. Remplacer par un composant de notification (Toast/Snackbar).

### Gestion des Erreurs
*   **Incohérence API :** Le code gère `data.error` mais l'incident DB a montré que le backend peut renvoyer `data.message`.
    *   *Correction :* `const msg = data.error || data.message || "Erreur inconnue";`
*   **Robustesse :** Dans `handleSearchMedecine`, la réponse `fetch` n'est pas vérifiée avec `response.ok` avant le parsing JSON, ce qui peut provoquer des crashs silencieux si l'API renvoie une erreur 500 HTML.

## 3. Architecture & DevOps

### Organisation du Code
*   **Frontend :** La logique OCR (Tesseract) est fortement couplée au composant UI. Il est recommandé de l'extraire dans un service (`services/ocrService.js`).
*   **Backend :** Manque d'un routeur centralisé (`index.php`). Actuellement, l'API repose sur des appels directs aux fichiers ou des paramètres `?route=`. Un vrai routeur (type FastRoute ou simple switch/case dans index) sécuriserait les points d'entrée.

### Déploiement
*   **Secrets :** La gestion des variables d'environnement (`.env`) a été améliorée, mais il faut s'assurer qu'aucun fichier `.env` ne reste dans l'historique Git.
*   **Docker :** Les conteneurs doivent tourner en utilisateur non-root (directive `USER` dans Dockerfile) pour limiter la surface d'attaque.

## 4. Plan d'Action Priorisé

| Priorité | Domaine | Tâche |
| :--- | :--- | :--- |
| **P0 (Urgent)** | Backend | **Sécuriser la connexion DB** : Masquer les erreurs SQL et logger en interne. |
| **P0 (Urgent)** | Backend | **Fix CSRF** : Supporter les tokens via Headers pour les appels API JSON. |
| **P1** | Frontend | **Nettoyage `ocr.jsx`** : Supprimer les états morts et harmoniser la lecture des erreurs (`error` vs `message`). |
| **P1** | Backend | **Unification** : Supprimer les scripts PHP Legacy (`login_action.php`, etc.). |
| **P2** | Global | **Documentation** : Mettre à jour le README avec les procédures de lancement Docker et les variables d'env requises. |

## 5. Standards de Code (Rappel)

*   **Langue :** Commentaires et documentation en Français (selon l'historique du projet).
*   **Formatage :** Prettier pour le JS/React, PSR-12 pour le PHP.
*   **Commits :** Messages conventionnels (ex: `fix(db): secure connection error handling`).