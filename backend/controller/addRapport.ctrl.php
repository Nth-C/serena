<?php
require_once('model/rapportDAO.class.php');
require_once(__DIR__ . '/../app.php');

header("Content-Type: application/json");

$app = new App();

if (!$app->connected || !$app->id_famille) {
    echo json_encode(["success" => false, "error" => "Session invalide ou famille non sélectionnée"]);
    exit;
}

try {
    $json = file_get_contents('php://input'); 
    $data = json_decode($json, true); 

    if (empty($data['description']) || empty($data['nom'])) {
        throw new Exception("Le nom et la description sont obligatoires.");
    }

    $model = new RapportDAO();
    
    $success = $model->addRapport(
        $app->id_famille, 
        $app->personne->id, 
        $data['description'],
        $data['nom']
    );

    if (!$id_rapport) {
        throw new Exception("Erreur lors de la création du rapport.");
    }

    if (!empty($data['medicaments']) && is_array($data['medicaments'])) {
        foreach ($data['medicaments'] as $med) {
            $model->addMedicRapport(
                $med['id_med'], 
                $id_rapport, 
                $med['quantite']
            );
        }
    }

    echo json_encode(["success" => true, "id_rapport" => $id_rapport]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}