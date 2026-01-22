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
        'error' => 'Accès refusé : droits insuffisants.'
    ]);
    exit; 
}

$id_famille = $app->id_famille;

//récupère les données et filtre
$json = file_get_contents('php://input');
$data = json_decode($json, true);

$name        = filter_var($data['name'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);
$stock       = filter_var($data['stock'] ?? null, FILTER_VALIDATE_INT);
$stockTotal  = filter_var($data['stockTotal'] ?? null, FILTER_VALIDATE_INT);

$idCatalogue = filter_var($data['idCatalogueMedecine'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);



if ($stock === null || $stock === false) {
    $stock = 1;
}
if ($stockTotal === null || $stockTotal === false) {
    $stockTotal = $stock;
}
if (empty($type)) {
    $type = 'Comprimé';
}

if (empty($idCatalogue)) {
    $idCatalogue = null;
}

//vérifie les données et erreur si non disponible
if (!empty($name) && $id_famille) {
    
    $model = new MedicamentDAO();
    
    try {
        $success = $model->addMedecine(
            $id_famille, 
            $name, 
            $stock, 
            $stockTotal, 
            $idCatalogue
        );

        if ($success) {
            http_response_code(201); 
            echo json_encode([
                "success" => true,
                "message" => "Médicament ajouté."
            ]);
        } else {
            http_response_code(400); 
            echo json_encode([
                "success" => false,
                "error" => "Le médicament n'a pas pu être ajouté."
            ]);
        }

    } catch (Exception $e) {
        http_response_code(500);
        error_log($e->getMessage());
        echo json_encode([
            "success" => false, 
            "error" => "Erreur interne du serveur."
        ]);
    }

} else {
    http_response_code(400);
    $errorMsg = empty($name) ? 'Le nom du médicament est obligatoire.' : 'Aucune famille sélectionnée.';
    echo json_encode([
        'success' => false, 
        'error' => $errorMsg
    ]);
}

exit();