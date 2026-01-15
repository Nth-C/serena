<?php
require_once('model/categorieDAO.class.php');
require_once(__DIR__ . '/../app.php');



$app = new App();

if (!$app->checkRole('Famille')) {
    header('HTTP/1.1 403 Forbidden');
    echo json_encode([
        'success' => false, 
        'message' => 'Erreur : Vous devez avoir au moins le role de famille pour faire ça.'
    ]);
    exit; 
}

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