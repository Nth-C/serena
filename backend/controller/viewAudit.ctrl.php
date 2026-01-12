<?php
// --- 1. GESTION DES HEADERS CORS (Indispensable pour React) ---
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// --- 2. CONFIGURATION SESSION AVANT L'APP ---
if (session_status() === PHP_SESSION_NONE) {
    // On configure le cookie pour qu'il passe entre React et PHP
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'domain' => '', 
        'secure' => false, 
        'httponly' => true,
        'samesite' => 'Lax' 
    ]);
    // Note : On ne fait pas session_start() ici car "new App()" le fait juste après
}

// --- 3. CHARGEMENT DE L'APPLICATION ---
require_once(__DIR__ . '/../app.php');
require_once('model/auditDAO.class.php');

// Initialisation de l'App (qui démarre la session et charge l'utilisateur)
$app = new App();

// --- 4. VÉRIFICATION VIA L'OBJET APP ---
// On utilise $app->id_famille car c'est lui qui sait gérer l'objet session correctement
if (!$app->connected) {
    echo json_encode(['error' => 'Utilisateur non connecté']);
    exit();
}

if (empty($app->id_famille)) {
    echo json_encode(['error' => 'Aucune famille associée à ce compte']);
    exit();
}

// --- 5. RÉCUPÉRATION DES DONNÉES ---
try {
    $auditDAO = new auditDAO();
    
    // On utilise l'ID géré par la classe App
    $logs = $auditDAO->getAllAudit($app->id_famille);
    
    echo json_encode($logs ?: []);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>