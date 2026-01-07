<?php
require_once(__DIR__ . '/../model/rapportDAO.class.php');
require_once(__DIR__ . '/../app.php');

header("Content-Type: application/json");

$app = new App();
$model = new RapportDAO();

try {
    // On récupère l'ID qui a été mis en session par selectFamille
    $id_famille = $app->id_famille; 

    if (!$id_famille || $id_famille === 0) {
        // Renvoie une liste vide si aucune famille n'est sélectionnée
        echo json_encode([]);
        exit;
    }

    // Le DAO va chercher uniquement les rapports de cette famille
    $rapports = $model->getAllRapports($id_famille);
    echo json_encode($rapports);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}