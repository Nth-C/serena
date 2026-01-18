<?php
require_once(__DIR__ . '/../model/famille.class.php'); 
require_once(__DIR__ . '/../model/familleDAO.class.php');
require_once(__DIR__ . '/../app.php');

$app = new App();

// On vérifie que l'utilisateur est bien connecté via l'objet App
if (!$app->connected || !$app->personne) {
    echo json_encode(['success' => false, 'error' => 'Utilisateur non connecté']);
    exit;
}

if (!$app->checkRole('Famille')) {
    header('HTTP/1.1 403 Forbidden');
    echo json_encode([
        'success' => false, 
        'message' => 'Erreur : Vous devez avoir au moins le role de famille pour faire ça.'
    ]);
    exit; 
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$id_personne = $data['id_personne'] ?? '';


if($id_personne){
    $daoFamille = new FamilleDAO();    
    
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