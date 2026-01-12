<?php
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

if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'domain' => '', 
        'secure' => false, 
        'httponly' => true,
        'samesite' => 'Lax' 
    ]);
}

require_once(__DIR__ . '/../app.php');
require_once('model/auditDAO.class.php');

$app = new App();


if (!$app->connected) {
    echo json_encode(['error' => 'Utilisateur non connecté']);
    exit();
}

if (empty($app->id_famille)) {
    echo json_encode(['error' => 'Aucune famille associée à ce compte']);
    exit();
}

try {
    $auditDAO = new auditDAO();
    
    $logs = $auditDAO->getAllAudit($app->id_famille);
    
    echo json_encode($logs ?: []);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>