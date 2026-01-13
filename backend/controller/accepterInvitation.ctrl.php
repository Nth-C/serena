<?php
require_once(__DIR__ . '/../model/famille.class.php'); 
require_once(__DIR__ . '/../model/familleDAO.class.php');
require_once(__DIR__ . '/../model/personneDAO.class.php');
require_once(__DIR__ . '/../app.php');

$app = new App();

// On vérifie que l'utilisateur est bien connecté via l'objet App
if (!$app->connected || !$app->personne) {
    echo json_encode(['success' => false, 'error' => 'Utilisateur non connecté']);
    exit;
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$username = $data['username'] ?? '';


if($username){
    $daoFamille = new FamilleDAO();
    $daoPersonne = new PersonneDAO();

    $id_personne = $daoFamille->findByUsername($username)->id;
    
    
    // MODIFICATION ICI : On récupère l'ID directement
    $reussi = $daoFamille->inviterPersonneDansFamille($app->id_famille,$id_personne,$app->personne->id);

    if ($reussi) { // Si l'ID est renvoyé (donc supérieur à 0)
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Erreur lors de la création.']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Champs incomplets.']);
}