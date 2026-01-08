<?php
require_once('model/documentDAO.class.php');
require_once(__DIR__ . '/../app.php');



$app = new App();

try {
    $json = file_get_contents('php://input'); // lit le body du fetch
    $data = json_decode($json, true); // transforme '$json' en tableau

    if (empty($data['name']) || !isset($data['id_categorie'])) {
        throw new Exception("Données manquantes (name ou id_categorie).");
    }

    $model = new DocumentDAO();
    $success = $model->addDocument($app->id_famille,$data['id_categorie'],$data['name']);

    // renvoie a la vue des informations
    echo json_encode([
        "success" => $success,
    ]);

} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}