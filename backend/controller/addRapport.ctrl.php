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
        echo "Erreur : id_personne ou description manquant dans le JSON";
        throw new Exception("Données manquantes.");
    }

    $model = new RapportDAO();
    

    $success = $model->addRapport($app->id_famille, $data['id_personne'], $data['description']);

    if ($success) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "L'insertion a échoué en base de données"]);
    }

} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}