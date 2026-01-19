<?php
require_once(__DIR__ . '/../model/famille.class.php'); 
require_once(__DIR__ . '/../model/familleDAO.class.php');
require_once(__DIR__ . '/../model/personne.class.php');
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
    if (empty($app->id_famille)) {
        http_response_code(400);
        throw new Exception("Aucune famille identifiée.");
    }

    $dao = new FamilleDAO();
    $membres = $dao->getPersFam($app->id_famille);

    echo json_encode([
        "success" => true,
        "membres" => $membres
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "error" => $e->getMessage()
    ]);
}

exit();