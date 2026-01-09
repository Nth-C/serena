<?php
require_once('model/medicamentDAO.class.php');
require_once(__DIR__ . '/../app.php');



if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();
$model = new MedicamentDAO();
try {
    $id_famille = $app->id_famille;
    $json = file_get_contents('php://input'); // lit le body du fetch
    $data = json_decode($json, true); // transforme '$json' en tableau

    if (empty($data['name']) || !isset($data['stock'])) {
        throw new Exception("Données manquantes (name ou stock).");
    }
    
    $success = $model->addMedecine($id_famille,$data['name'], $data['stock'], $data['stockTotal'], $data['idCatalogueMedecine']);

    // renvoie a la vue des informations
    echo json_encode([
        "success" => $success,
    ]);

} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}