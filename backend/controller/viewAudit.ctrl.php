<?php
require_once(__DIR__ . '/../app.php');
require_once(__DIR__ . '/../model/auditDAO.class.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit();
}

$app = new App();

if (!$app->connected) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Utilisateur non connecté']);
    exit();
}

if (empty($app->id_famille)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Aucune famille active']);
    exit();
}

if (!$app->checkRole('Famille')) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Droits insuffisants']);
    exit; 
}

try {
    $auditDAO = new AuditDAO();

    // revoie toutes les logs de la famille 
    $historique = $auditDAO->getAllAudit($app->id_famille);
    
    echo json_encode($historique ?: []);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

exit();