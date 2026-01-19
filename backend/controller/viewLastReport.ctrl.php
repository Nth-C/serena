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
    
    // Récupère les rapports d'aujourd'hui
    $rapports = $model->getRapportsDuJour($app->id_famille);
    
    // Si aucun aujourd'hui, on récupère le dernier en date pour ne pas laisser la vue vide
    if (empty($rapports)) {
        $rapports = $model->getDernierRapport($app->id_famille);
    }

    // Pour chaque rapport, on injecte le détail des médicaments consommés
    foreach ($rapports as &$row) {
        $row['medics_details'] = $model->getMedicsByRapport($row['id_rapport']) ?: [];
    }

    echo json_encode($rapports ?: []);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}

exit();