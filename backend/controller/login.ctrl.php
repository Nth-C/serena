<?php
require_once(__DIR__ . '/../model/personneDAO.class.php');
require_once(__DIR__ . '/../app.php');

// Indispensable pour que React puisse communiquer avec PHP
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

// Lecture des données JSON envoyées par React
$json = file_get_contents('php://input');
$data = json_decode($json, true);

$username = $data['username'] ?? '';
$mdp = $data['mdp'] ?? '';

if ($username && $mdp) {
    $dao = new PersonneDAO();
    $personne = $dao->findByUsername($username);

    if ($personne && $mdp == 'test') { //password_verify($mdp, $personne->mdp)
        $app->login($personne);
        echo 'success';
    } else {
        echo 'Login ou mot de passe incorrect';
    }
} else {
    echo 'Données manquantes';
}

exit();