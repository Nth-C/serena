<?php
require_once(__DIR__ . '/../model/medicamentDAO.class.php');
require_once(__DIR__ . '/../app.php');




$app = new App();
$model = new MedicamentDAO();

try {
    $id_famille = $app->id_famille; 

    if (!$id_famille || $id_famille === 0) {
        echo json_encode([]);
        exit;
    }
    
    $medicaments = $model->getAllMedicaments($id_famille);
    // echo pour envoyer les données dans la vue
    echo json_encode($medicaments);
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}