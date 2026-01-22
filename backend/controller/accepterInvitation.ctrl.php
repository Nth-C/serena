<?php
require_once(__DIR__ . '/../model/familleDAO.class.php');
require_once(__DIR__ . '/../app.php');

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

if (!$app->connected || !$app->personne) {
    echo json_encode(['success' => false, 'error' => 'Utilisateur non connecté']);
    exit;
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$id_famille = filter_var($data['id_famille'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);

// vérifie si il y a bien un id_famille
if (!empty($id_famille)) {
    $daoFamille = new FamilleDAO();
    
    try {
        // accepte l'invitation
        $reussi = $daoFamille->AccepterInvitation($app->personne->id, $id_famille);

        if ($reussi) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Erreur lors de l\'acceptation']);
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Données manquantes']);
}

exit();