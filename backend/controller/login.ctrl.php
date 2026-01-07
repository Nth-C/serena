<?php
require_once(__DIR__ . '/../model/personneDAO.class.php');
require_once(__DIR__ . '/../app.php');

header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();
$json = file_get_contents('php://input');
$data = json_decode($json, true);

$username = $data['username'] ?? '';
$mdp = $data['mdp'] ?? '';

$personne = null;

if ($username && $mdp) {
    $dao = new PersonneDAO();
    $personne = $dao->findByUsername($username);
}

if ($personne && password_verify($mdp, $personne->mdp)) {
    session_unset(); 
    
    $app->login($personne);
    
    echo json_encode([
        'success' => true,
        'user' => [
            'nom' => $personne->nom,
            'prenom' => $personne->prenom,
        ]
    ]);
}else {
    echo json_encode([
        'success' => false,
        'message' => 'Login ou mot de passe incorrect'
    ]);
}
exit();