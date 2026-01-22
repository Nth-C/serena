<?php
require_once(__DIR__ . '/../model/evenementDAO.class.php');
require_once(__DIR__ . '/../app.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

// Vérification de sécurité
if (!$app->connected || !$app->id_famille) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Session expirée']);
    exit;
}

try {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    // Récupération de l'id_recurrence
    $id_recurrence = $data['id_recurrence'] ?? null;

    if (!$id_recurrence) {
        throw new Exception("ID de récurrence manquant.");
    }

    $modelEv = new EvenementDAO();
    
    //supprime les évènements d'une même récurrence
    $success = $modelEv->deleteEvenementRecurrence($app->id_famille, $id_recurrence);

    echo json_encode(["success" => $success]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}
exit();