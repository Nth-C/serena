<?php
require_once('model/categorieDAO.class.php');
require_once('model/documentDAO.class.php');
require_once(__DIR__ . '/../app.php');

header("Content-Type: application/json");

$app = new App();


if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

try {
    $model = new RapportDAO();
    $rapports = $model->getAllRapports($app->id_famille);
    echo json_encode($rapports);
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}