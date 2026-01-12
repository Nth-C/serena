<?php
require_once('model/evenementDAO.class.php');
require_once(__DIR__ . '/../app.php');

/*
// Indispensable pour que React puisse communiquer avec PHP
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
*/

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

    $model = new EvenementDAO();
    $success = $model->addEvenement($app->id_famille,$data['titre'], $data['debut'], $data['fin'], $data['lieu'], $data['description']);

    // renvoie a la vue des informations
    echo json_encode([
        "success" => $success,
    ]);

} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}