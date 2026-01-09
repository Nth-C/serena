<?php
require_once(__DIR__ . '/../model/famille.class.php'); 
require_once(__DIR__ . '/../model/familleDAO.class.php');
require_once(__DIR__ . '/../model/personne.class.php');
require_once(__DIR__ . '/../app.php');

$app = new App(); 

if (!$app->connected || !$app->personne) {
    echo json_encode(['error' => 'Non connecté']);
    exit;
}

try {
    $dao = new FamilleDAO();
    $familles = $dao->findByPersonne((int)$app->personne->id);

    echo json_encode($familles);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}