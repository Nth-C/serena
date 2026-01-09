<?php
require_once(__DIR__ . '/../model/rapportDAO.class.php');
require_once(__DIR__ . '/../app.php');

$app = new App(); // session_start() est fait ici
$model = new RapportDAO();

try {
    $id_famille = $app->id_famille; 

    // Si l'id est 0, c'est que tu n'as pas cliqué sur "Accéder" dans AcceSuivi.jsx
    if (!$id_famille || $id_famille === 0) {
        echo json_encode([]);
        exit;
    }

    $rapports = $model->getAllRapports($id_famille);
    echo json_encode($rapports);

} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}