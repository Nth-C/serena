<?php
require_once(__DIR__ . '/../model/familleDAO.class.php');
require_once(__DIR__ . '/../app.php');

header("Content-Type: application/json");

$app = new App();

// 1. Vérification de la connexion
if (!$app->connected || !$app->personne) {
    echo json_encode(['success' => false, 'error' => 'Utilisateur non connecté']);
    exit;
}

// 2. Récupération de l'ID famille (soit du corps JSON, soit de la session active)
$json = file_get_contents('php://input');
$data = json_decode($json, true);
$id_famille = $data['id_famille'] ?? '';

if (!empty($id_famille)) {
    $dao = new FamilleDAO();
    
    // 3. Appel de la méthode pour supprimer le lien d'appartenance
    $reussi = $dao->QuitterFamille($app->personne->id, $id_famille);

    if ($reussi) {
        echo json_encode(['success' => true, 'message' => 'Vous avez quitté la famille.']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Erreur lors de la sortie du groupe.']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'ID de famille manquant.']);
}