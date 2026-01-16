<?php
require_once('model/personneDAO.class.php');
require_once(__DIR__ . '/../app.php');

$app = new App();
$model = new PersonneDAO();

if (!$app->connected) {
    echo json_encode(["success" => false, "error" => "Non connecté"]);
    exit;
}

try {
    $success = $model->deleteUser($app->id_personne);

    if ($success) {
        $app->logout();
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => "Erreur lors de la suppression"]);
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}