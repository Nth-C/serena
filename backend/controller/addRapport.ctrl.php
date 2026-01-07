<?php
require_once('model/rapportDAO.class.php');
require_once(__DIR__ . '/../app.php');

header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

try {
    $json = file_get_contents('php://input'); 
    $data = json_decode($json, true); 

    if (empty($data['id_personne']) || !isset($data['description'])) {
        throw new Exception("Données manquantes (id_personne ou description).");
    }

    $model = new RapportDAO();
    $success = $model->addRapport($app->id_famille,$data['id_personne'], $data['description']);

    echo json_encode([
        "success" => $success,
    ]);

} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}