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
        'error' => 'Accès refusé'
    ]);
    exit; 
}

try {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (empty($data['nouveauStock']) || !isset($data['id_medicament'])) {
        http_response_code(400);
        throw new Exception("Données manquantes");
    }

    $id_famille = $app->id_famille;
    $id_medicament = filter_var($data['id_medicament'], FILTER_SANITIZE_SPECIAL_CHARS);
    $nouveauStock = filter_var($data['nouveauStock'], FILTER_SANITIZE_NUMBER_INT);

    $model = new MedicamentDAO();
    $success = $model->updateMedecine($id_famille, $nouveauStock, $id_medicament);

    echo json_encode([
        "success" => $success,
    ]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}

exit();