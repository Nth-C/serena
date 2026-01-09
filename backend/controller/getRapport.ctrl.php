<?php
require_once(__DIR__ . '/../model/rapportDAO.class.php');
require_once(__DIR__ . '/../app.php');

$app = new App(); 
$model = new RapportDAO();

try {
    $id_famille = $app->id_famille; 

    if (!$id_famille || $id_famille === 0) {
        echo json_encode([]);
        exit;
    }

    $rapports = $model->getAllRapports($id_famille);
    echo json_encode($rapports);

} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}