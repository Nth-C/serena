<?php
require_once('model/rapportDAO.class.php');
require_once(__DIR__ . '/../app.php');

$app = new App();
$model = new RapportDAO();

try {
    
    $rapports = $model->getRapportsDuJour($app->id_famille);
    
    if (empty($rapports)) {
        $rapports = $model->getDernierRapport($app->id_famille);
    }

    foreach ($rapports as &$row) {
        $row['medics_details'] = $model->getMedicsByRapport($row['id_rapport']);
    }

    echo json_encode($rapports);

} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}