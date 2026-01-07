<?php
require_once(__DIR__ . '/../app.php');
require_once(__DIR__ . '/../model/familleDAO.class.php');

header("Content-Type: application/json");

$app = new App();

// Vérification de sécurité
if (!$app->connected || !$app->personne) {
    echo json_encode(['success' => false, 'error' => 'Non connecté']);
    exit;
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);
$id_famille = isset($data['id_famille']) ? (int)$data['id_famille'] : null;

if ($id_famille) {
    // Vérification que l'utilisateur appartient bien à cette famille
    $dao = new FamilleDAO();
    $mesFamilles = $dao->findByPersonne((int)$app->personne->id);
    
    $autorise = false;
    foreach ($mesFamilles as $f) {
        if ($f->id_famille === $id_famille) { $autorise = true; break; }
    }

    if ($autorise) {
        $app->setFamilleActive($id_famille);
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Accès refusé']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'ID manquant']);
}