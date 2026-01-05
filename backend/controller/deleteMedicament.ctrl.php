<?php
require_once('model/medicamentDAO.class.php');

try {
    $json = file_get_contents('php://input'); // lit le body du fetch
    $data = json_decode($json, true); // transforme '$json' en tableau

    if (empty($data['id'])) {
        throw new Exception("ID manquant pour la suppression.");
    }

    $model = new MedicamentDAO();
    $success = $model->deleteMedecine($data['id']);

    // renvoie a la vue des informations
    echo json_encode([
        "success" => $success, 
    ]);

} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}