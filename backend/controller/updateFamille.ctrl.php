<?php
require_once(__DIR__ . '/../model/famille.class.php'); 
require_once(__DIR__ . '/../model/familleDAO.class.php');
require_once(__DIR__ . '/../app.php');

$json = file_get_contents('php://input');
$data = json_decode($json, true);

// On récupère l'ID en plus des autres champs
$id       = $data['id_famille'] ?? null;
$nom      = $data['nom_groupe'] ?? ''; 
$desc     = $data['description'] ?? ''; 
$nom_aide = $data['nom_aide'] ?? '';

if($id && $nom && $desc && $nom_aide){
    $dao = new FamilleDAO();
    $famille = new Famille([
        'id_famille' => (int)$id,
        'nom'        => $nom,
        'description'=> $desc,
        'nom_aide'   => $nom_aide
    ]);

    if ($dao->update($famille)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Erreur lors de la mise à jour.']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Données incomplètes.']);
}