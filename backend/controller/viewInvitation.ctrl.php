<?php
require_once('model/familleDAO.class.php');
require_once(__DIR__ . '/../app.php');

// Indispensable pour que React puisse communiquer avec PHP


if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

try {
    $model = new FamilleDAO();
    $invitations = $model->getInvitationDetails($app->personne->id);
    // echo pour envoyer les données dans la vue
    echo json_encode($invitations);
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}