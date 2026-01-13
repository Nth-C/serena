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

// 2. Lecture des données envoyées par React
$json = file_get_contents('php://input');
$data = json_decode($json, true);

$id_famille = $data['id_famille'] ?? '';

if (!empty($id_famille)) {
    $daoFamille = new FamilleDAO();

    // 3. Appel de la méthode transactionnelle
    // $app->personne->id est l'ID de celui qui accepte
    $reussi = $daoFamille->AccepterInvitation($app->personne->id, $id_famille);

    if ($reussi) {
        echo json_encode(['success' => true, 'message' => 'Invitation acceptée avec succès']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Erreur technique lors de l\'acceptation.']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Identifiant de famille manquant.']);
}