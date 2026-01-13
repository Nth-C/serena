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

// 2. Lecture et décodage sécurisé du JSON
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// 3. Extraction sécurisée de l'ID
$id_famille = $data['id_famille'] ?? null;

// Si React envoie un objet au lieu d'une string, on extrait l'ID interne
if (is_array($id_famille) && isset($id_famille['id_famille_invitee'])) {
    $id_famille = $id_famille['id_famille_invitee'];
}

if (!empty($id_famille) && is_string($id_famille)) {
    $daoFamille = new FamilleDAO();
    
    try {
        // On passe l'ID de la personne (string) et l'ID de la famille (string)
        $reussi = $daoFamille->RefuserInvitation($app->personne->id, $id_famille);

        if ($reussi) {
            echo json_encode(['success' => true, 'message' => 'Invitation refusée.']);
        } else {
            echo json_encode(['success' => false, 'error' => 'Erreur lors du refus.']);
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Identifiant de famille invalide ou manquant.']);
}