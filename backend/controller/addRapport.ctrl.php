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

    if (!isset($data['description'])) {
        throw new Exception("La description du rapport est obligatoire.");
    }

    $model = new RapportDAO();
    $success = $model->addRapport(
        $app->id_famille, 
        $app->personne->id, 
        $data['description'],
        $data['nom']
    );

    if ($success) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "Erreur lors de l'insertion en base de données"]);
    }

} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}