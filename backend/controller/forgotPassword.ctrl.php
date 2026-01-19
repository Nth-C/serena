<?php
require_once(__DIR__ . '/../model/personneDAO.class.php');
require_once(__DIR__ . '/../app.php');
require_once __DIR__ . '/../vendor/autoload.php';
$config = require __DIR__ . '/../config.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);
$email = filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL);

if (!$email) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Email invalide ou manquant.']);
    exit;
}

$dao = new PersonneDAO();
$user = $dao->findByEmail($email);

if ($user) {
    try {
        $token = bin2hex(random_bytes(32));
        $expiresAt = date('Y-m-d H:i:s', time() + 3600); 

        $dao->updateResetToken($email, $token, $expiresAt);

        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host       = $config['SMTP_HOST'];
        $mail->SMTPAuth   = true;
        $mail->Username   = $config['SMTP_USER'];
        $mail->Password   = $config['SMTP_PASS'];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = $config['SMTP_PORT'];

        $mail->setFrom($config['SMTP_USER'], 'Support Sere-na');
        $mail->addAddress($email);

        $mail->isHTML(true);
        $mail->Subject = 'Reinitialisation de votre mot de passe';
        
        $link = "http://localhost:5173/reset-password?token=" . $token;
        
        $mail->Body    = "
            <h3>Bonjour,</h3>
            <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
            <p>Cliquez sur le lien ci-dessous (valide 1 heure) :</p>
            <p><a href='$link'>Réinitialiser mon mot de passe</a></p>
            <br>
            <p>Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.</p>
        ";
        
        $mail->AltBody = "Lien de réinitialisation : $link";

        $mail->send();
        
        echo json_encode(['success' => true, 'message' => 'Email de récupération envoyé.']);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => "Erreur lors de l'envoi de l'email."]);
    }
} else {
    // Sécurité : on renvoie success même si l'email n'existe pas pour éviter le "user enumeration"
    echo json_encode(['success' => true, 'message' => 'Si cet email existe, un lien a été envoyé.']);
}

exit();