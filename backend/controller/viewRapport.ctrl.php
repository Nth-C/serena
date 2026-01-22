<?php
require_once(__DIR__ . '/../model/rapportDAO.class.php');
require_once(__DIR__ . '/../app.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

if (!$app->connected || !$app->id_famille) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Non connecté ou famille non sélectionnée']);
    exit;
}

try {
    $model = new RapportDAO();
    
    // récupération des rapports de visite de la famille
    $rapports = $model->getAllRapports($app->id_famille);

    // on ajoute les médicaments consommés pour chaque rapport
    foreach ($rapports as &$row) {
        $row['medics_details'] = $model->getMedicsByRapport($row['id_rapport']) ?: [];
    }

    echo json_encode([
        "success" => true, 
        "data" => $rapports ?: []
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "error" => $e->getMessage()
    ]);
}

exit();