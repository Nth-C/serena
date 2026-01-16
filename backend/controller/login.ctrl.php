<?php
require_once(__DIR__ . '/../model/SecurityDAO.class.php');

//Partie Securité
$securityDAO = new SecurityDAO();

$ip = $_SERVER['REMOTE_ADDR'];




$security = $securityDAO->getSecurityStatus($ip);

if ($security['nb'] >= 6) {
    // Conversion des secondes en minutes pour l'affichage
    $minutes = ceil($security['wait_time'] / 60);
    
    echo json_encode([
        'success' => false, 
        'message' => "Trop de tentatives. Réessayez dans $minutes min.",
        'retry_after' => $security['wait_time'] // Pratique pour le front
    ]);
    exit();
}


require_once(__DIR__ . '/../app.php');
require_once(__DIR__ . '/../model/personneDAO.class.php');

$app = new App(); 


$json = file_get_contents('php://input');
$data = json_decode($json, true);
$pepper = $_ENV['APP_PEPPER'];

$username = $data['username'] ?? '';
if (!$securityDAO->verifierActif($username)) {
    echo json_encode(['success' => false, 'message' => "Ton compte n'est pas activé."]);
    exit();
}
$mdp = $data['mdp'] ?? '';

$dao = new PersonneDAO();
$personne = $dao->findByUsername($username);


if ($personne && password_verify($mdp. $pepper, $personne->mdp)) {
    $securityDAO->clearAttempts($ip);
    $app->login($personne); 
    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $personne->id,
            'username' => $personne->username,
            'nom'=> $personne->nom,
            'prenom' => $personne->prenom
        ]
    ]);
} else {
    $securityDAO->registerAttempt($ip); 
    echo json_encode([
        'success' => false, 
        'message' => 'Identifiants incorrects'
    ]);
}
exit();