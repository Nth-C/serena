<?php
require_once(__DIR__ . '/../model/evenementDAO.class.php');
require_once(__DIR__ . '/../app.php');

header("Content-Type: application/json");
$app = new App();

if (!$app->checkRole('Proche')) {
    header('HTTP/1.1 403 Forbidden');
    echo json_encode([
        'success' => false, 
        'message' => 'Erreur : Vous devez avoir au moins le role de Proche pour faire ça.'
    ]);
    exit; 
}

if (!$app->connected || !$app->id_famille) {
    echo json_encode(["success" => false, "error" => "Non autorisé"]);
    exit;
}

try {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    $id_evenement = $data['id_evenement'] ?? $_GET['id_evenement'] ?? null;

    if (!$id_evenement) { 
        throw new Exception("ID manquant pour la suppression.");
    }

    $dao = new EvenementDAO();
    $success = $dao->deleteEvenement($app->id_famille, $id_evenement);

    echo json_encode([
        "success" => $success, 
    ]);
} catch (Exception $e) {
    http_response_code(400); 
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}