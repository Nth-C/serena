<?php
require_once(__DIR__ . '/../model/rapportDAO.class.php');
require_once(__DIR__ . '/../app.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

if (!$app->connected || !$app->id_famille) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Non connecté']);
    exit;
}

try {
    // récupère les informations et filtre les données 
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    $id_rapport = $data['id_rapport'] ?? null;

    if (!$id_rapport) {
        http_response_code(400);
        throw new Exception("ID du rapport manquant");
    }

    $model = new RapportDAO();
    // récupère les medicaments d'un rapport 
    $anciensMedics = $model->getMedicsByRapport($id_rapport);
    foreach ($anciensMedics as $old) {
        // change les medicaments qui sont pris par rappport a l'update
        $model->restockMedic($old['id_medicament'], $old['quantite']);
    }

    // change la consommation dans la table pour savoir combien de medicament est consommé dans le rapport
    $model->clearConso($id_rapport);

    // met a jour info rapport
    $model->updateRapportInfos(
        $id_rapport, 
        filter_var($data['nom'], FILTER_SANITIZE_SPECIAL_CHARS), 
        filter_var($data['description'], FILTER_SANITIZE_SPECIAL_CHARS)
    );

    if (!empty($data['medicaments'])) {
        foreach ($data['medicaments'] as $med) {
            // ajoute les nouveau possibles medicaments
            $model->addMedicToConso($med['id_med'], $id_rapport, $med['quantite']);
            $model->updateMedicStock($med['id_med'], (int)$med['quantite']);
        }
    }

    echo json_encode(["success" => true]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}

exit();