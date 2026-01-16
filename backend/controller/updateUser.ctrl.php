<?php
require_once('model/personneDAO.class.php');
require_once(__DIR__ . '/../app.php');

$app = new App();
$model = new PersonneDAO();

if (!$app->connected) {
    echo json_encode(["success" => false, "error" => "Session expirée"]);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if ($data) {
    $success = $model->updateUser(
        $app->id_personne,
        $data['nom'],
        $data['prenom'],
        $data['mail'],
        $data['username'],
        $data['date_naissance']
    );

    echo json_encode(["success" => $success]);
} else {
    echo json_encode(["success" => false, "error" => "Données invalides"]);
}
?>