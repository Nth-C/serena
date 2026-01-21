<?php
require_once(__DIR__ . '/../model/SecurityDAO.class.php');
require_once(__DIR__ . '/../model/personneDAO.class.php');
require_once(__DIR__ . '/../app.php');
$config = require __DIR__ . '/../config.php';
require_once(__DIR__ . '/../csrf.php');


header('Content-Type: application/json');

// Gestion du pré-vol CORS
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$securityDAO = new SecurityDAO();
$ip = $_SERVER['REMOTE_ADDR'];

// 1. Vérification du Brute-force
$security = $securityDAO->getSecurityStatus($ip);

if ($security['nb'] >= 6) {
    $minutes = ceil($security['wait_time'] / 60);
    http_response_code(429); // Too Many Requests
    echo json_encode([
        'success' => false, 
        'message' => "Trop de tentatives. Réessayez dans $minutes min.",
        'retry_after' => $security['wait_time']
    ]);
    exit();
}

$app = new App(); 

// 2. Récupération des données
$json = file_get_contents('php://input');
$data = json_decode($json, true);

$username = filter_var($data['username'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);
$mdp      = $data['mdp'] ?? '';
$pepper   = $config['APP_PEPPER'] ?? '';

if (empty($username) || empty($mdp)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Identifiants requis.']);
    exit();
}

// 3. Vérification du statut du compte
if (!$securityDAO->verifierActif($username)) {
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => "Compte non activé. Vérifiez vos emails."]);
    exit();
}

// 4. Authentification
$dao = new PersonneDAO();
$personne = $dao->findByUsername($username);



if ($personne && password_verify($mdp . $pepper, $personne->mdp)) {
    // Succès : Reset des tentatives et création de session
    $securityDAO->clearAttempts($ip);
    session_regenerate_id(true);
    csrf_generate_token();
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
    // Échec : Enregistrement de la tentative
    $securityDAO->registerAttempt($ip); 
    http_response_code(401);
    echo json_encode([
        'success' => false, 
        'message' => 'Identifiants incorrects'
    ]);
}

exit();