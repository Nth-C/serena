<?php
require_once(__DIR__ . '/../model/categorieDAO.class.php');
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

$id = filter_var($data['id'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);

if (!empty($id) && $app->id_famille) {
    $model = new CategorieDAO();
    
    try {
        $success = $model->deleteCategorie($app->id_famille, $id);
        
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
        "error" => "ID manquant pour la suppression"
    ]);
}

exit();