<?php
/**
 * Fichier d'initialisation principal pour l'application Serena.
 * À inclure au début de chaque script de page.
 */

// 1. Configuration des cookies de session (DOIT être appelé AVANT session_start())
session_set_cookie_params([
    'lifetime' => 0, // Le cookie expire à la fermeture du navigateur.
    'path' => '/',
    'domain' => '',
    'secure' => true, // Le cookie ne sera envoyé que sur des connexions HTTPS.
    'httponly' => true, // Le cookie ne sera pas accessible via JavaScript.
    'samesite' => 'Strict' // Le cookie ne sera envoyé que pour les requêtes provenant du même site.
]);

// 2. Charger les variables d'environnement depuis le fichier .env de ce dossier
require_once __DIR__ . '/../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// 3. Gestion de la politique CORS (Cross-Origin Resource Sharing)
$allowed_origins = [
    'http://localhost:5173', // Adresse de votre serveur de développement frontend
    'https://sere-na.alwaysdata.net' // URL de votre application en production
];

if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header("Access-Control-Allow-Credentials: true");
}

// 4. Gestion des requêtes "preflight" (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token");
    http_response_code(200);
    exit();
}

// 5. Protection CSRF (qui va démarrer la session via csrf_ensure_session_started)
require_once __DIR__ . '/csrf.php';

csrf_validate_request();