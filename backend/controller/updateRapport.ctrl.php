<?php
require_once('model/rapportDAO.class.php');
require_once(__DIR__ . '/../app.php');

$app = new App();

try {
    if (!$app->connected || $app->id_famille <= 0) {
        throw new Exception("Session invalide.");
    }

    $json = file_get_contents('php://input'); 
    $data = json_decode($json, true); 

    if (empty($data['id_rapport']) || empty($data['nom'])) {
        throw new Exception("Données manquantes pour la modification.");
    }

    $model = new RapportDAO();
    $success = $model->updateRapport(
        $app->id_famille, 
        $data['id_rapport'], 
        $data['nom'], 
        $data['description']
    );

    echo json_encode(["success" => $success]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(["error" => $e->getMessage()]);
}