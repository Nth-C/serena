<?php
require_once('model/trajetDAO.class.php');
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

    // if (empty($data['titre']) || empty($data['lieu']) || 
    // empty($data['accompagnants']) || empty($data['debut']) || empty($data['fin']) || empty($data['recurrence']) || empty($data['description'])) {
    //     throw new Exception("Données manquantes (name ou stock).");
    // }

    //ajouter 

    $model = new TrajetDAO();
    $success = $model->addTrajet($data['date_deb'],$data['date_fin'], $data['lieu_dep'], $data['lieu_arr'], $data['id_event']);

    // renvoie a la vue des informations
    echo json_encode([
        "success" => $success,
    ]);

} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}