<?php
require_once(__DIR__ . '/../model/rapportDAO.class.php');
require_once(__DIR__ . '/../app.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

try {
    if (!$app->connected || !$app->id_famille) {
        http_response_code(403);
        throw new Exception("Session expirée ou aucune famille sélectionnée.");
    }

    $json = file_get_contents('php://input'); 
    $data = json_decode($json, true); 

    $id_rapport = filter_var($data['id'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);
    // vérifie l'existance du rapport dans la requete
    if (empty($id_rapport)) {
        http_response_code(400);
        throw new Exception("ID du rapport manquant pour la suppression.");
    }

    $model = new RapportDAO();
    // supprime les rapports
    $success = $model->deleteRapport($id_rapport, $app->id_famille);

    echo json_encode([
        "success" => $success, 
    ]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}

exit();