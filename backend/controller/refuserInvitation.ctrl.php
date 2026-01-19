<?php
require_once(__DIR__ . '/../model/familleDAO.class.php');
require_once(__DIR__ . '/../app.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

if (!$app->connected || !$app->personne) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Non connecté']);
    exit;
}

try {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    $id_famille = $data['id_famille'] ?? null;

    if (is_array($id_famille) && isset($id_famille['id_famille_invitee'])) {
        $id_famille = $id_famille['id_famille_invitee'];
    }

    if (!empty($id_famille)) {
        $daoFamille = new FamilleDAO();
        $reussi = $daoFamille->RefuserInvitation($app->personne->id, $id_famille);

        if ($reussi) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Erreur BDD']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'ID manquant']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

exit();