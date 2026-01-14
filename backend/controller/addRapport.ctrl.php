<?php
require_once('model/rapportDAO.class.php');
require_once(__DIR__ . '/../app.php');

$app = new App();
$data = json_decode(file_get_contents('php://input'), true);

try {
    $model = new RapportDAO();
    
    $id_rapport = $model->addRapport(
        $app->id_famille, 
        $app->personne->id, 
        $data['description'], 
        $data['nom']
    );

    if (!$id_rapport) {
        throw new Exception("Erreur création rapport");
    }

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