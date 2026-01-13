<?php
require_once(__DIR__ . '/../model/famille.class.php'); 
require_once(__DIR__ . '/../model/familleDAO.class.php');
require_once(__DIR__ . '/../app.php');

$app = new App();

if (!$app->connected || !$app->personne) {
    echo json_encode(['success' => false, 'error' => 'Utilisateur non connecté']);
    exit;
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$nom = $data['nom_groupe'] ?? '';
$desc = $data['description'] ?? '';
$nom_aide = $data['nom_aide'] ?? '';

if($nom && $desc && $nom_aide){
    $dao = new FamilleDAO();

    $famille = new Famille([
        'nom' => $nom,
        'description' => $desc,
        'nom_aide' => $nom_aide
    ]);

    $id_famille = $dao->insert($famille);

    if ($id_famille) { 
        $id_personne = $app->personne->id;
        
        if ($dao->AddPersFam($id_famille, $id_personne, 'createur')) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Liaison échouée.']);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Erreur lors de la création.']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Champs incomplets.']);
}