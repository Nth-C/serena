# Revue de Code - Serena (2026-01-20)

## Contexte

Cette revue fait suite à l'erreur bloquante rencontrée lors de l'intégration du module OCR : `failed to resolve import tesseract.js`. L'objectif est de corriger l'environnement de développement frontend et d'établir les bonnes pratiques pour l'utilisation de tâches lourdes (comme l'OCR) dans une application React.

## Problèmes Critiques (Bloquants)

### 1. Résolution des Dépendances et Imports

*   **Observation :** Le bundler (Vite/Webpack) ne parvient pas à localiser le module `tesseract.js`. Cela indique généralement une installation manquante ou une incompatibilité de résolution de module.
*   **Risque :** L'application ne peut pas compiler ou crashe au lancement.
*   **Recommandation :**
    *   **Installation :** S'assurer que le paquet est bien présent dans `package.json`. Exécuter `npm install tesseract.js` à la racine du dossier frontend.
    *   **Syntaxe d'import (ESM) :** Privilégier l'import nommé pour permettre le "tree-shaking" (optimisation de la taille du bundle).
    ```javascript
    // Mauvais (peut importer tout le module inutilement)
    import Tesseract from 'tesseract.js';
    
    // Recommandé
    import { createWorker } from 'tesseract.js';
    ```

## Améliorations de Performance et Stabilité

### 2. Gestion du Cycle de Vie du Worker (Memory Leaks)

*   **Observation :** Les workers Tesseract sont gourmands en ressources. Une erreur fréquente est de créer un nouveau worker à chaque analyse d'image sans jamais le détruire.
*   **Risque :** Ralentissement progressif du navigateur et plantage de l'onglet (fuite de mémoire) après plusieurs utilisations.
*   **Recommandation :**
    *   Utiliser systématiquement la méthode `.terminate()` une fois l'analyse terminée.
    *   Implémenter le modèle `try...finally` pour garantir le nettoyage même en cas d'erreur.

### 3. Architecture et Séparation des Responsabilités

*   **Observation :** La logique d'OCR risque d'être fortement couplée aux composants React (UI).
*   **Recommandation :** Extraire la logique pure dans un service utilitaire dédié (ex: `src/services/ocrService.js`). Cela facilite les tests unitaires et garde les composants React légers.

    ```javascript
    // Exemple de structure pour src/services/ocrService.js
    export const analyzeImage = async (imageUrl) => {
      const worker = await createWorker('eng');
      try {
        const { data: { text } } = await worker.recognize(imageUrl);
        return text;
      } finally {
        await worker.terminate();
      }
    };
    ```

## Expérience Utilisateur (UX)

*   **Feedback Visuel :** L'initialisation du moteur OCR (chargement des fichiers `.traineddata` et WASM) prend du temps.
*   **Recommandation :** Utiliser le logger fourni par Tesseract pour afficher une barre de progression à l'utilisateur.
    ```javascript
    const worker = await createWorker('eng', 1, {
      logger: m => console.log(m) // À connecter à un état React (setProgress)
    });
    ```

## Prochaines Étapes Actionnables
1.  Exécuter `npm install tesseract.js` dans le dossier frontend.
2.  Créer le fichier `src/services/ocrService.js` pour isoler la logique.
3.  Intégrer l'appel au service dans le composant d'upload avec une gestion d'état pour le chargement (`isLoading`).