<?php
require_once(__DIR__ . '/../model/medicamentDAO.class.php');
require_once(__DIR__ . '/../model/trajetDAO.class.php');
require_once(__DIR__ . '/../model/evenementDAO.class.php'); // AJOUTÉ
require_once(__DIR__ . '/../app.php');

header("Content-Type: application/json"); 

$app = new App();
$medicamentDAO = new MedicamentDAO();
$trajetDAO = new TrajetDAO();
$evenementDAO = new EvenementDAO(); // AJOUTÉ

try {
    $id_famille = $app->id_famille; 
    if (!$id_famille) {
        echo json_encode(["medicaments" => [], "trajets" => [], "taches" => []]);
        exit;
    }
    
    $trajets = $trajetDAO->getAllDemandeDeTrajet($id_famille);
    $medicaments = $medicamentDAO->getAllMedicamentsUrgent($id_famille);
    $taches = $evenementDAO->getFutureEvenements($id_famille); // AJOUTÉ
    
    // On ajoute la clé "taches" dans la réponse
    echo json_encode([
        "medicaments" => $medicaments, 
        "trajets" => $trajets, 
        "taches" => $taches
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}