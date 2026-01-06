<?php
require_once(__DIR__ . '/../model/personneDAO.class.php');
require_once(__DIR__ . '/../app.php');

// --- HEADERS CORS (Indispensable pour React) ---
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json'); // On annonce qu'on répond en JSON

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

// Puisque CreateAccount.jsx utilise FormData, on utilise $_POST
$nom = $_POST['nom'] ?? '';
$prenom = $_POST['prenom'] ?? '';
$mail = $_POST['mail'] ?? '';
$username = $_POST['username'] ?? '';
$mdp = $_POST['mdp'] ?? '';
$date_naissance = $_POST['date_naissance'] ?? '';

if ($nom && $prenom && $mail && $username && $mdp && $date_naissance) {
    $dao = new PersonneDAO();
    
    // Vérification si l'utilisateur existe déjà
    if ($dao->findByUsername($username)) {
        echo json_encode(['success' => false, 'error' => 'Ce nom d\'utilisateur est déjà pris.']);
        exit();
    }

    $hashedPassword = password_hash($mdp, PASSWORD_DEFAULT);
    
    // Création de l'objet (Correction : on passe la date en string pour éviter le TypeError)
    $personne = new Personne([
        'nom' => $nom,
        'prenom' => $prenom,
        'mail' => $mail,
        'username' => $username,
        'mdp' => $hashedPassword,
        'date_naissance' => $date_naissance
    ]);

    if ($dao->insert($personne)) {
        // RÉPONSE JSON AU LIEU DE REDIRECTION
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Erreur lors de l\'enregistrement en base de données.']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Veuillez remplir tous les champs.']);
}
exit();