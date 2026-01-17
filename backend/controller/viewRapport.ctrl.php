<?php
require_once('model/rapportDAO.class.php');
require_once(__DIR__ . '/../app.php');



if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

try {
    $model = new RapportDAO();
    $rapports = $model->getAllRapports($app->id_famille);

     foreach ($rapports as &$row) {
        $row['medics_details'] = $model->getMedicsByRapport($row['id_rapport']);
    }

    echo json_encode($rapports);
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}