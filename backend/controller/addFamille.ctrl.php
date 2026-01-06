<?php
require_once(__DIR__ . '/../model/familleDAO.class.php');
require_once(__DIR__ . '/../app.php');

header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$nom      = $data['nom_groupe'] ?? ''; 
$desc     = $data['description'] ?? ''; 
$nom_aide = $data['nom_aide'] ?? '';

if($nom && $desc && $nom_aide){
    $dao = New FamilleDAO();

    if ($dao->findByName($nom)) {
        echo json_encode(['success' => false, 'error' => 'Ce nom de famille est déjà pris.']);
        exit();
    }

    $famille = new Famille([
        'nom' => $nom,
        'desc' => $desc,
        'nom_aide' => $nom_aide
    ]);

     if ($dao->insert($famille)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Erreur lors de l\'enregistrement en base de données.']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Veuillez remplir tous les champs.']);
}
exit();


?>