<?php
require_once(__DIR__ . '/../model/rapportDAO.class.php');
require_once(__DIR__ . '/../app.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

// vérifie si on est connecter
if (!$app->connected || !$app->id_famille) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Accès refusé.']);
    exit;
}

try {
    $model = new RapportDAO();
    
    // récupère les rapports du jour de la famille
    $rapports = $model->getRapportsDuJour($app->id_famille);
    
    if (empty($rapports)) {
        $rapports = $model->getDernierRapport($app->id_famille);
    }

    // pour chaque rapport on récupère les medicaments du rapport
    foreach ($rapports as &$row) {
        $row['medics_details'] = $model->getMedicsByRapport($row['id_rapport']);
    }

    echo json_encode([
        "success" => true,
        "rapports" => $rapports
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "error" => $e->getMessage()
    ]);
}

exit();