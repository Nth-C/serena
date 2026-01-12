<?php
require_once('model/FamilleDAO.class.php');
require_once(__DIR__ . '/../app.php');



$app = new App();

try {
    $json = file_get_contents('php://input'); // lit le body du fetch
    $data = json_decode($json, true); // transforme '$json' en tableau

    if (empty($data['id_personne'])) {
        throw new Exception("ID personne manquant pour la suppression.");
    }

    $model = new FamilleDAO();
    $success = $model->deletePersonneDeFamille($app->id_famille,$data['id_personne']);

    // renvoie a la vue des informations
    echo json_encode([
        "success" => $success, 
    ]);

} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}