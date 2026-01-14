<?php
require_once('model/rapportDAO.class.php');
require_once(__DIR__ . '/../app.php');

$app = new App();
$data = json_decode(file_get_contents('php://input'), true);
$id_rapport = $data['id_rapport'];

try {
    $model = new RapportDAO();
    
    $anciensMedics = $model->getMedicsByRapport($id_rapport);
    foreach ($anciensMedics as $old) {
        $model->restockMedic($old['id_medicament'], $old['nombre_medic_conso']);
    }

    $model->clearConso($id_rapport);
-
    $model->updateRapportInfos($id_rapport, $data['nom'], $data['description']);

    if (!empty($data['medicaments'])) {
        foreach ($data['medicaments'] as $med) {
            $model->addMedicToConso($med['id_med'], $id_rapport, $med['quantite']);
            $model->updateMedicStock($med['id_med'], (int)$med['quantite']);
        }
    }

    echo json_encode(["success" => true]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}