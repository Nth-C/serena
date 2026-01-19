<?php
require_once(__DIR__ . '/../model/trajetDAO.class.php');
require_once(__DIR__ . '/../app.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

if (!$app->checkRole('Proche')) {
    http_response_code(403);
    echo json_encode([
        'success' => false, 
        'error' => 'Accès refusé.'
    ]);
    exit; 
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$lieu_dep = filter_var($data['lieu_dep'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);
$lieu_arr = filter_var($data['lieu_arr'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);
$id_event = filter_var($data['id_event'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);
$date_deb = $data['date_deb'] ?? null;
$date_fin = $data['date_fin'] ?? $date_deb;
$societe  = filter_var($data['societe'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);
$aidant_id = $data['aidant_id'] ?? null;

if (!empty($lieu_dep) && !empty($lieu_arr) && !empty($id_event) && !empty($date_deb) && $app->id_famille) {
    $model = new TrajetDAO();
    
    try {
        $success = $model->addTrajet(
            $date_deb,
            $date_fin,
            $lieu_dep,
            $lieu_arr,
            $id_event,
            $aidant_id,
            $societe,
            $app->id_famille
        );

        echo json_encode([
            "success" => $success
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "error" => $e->getMessage()
        ]);
    }
} else {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "error" => "Données manquantes"
    ]);
}

exit();