<?php
require_once(__DIR__ . '/../model/evenementDAO.class.php');
require_once(__DIR__ . '/../app.php');

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

if (!$app->connected || !$app->id_famille) {
    http_response_code(403);
    echo json_encode(["success" => false, "error" => "Non autorisé"]);
    exit;
}

// vérifie le role
if (!$app->checkRole('Proche')) {
    http_response_code(403);
    echo json_encode([
        'success' => false, 
        'error' => 'Droits insuffisants.'
    ]);
    exit; 
}

try {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    $id_evenement = filter_var($data['id_evenement'] ?? $_GET['id_evenement'] ?? null, FILTER_SANITIZE_SPECIAL_CHARS);

    if (!$id_evenement) { 
        http_response_code(400);
        throw new Exception("ID manquant pour la suppression.");
    }

    $dao = new EvenementDAO();
    // supprime l'évènement
    $success = $dao->deleteEvenement($app->id_famille, $id_evenement);

    echo json_encode([
        "success" => $success, 
    ]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}

exit();