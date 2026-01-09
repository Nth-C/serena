<?php
require_once('model/rapportDAO.class.php');
require_once(__DIR__ . '/../app.php');

// On laisse index.php gérer les headers globaux, mais on s'assure 
// de ne pas renvoyer de headers contradictoires ici.

$app = new App();

try {
    // 1. Vérification de sécurité : l'utilisateur doit être connecté et une famille active
    if (!$app->connected || $app->id_famille <= 0) {
        throw new Exception("Session expirée ou aucune famille sélectionnée.");
    }

    $json = file_get_contents('php://input'); 
    $data = json_decode($json, true); 

    if (!isset($data['id']) || empty($data['id'])) {
        throw new Exception("ID du rapport manquant pour la suppression.");
    }

    $id_rapport = $data['id'];
    $model = new RapportDAO();

    // 2. Utilisation de la suppression sécurisée par ID de famille
    // Cela empêche un utilisateur de supprimer le rapport d'une autre famille
    $success = $model->deleteRapport($id_rapport,$app->id_famille);

    echo json_encode([
        "success" => $success, 
    ]);

} catch (Exception $e) {
    // Renvoi d'un code erreur HTTP pour que le front puisse réagir
    http_response_code(400);
    echo json_encode(["error" => $e->getMessage()]);
}