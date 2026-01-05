<?php
require_once('model/medicamentDAO.class.php');

try {
    $json = file_get_contents('php://input'); // lit le body du fetch
    $data = json_decode($json, true); // transforme '$json' en tableau

    if (empty($data['name']) || !isset($data['stock'])) {
        throw new Exception("Données manquantes (name ou stock).");
    }

    $model = new MedicamentDAO();
    $success = $model->addMedecine($data['name'], $data['stock']);

    // renvoie a la vue des informations
    echo json_encode([
        "success" => $success,
    ]);

} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}