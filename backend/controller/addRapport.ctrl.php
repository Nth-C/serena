<?php
require_once('model/rapportDAO.class.php');
require_once(__DIR__ . '/../app.php');

header("Content-Type: application/json");

$app = new App();

// On vérifie que les UUID sont présents dans la session
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
    
    // On passe les IDs tels quels (en string). Si ce sont des UUID, ils fonctionneront.
    // L'erreur "7" suggère que ton utilisateur de test a l'ID 7 au lieu d'un UUID.
    $success = $model->addRapport(
        $app->id_famille, 
        $app->personne->id, 
        $data['description'],
        $data['nom']
    );

    echo json_encode(["success" => $success]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}