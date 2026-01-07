<?php
require_once('model/medicamentDAO.class.php');
require_once(__DIR__ . '/../app.php');

// Indispensable pour que React puisse communiquer avec PHP
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

try {
    $json = file_get_contents('php://input'); // lit le body du fetch
    $data = json_decode($json, true); // transforme '$json' en tableau

    if (empty($data['id_medicament']) || !isset($data['stock'])) {
        throw new Exception("Données manquantes (id_medicament ou stock).");
    }

    $model = new MedicamentDAO();
    $success = $model->addSameMedecine($app->id_famille,$data['id_medicament'], $data['stock']);

    // renvoie a la vue des informations
    echo json_encode([
        "success" => $success,
    ]);

} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}