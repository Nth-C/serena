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

try {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    $id = filter_var($data['id'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);

    if (empty($id)) {
        http_response_code(400);
        throw new Exception("ID manquant pour la suppression.");
    }

    $model = new MedicamentDAO();
    $success = $model->deleteMedecine($app->id_famille, $id);

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