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
        'error' => 'Accès refusé'
    ]);
    exit; 
}

try {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (empty($data['name']) || !isset($data['id_categorie'])) {
        http_response_code(400);
        throw new Exception("Données manquantes");
    }

    $id_categorie = filter_var($data['id_categorie'], FILTER_SANITIZE_SPECIAL_CHARS);
    $name = filter_var($data['name'], FILTER_SANITIZE_SPECIAL_CHARS);
    $role = filter_var($data['role'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);

    $model = new CategorieDAO();
    $success = $model->updateCategorie($id_categorie, $name, $role);
    
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