<?php
require_once(__DIR__ . '/../model/medicamentDAO.class.php');
require_once(__DIR__ . '/../app.php');




$model = new MedicamentDAO();

try {

    $json = file_get_contents('php://input'); // lit le body du fetch
    $data = json_decode($json, true); // transforme '$json' en tableau

    if (empty($data['texteNomMedicament'])) {
        throw new Exception("Données manquantes (texteNomMedicament).");
    }

    
    $medicaments = $model->searchNomMedicament($data['texteNomMedicament']);
    // echo pour envoyer les données dans la vue
    echo json_encode($medicaments);
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}