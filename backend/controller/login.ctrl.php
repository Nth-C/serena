<?php
require_once(__DIR__ . '/../model/SecurityDAO.class.php');

//Partie Securité
$securityDAO = new SecurityDAO();

$ip = $_SERVER['REMOTE_ADDR'];




if ($securityDAO->getNbAttempts($ip) >= 5) {
    echo json_encode(['success' => false, 'message' => 'Trop de tentatives. Réessayez dans 15 min.']);
    exit();
}


require_once(__DIR__ . '/../app.php');
require_once(__DIR__ . '/../model/personneDAO.class.php');

$app = new App(); // Ceci fait session_start() via le constructeur


// Récupération des données React
$json = file_get_contents('php://input');
$data = json_decode($json, true);
$pepper = $_ENV['APP_PEPPER'];

$username = $data['username'] ?? '';
$mdp = $data['mdp'] ?? '';

$dao = new PersonneDAO();
$personne = $dao->findByUsername($username);


// Vérification du mot de passe
if ($personne && password_verify($mdp. $pepper, $personne->mdp)) {
    $securityDAO->clearAttempts($ip);
    $app->login($personne); // Définit $_SESSION['connected'] et $_SESSION['username']
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
    $securityDAO->registerAttempt($ip); // ajout d'une erreur sécurité
    echo json_encode([
        'success' => false, 
        'message' => 'Identifiants incorrects'
    ]);
}
exit();