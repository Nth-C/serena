<?php
require_once(__DIR__ . '/../model/famille.class.php'); 
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

if (!$app->checkRole('Famille')) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Droits insuffisants']);
    exit; 
}

try {

    //recupère les informations
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    $id_personne = filter_var($data['id_personne'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);

    if ($id_personne) {
        $daoFamille = new FamilleDAO();  
        
        // supprime l'inviation dans la famille de la personne
        $reussi = $daoFamille->deleteInviterPersonneDansFamille(
            $app->id_famille,
            $id_personne,
            $app->personne->id
        );

        if ($reussi) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Erreur lors de la suppression']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Champs incomplets']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

exit();