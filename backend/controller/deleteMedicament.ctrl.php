<?php
require_once('model/medicamentDAO.class.php');
require_once(__DIR__ . '/../app.php');



$app = new App();

if (!$app->checkRole('Famille')) {
    header('HTTP/1.1 403 Forbidden');
    echo json_encode([
        'success' => false, 
        'message' => 'Erreur : Vous devez être un proche de la famille pour faire ça.'
    ]);
    exit; 
}

try {
    $json = file_get_contents('php://input'); // lit le body du fetch
    $data = json_decode($json, true); // transforme '$json' en tableau

    if (empty($data['id'])) {
        throw new Exception("ID manquant pour la suppression.");
    }

    $model = new MedicamentDAO();
    $success = $model->deleteMedecine($app->id_famille,$data['id']);

    // renvoie a la vue des informations
    echo json_encode([
        "success" => $success, 
    ]);

} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}