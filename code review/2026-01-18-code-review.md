# Revue de code - Serena_ (2026-01-18)

Portée: Monorepo avec backend (PHP), frontend (React), service OCR (Python/Node), configuration Docker, scripts SQL. Cette revue liste, par domaines, ce qui manque et ce qu’il faut corriger/améliorer sous forme de points à puces.

## Global / Dépôt
- README racine manquant expliquant l’architecture, l’installation (Docker et local), les variables d’environnement, les ports de services et les workflows (tests, build, run).
- Nommage/casse incohérents dans certains dossiers/fichiers (ex: `DockerFIle` au lieu de `Dockerfile`, `Silde.module.css` au lieu de `Slide`). Standardiser pour éviter des problèmes multi-OS.
- Ajouter un fichier LICENSE si le projet est ouvert ou s’il faut clarifier la licence.
- Ajouter un `.editorconfig` pour homogénéiser indentation, charset, fins de ligne, suppression des espaces en fin de ligne.
- Mettre en place une CI (GitHub Actions/GitLab CI) qui lance tests unitaires (PHP/JS/Python), lint, vérifications de types, build, et build d’images Docker sur chaque push/PR.
- Vérifier `.gitignore` pour couvrir `node_modules`, `vendor`, artefacts de build, logs, fichiers `.env` et volumes Docker. S’assurer qu’aucun secret n’est versionné.

## Sécurité
- Des fichiers d’environnement sont commités: `serena/backend/.env`, `frontend/.env.development`, `sere-na-llama-ocr/.env`. Les retirer du VCS, régénérer/rotation des secrets, charger via variables d’environnement/secrets manager.
- Valider et assainir toutes les entrées utilisateur côté serveur (PHP) et côté services. Centraliser la validation.
- Protection CSRF pour les endpoints modifiant l’état (tokens ou cookies SameSite).
- CORS: définir explicitement les origines autorisées; éviter le joker en production.
- Cookies de session/auth en HTTPS uniquement; définir Secure, HttpOnly, SameSite=strict.
- Exécuter les images Docker en utilisateur non-root; ajouter la directive USER dans les Dockerfiles.
- Scanner les dépendances pour vulnérabilités (npm, pip, composer) et pinner les versions avec des fichiers de verrouillage (lockfiles).

## Docker / DevOps
- docker-compose.yml: s’assurer que les noms de services, réseaux et volumes sont explicites. Ajouter des healthchecks (backend PHP, OCR, DB).
- Ajouter un fichier `.env` pour compose (sans secrets) et référencer ces variables dans le compose. Ne pas commiter de secrets.
- Dockerfiles multi-étapes pour le frontend (build Node -> image finale nginx/alpine) et le backend (composer install -> php-fpm/apache). Réduire la taille des images et améliorer le cache.
- Corriger la faute de casse `sere-na-llama-ocr/DockerFIle` -> `Dockerfile` pour compatibilité outillage.
- Ajouter un Makefile (ou scripts npm/composer) pour orchestrer les tâches fréquentes: `make up`, `make test`, `make lint`, etc.

## Base de données (SQL)
- Revoir `data/create.sql` et `data/copy.sql`:
  - Présence de clés primaires/étrangères, contraintes uniques, et index appropriés.
  - Types adaptés (INT/UUID, timestamps avec fuseau si nécessaire).
  - Contraintes NOT NULL pour les champs requis.
  - Stratégie de migrations: adopter un outil (Phinx/Liquibase) plutôt que des scripts ad hoc.
  - Séparer données de seed du schéma; aucun secret ni donnée sensible persistée.
- Intégrer les migrations à la CI et au bootstrap dev.

## Backend (PHP)
- Clarifier la stratification: Contrôleur -> Service -> DAO; éviter que les contrôleurs accèdent directement aux DAO lorsque la logique métier grandit.
- Mettre en place un routeur (front-controller index.php ou micro-framework Slim/Lumen) avec dispatch par méthode et gestion d’erreurs homogène.
- Injection de dépendances pour DAO/services; éviter `new` dans les contrôleurs pour faciliter les tests.
- Validation des entrées: créer des DTO de requête avec règles; renvoyer des erreurs typées et un schéma JSON cohérent.
- Gestion des erreurs: gestionnaire centralisé mappant les exceptions sur des codes HTTP avec réponses JSON structurées.
- Formatage des réponses: garantir `Content-Type: application/json` pour les APIs; standardiser un envelope de réponse.
- Accès BD: utiliser systématiquement des requêtes préparées et paramètres (prévenir injections SQL).
- Tests: étendre la couverture (il existe `tests/Unit/DocumentDAOTest.php`). Ajouter tests des contrôleurs, services, DAO, et tests d’intégration avec BD de test.
- Standards de code: adopter PSR-12; intégrer PHP-CS-Fixer ou PHPCS en CI.
- Autoloading: configurer Composer (PSR-4); éviter les includes manuels. Ajouter `composer.json` si manquant.
- Environnements: utiliser `vlucas/phpdotenv` pour le dev; ne jamais dépendre de `.env` commité.
- Logging: intégrer un logger PSR-3 (Monolog), logs structurés, IDs de corrélation.
- Authentification/Autorisation: préciser le mécanisme (JWT/session), middleware d’auth et de contrôle d’accès par rôle.
- Pagination/filtrage/tri sur les endpoints de listes pour éviter des charges lourdes.
- Limitation de débit (rate limiting) et limites de taille des requêtes pour les uploads.
- Vérifications d’entrées et de droits sur les flux « signalement » (création/mise à jour/suppression).

