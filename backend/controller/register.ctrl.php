<?php
require_once(__DIR__ . '/../model/personneDAO.class.php');
require_once(__DIR__ . '/../app.php');
// CHARGEMENT CONFIG (Mail + Pepper)
$config = require __DIR__ . '/../config.php';
require_once __DIR__ . '/../vendor/autoload.php'; 

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();
$pepper = $config['APP_PEPPER']; // On prend le pepper du fichier config

$nom = filter_input(INPUT_POST, 'nom', FILTER_SANITIZE_SPECIAL_CHARS);
$prenom = filter_input(INPUT_POST, 'prenom', FILTER_SANITIZE_SPECIAL_CHARS);
$mail = filter_input(INPUT_POST, 'mail', FILTER_VALIDATE_EMAIL);
$username = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_SPECIAL_CHARS);
$mdp = $_POST['mdp'] ?? null;
$date_naissance = $_POST['date_naissance'] ?? null;

if ($nom && $prenom && $mail && $username && $mdp && $date_naissance) {

    // Validate date format
    $d = DateTime::createFromFormat('Y-m-d', $date_naissance);
    if (!$d || $d->format('Y-m-d') !== $date_naissance) {
        echo json_encode(['success' => false, 'error' => 'Format de date de naissance invalide. Utilisez YYYY-MM-DD.']);
        exit();
    }
    
    $dao = new PersonneDAO();
    
    if ($dao->findByUsername($username)) {
        echo json_encode(['success' => false, 'error' => 'Ce nom d\'utilisateur est déjà pris.']);
        exit();
    }

    if ($dao->findByEmail($mail)) {
        echo json_encode(['success' => false, 'error' => 'Cette adresse email est déjà utilisée.']);
        exit();
    }
    
    $hashedPassword = password_hash($mdp . $pepper, PASSWORD_DEFAULT);    

    $personne = new Personne([
        'nom' => $nom,
        'prenom' => $prenom,
        'mail' => $mail,
        'username' => $username,
        'mdp' => $hashedPassword,
        'date_naissance' => $date_naissance
    ]);

    // 1. Génération du Token d'activation
    $tokenActivation = bin2hex(random_bytes(32));

    // 2. Insert avec le token
    if ($dao->insert($personne, $tokenActivation)) {
        
        // 3. Envoi du mail
        try {
            $mailObj = new PHPMailer(true);
            $mailObj->isSMTP();
            $mailObj->Host       = $config['SMTP_HOST'];
            $mailObj->SMTPAuth   = true;
            $mailObj->Username   = $config['SMTP_USER'];
            $mailObj->Password   = $config['SMTP_PASS'];
            $mailObj->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mailObj->Port       = $config['SMTP_PORT'];

            $mailObj->setFrom($config['SMTP_USER'], 'Bienvenue sur Sere-na');
            $mailObj->addAddress($mail);

            $mailObj->isHTML(true);
            $mailObj->Subject = 'Activez votre compte Sere-na';
            
            // Lien vers le Frontend React
            $link = "http://localhost:5173/verify-account?token=" . $tokenActivation;
            
            $mailObj->Body = "Bonjour $prenom,<br><br>Votre compte a été créé. Merci de l'activer en cliquant ici : <br><a href='$link'>Activer mon compte</a>";
            $mailObj->AltBody = "Lien d'activation : $link";
            
            $mailObj->send();

            echo json_encode(['success' => true, 'message' => 'Compte créé. Vérifiez vos emails pour l\'activer.']);

        } catch (Exception $e) {
            // Le compte est créé mais le mail a planté
            echo json_encode(['success' => true, 'warning' => 'Compte créé mais erreur d\'envoi email : ' . $mailObj->ErrorInfo]);
        }

    } else {
        echo json_encode(['success' => false, 'error' => 'Erreur lors de l\'enregistrement en base de données.']);
    }
} else {
    $error = 'Veuillez remplir tous les champs.';
    // filter_input returns false for a value that fails validation.
    if ($mail === false) {
        $error = 'Adresse email invalide.';
    }
    echo json_encode(['success' => false, 'error' => $error]);
}
exit();
?>