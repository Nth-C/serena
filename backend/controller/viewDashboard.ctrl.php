<?php
require_once(__DIR__ . '/../model/medicamentDAO.class.php');
require_once(__DIR__ . '/../model/trajetDAO.class.php');
require_once(__DIR__ . '/../model/evenementDAO.class.php');
require_once(__DIR__ . '/../app.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

try {
    $id_famille = $app->id_famille; 
    
    if (!$id_famille) {
        echo json_encode([
            "medicaments" => [], 
            "trajets" => [], 
            "taches" => []
        ]);
        exit;
    }
    
    $medicamentDAO = new MedicamentDAO();
    $trajetDAO = new TrajetDAO();
    $evenementDAO = new EvenementDAO();

    // affiche les demandes de trajets 
    $trajets = $trajetDAO->getAllDemandeDeTrajet($id_famille);

    // affiche les médicaments qui ont un stock actuelle inférieur à 10 % du stock total
    $medicaments = $medicamentDAO->getAllMedicamentsUrgent($id_famille);

    // affiche le prochain événement
    $taches = $evenementDAO->getFutureEvenements($id_famille);
    
    echo json_encode([
        "medicaments" => $medicaments ?: [], 
        "trajets" => $trajets ?: [], 
        "taches" => $taches ?: []
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}

exit();