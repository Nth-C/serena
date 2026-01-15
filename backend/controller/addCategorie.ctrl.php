<?php
require_once('model/categorieDAO.class.php');
require_once(__DIR__ . '/../app.php');



$app = new App();

try {
    $json = file_get_contents('php://input'); // lit le body du fetch
    $data = json_decode($json, true); // transforme '$json' en tableau

    if (empty($data['name'])) {
        throw new Exception("Données manquantes (name).");
    }

    $model = new CategorieDAO();
    $success = $model->addCategorie($app->id_famille,$data['name'],$data['role']);

    // renvoie a la vue des informations
    echo json_encode([
        "success" => $success,
    ]);

} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}