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
    $dao = new FamilleDAO();
    // récupère les famille de la personne
    $familles = $dao->findByPersonne($app->personne->id);

    echo json_encode($familles);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

exit();