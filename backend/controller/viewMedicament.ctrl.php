<?php
require_once(__DIR__ . '/../model/medicamentDAO.class.php');
require_once(__DIR__ . '/../app.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

// vérification du rôle (Professionnelle)
if (!$app->checkRole('Professionelle')) {
    http_response_code(403);
    echo json_encode([
        'success' => false, 
        'error' => 'Accès refusé : Droits insuffisants'
    ]);
    exit; 
}

try {
    $id_famille = $app->id_famille; 

    // vérification de la connexion à une famille
    if (!$id_famille || $id_famille === 0) {
        echo json_encode([]);
        exit;
    }
    
    $model = new MedicamentDAO();
    $medicaments = $model->getAllMedicaments($id_famille);
    
    // renvoie un tableau vide si pas de médicament
    echo json_encode($medicaments ?: []);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}

exit();