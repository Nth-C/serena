<?php
require_once(__DIR__ . '/../app.php');
require_once(__DIR__ . '/../model/familleDAO.class.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

if (!$app->connected || !$app->personne) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Non connecté']);
    exit;
}

if (!$app->checkRole('Famille')) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Droits insuffisants']);
    exit; 
}

try {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    $id_personne_a_modifier = $data['idPersonne'] ?? null;
    $nouveau_role = $data['nouveauRole'] ?? null;
    $id_famille_actuelle = $app->id_famille;

    if ($nouveau_role === "Famille" && !$app->checkRole('Createur')) {
        http_response_code(403);
        throw new Exception("Seul le créateur peut attribuer le rôle Famille");
    }

    if ($id_personne_a_modifier == $app->personne->id) {
        http_response_code(400);
        throw new Exception("Vous ne pouvez pas modifier votre propre rôle");
    }

    if ($id_personne_a_modifier && $nouveau_role && $id_famille_actuelle) {
        $dao = new FamilleDAO();
        $success = $dao->UpdateRolePersFam($id_famille_actuelle, $id_personne_a_modifier, $nouveau_role);

        echo json_encode(['success' => $success]);
    } else {
        http_response_code(400);
        throw new Exception("Données incomplètes");
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

exit();