<?php
require_once(__DIR__ . '/../model/medicamentDAO.class.php');
require_once(__DIR__ . '/../model/trajetDAO.class.php');
require_once(__DIR__ . '/../app.php');

// Indispensable pour que le fetch React comprenne le format
header("Content-Type: application/json"); 

$app = new App();
$medicamentDAO = new MedicamentDAO();
$trajetDAO = new TrajetDAO();

try {
    $id_famille = $app->id_famille; 

    if (!$id_famille) {
        echo json_encode(["medicaments" => [], "trajets" => []]);
        exit;
    }
    
    $trajets = $trajetDAO->getAllDemandeDeTrajet($id_famille);
    $medicaments = $medicamentDAO->getAllMedicamentsUrgent($id_famille);
    
    // On envoie bien sous la clé "medicaments"
    echo json_encode(["medicaments" => $medicaments, "trajets" => $trajets]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}