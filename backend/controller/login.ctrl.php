<?php
require_once(__DIR__ . '/../app.php');
require_once(__DIR__ . '/../model/personneDAO.class.php');

$app = new App(); // Ceci fait session_start() via le constructeur

// Récupération des données React
$json = file_get_contents('php://input');
$data = json_decode($json, true);

$username = $data['username'] ?? '';
$mdp = $data['mdp'] ?? '';

$dao = new PersonneDAO();
$personne = $dao->findByUsername($username);

// Vérification du mot de passe
if ($personne && password_verify($mdp, $personne->mdp)) {
    $app->login($personne); // Définit $_SESSION['connected'] et $_SESSION['username']
    
    echo json_encode([
        'success' => true,
        'user' => [
            'id' => $personne->id,
            'username' => $personne->username
        ]
    ]);
} else {
    echo json_encode([
        'success' => false, 
        'message' => 'Identifiants incorrects'
    ]);
}
exit();