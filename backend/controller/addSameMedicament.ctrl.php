<?php
require_once(__DIR__ . '/../model/medicamentDAO.class.php');
require_once(__DIR__ . '/../app.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

if (!$app->checkRole('Famille')) {
    http_response_code(403);
    echo json_encode([
        'success' => false, 
        'error' => 'Accès refusé.'
    ]);
    exit; 
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$id_medicament = filter_var($data['id_medicament'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);
$stock = filter_var($data['stock'] ?? null, FILTER_VALIDATE_INT);

if (!empty($id_medicament) && $stock !== false && $app->id_famille) {
    $model = new MedicamentDAO();
    
    try {
        // ajoute le médicament pour la famille
        $success = $model->addSameMedecine($app->id_famille, $id_medicament, $stock);
        
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
        "error" => "Données manquantes ou format incorrect"
    ]);
}

exit();