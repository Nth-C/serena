<?php
require_once __DIR__ . '/../vendor/autoload.php'; 

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
    echo json_encode(['success' => false, 'error' => 'Email invalide']);
    exit;
}

$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = getenv('SMTP_HOST');
    $mail->SMTPAuth   = true;
    $mail->Username   = getenv('SMTP_USER');
    $mail->Password   = getenv('SMTP_PASS');
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = getenv('SMTP_PORT');

    $mail->setFrom(getenv('SMTP_USER'), 'Support Sere-na');
    $mail->addAddress($email);

    $mail->isHTML(true);
    $mail->Subject = 'Reinitialisation de votre mot de passe';
    
    // lien du reset password 
    $link = "http://localhost:5173/reset-password?email=" . urlencode($email);
    
    $mail->Body    = "Bonjour,<br>Voici votre lien de réinitialisation : <a href='$link'>Cliquez ici</a>";
    $mail->AltBody = "Lien : $link";

    $mail->send();
    
    echo json_encode(['success' => true]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Erreur lors de l\'envoi']);
}

exit();