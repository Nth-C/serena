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

// filtre les variables
$name = filter_var($data['name'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);
$role = filter_var($data['role'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);

// vérifie si les variables sont la 
if (!empty($name) && !empty($role) && $app->id_famille) {
    $model = new CategorieDAO();
    
    try {
        $success = $model->addCategorie($app->id_famille, $name, $role);
        
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