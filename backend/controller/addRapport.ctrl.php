<?php
require_once(__DIR__ . '/../model/rapportDAO.class.php');
require_once(__DIR__ . '/../app.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

if (!$app->connected || !$app->personne) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Utilisateur non connecté']);
    exit;
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);

try {
    if (empty($data['nom']) || empty($data['description'])) {
        http_response_code(400);
        throw new Exception("Champs obligatoires manquants.");
    }

    $nom = filter_var($data['nom'], FILTER_SANITIZE_SPECIAL_CHARS);
    $description = filter_var($data['description'], FILTER_SANITIZE_SPECIAL_CHARS);

    $model = new RapportDAO();
    
    $id_rapport = $model->addRapport(
        $app->id_famille, 
        $app->personne->id, 
        $description, 
        $nom
    );

    if (!$id_rapport) {
        http_response_code(500);
        throw new Exception("Erreur création rapport");
    }

    if (!empty($data['medicaments']) && is_array($data['medicaments'])) {
        foreach ($data['medicaments'] as $med) {
            $id_med = filter_var($med['id_med'], FILTER_SANITIZE_SPECIAL_CHARS);
            $quantite = filter_var($med['quantite'], FILTER_VALIDATE_INT);

            if ($id_med && $quantite !== false) {
                $model->addMedicToConso($id_med, $id_rapport, $quantite);
                $model->updateMedicStock($id_med, (int)$quantite);
            }
        }
    }

    echo json_encode(["success" => true]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}

exit();