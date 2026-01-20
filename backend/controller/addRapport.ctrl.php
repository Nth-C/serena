<?php
require_once(__DIR__ . '/../model/rapportDAO.class.php');
require_once(__DIR__ . '/../app.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit; }

$app = new App();

if (!$app->connected || !$app->personne) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Non connecté']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

try {
    if (empty($data['nom']) || empty($data['description'])) {
        throw new Exception("Champs obligatoires manquants.");
    }

    $model = new RapportDAO();
    
    // On appelle la méthode unique qui gère TOUT
    $model->createFullRapport(
        $app->id_famille, 
        $app->personne->id,
        $data['nom'], 
        $data['description'], 
        $data['medicaments'] ?? []
    );

    echo json_encode(["success" => true]);

} catch (Exception $e) {
    // On renvoie l'erreur (ex: "Stock insuffisant") proprement à React
    http_response_code(400); 
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}