<?php
require_once('model/medicamentDAO.class.php');

try {
    $model = new MedicamentDAO();
    $medicaments = $model->getAllMedicaments();
    // echo pour envoyer les données dans la vue
    echo json_encode($medicaments);
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}