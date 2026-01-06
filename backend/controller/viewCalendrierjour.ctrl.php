<?php
require_once('model/evenementDAO.class.php');
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
    $model = new evenementDAO();
    $evenements = $model->getAllEvenementsJour($app->id_famille,date('Y-m-d'));
    // echo pour envoyer les données dans la vue
    echo json_encode($evenements);
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}