## Frontend (React)
- Routing: utiliser React Router avec routes protégées si auth.
- State management: clarifier (Context/Zustand/Redux). Éviter le prop drilling et centraliser l’état d’auth.
- Client API: créer un wrapper axios/fetch commun (baseURL, interceptors pour auth, gestion erreurs, retry/backoff).
- Variables d’env: suivre les conventions Vite/CRA (ex. VITE_ pour Vite). Ne pas commiter de secrets. Fournir `.env.example`.
- Formulaires: adopter une lib de formulaires et validation (React Hook Form + Zod/Yup) pour CreateAccount, ForgotPassword, Signalement.
- Accessibilité: audit a11y (labels, rôles, navigation clavier); corriger la faute `Silde.module.css`.
- CSS: stratégie cohérente (CSS modules/utility). Supprimer CSS/images non utilisées. Envisager des tokens de design.
- Gestion des erreurs: Error Boundaries et Suspense pour pages asynchrones (OCR/TestOCR).
- Tests: unitaires (Vitest/Jest) et composants (React Testing Library). E2E (Playwright/Cypress).
- Performance: code splitting des routes; mémoïser les composants lourds; images optimisées.
- Lint/format: ESLint + Prettier configurés et appliqués en CI.

## Service OCR (sere-na-llama-ocr)
- Clarifier l’architecture: présence de `index.js` (Node) et `tesseract-ocr/app.py` (Python). Documenter l’interaction. Supprimer le code mort si un seul est utilisé. Si les deux coexistent, définir interfaces et ports.
- Dockerisation: un service par langage; ajouter des endpoints de healthcheck.
- Python: pinner les dépendances, utiliser `requirements.txt` au bon niveau; venv dans Docker; exécuter en non-root; exposer le port; utiliser gunicorn/uvicorn pour prod.
- Node: définir scripts package.json, lockfile, validation des entrées sur les endpoints.
- Sécurité uploads: valider taille/type, assainir les noms de fichiers, stocker hors webroot, envisager un scan antivirus.

## Contrats d’API & Documentation
- Fournir une spécification OpenAPI/Swagger pour le backend (et service OCR). L’utiliser pour générer types clients et docs.
- Versionner les APIs (`/api/v1/...`) et définir une politique de dépréciation.

## Observabilité
- Journalisation des requêtes avec IDs de corrélation entre services.
- Métriques: exposer latence, erreurs, débit (Prometheus ou équivalent).
- Traces: OpenTelemetry (optionnel) utile pour debug multi-services.

## Données & Conformité
- Définir rétention des documents/upload et des signalements. Tâches planifiées de nettoyage.
- Expurger les PII des logs. Chiffrer au repos les champs sensibles si requis.

## Expérience Développeur (DX)
- Script de bootstrap dev pour démarrer tous les services avec données seed.
- Hot reload pour frontend et backend (nodemon/php -S en dev, FastAPI reload, etc.).
- Hooks pre-commit (Husky + lint-staged / pre-commit) pour lint/format/test en local.

## Fichiers/Dossiers relevés avec problèmes
- `sere-na-llama-ocr/DockerFIle`: faute de casse; renommer en `Dockerfile`.
- `frontend/src/components/slide/Silde.module.css`: faute d’orthographe; renommer dossier/fichier.
- Fichiers `.env` commités à plusieurs endroits; supprimer et faire tourner (rotate) les secrets.

## Prochaines étapes actionnables (priorisées)
1. Retirer tous les secrets du dépôt (`.env`), ajouter `.env.example`, et faire tourner les identifiants/clés.
2. Corriger les fautes de noms (DockerFIle, Silde.module.css -> Slide.module.css) et standardiser la casse.
3. Ajouter un README racine et des READMEs par service avec installation/exécution détaillées.
4. Ajouter `.gitignore`, `.editorconfig` et une CI de base pour lint/test/build.
5. Introduire Composer (backend), ESLint/Prettier (frontend), et pinner les dépendances avec lockfiles partout.
6. Définir des contrats d’API (OpenAPI) et centraliser la validation requête/réponse.
7. Durcir les Dockerfiles (multi-étapes, non-root, healthchecks) et docker-compose (réseaux/volumes dédiés).
8. Implémenter une gestion centralisée des erreurs et logs avec réponses JSON structurées côté backend.
9. Ajouter des tests unitaires/intégration backend et frontend; tests E2E pour les parcours clés.
10. Documenter l’architecture du service OCR, supprimer le code non utilisé et sécuriser la gestion des fichiers.
