<?php
// Si ce fichier est dans "backend/controller", on remonte vers "backend/vendor"
require_once __DIR__ . '/../vendor/autoload.php'; 

// Si ce fichier est à la racine de "backend", utilise juste :
// require_once __DIR__ . '/vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

// 1. Récupération des données JSON
$json = file_get_contents('php://input');
$data = json_decode($json, true);
$email = $data['email'] ?? '';

if (empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Email manquant']);
    exit;
}

// 2. Configuration et Envoi
$mail = new PHPMailer(true);

try {
    // --- Config Serveur (Récupérée du docker-compose) ---
    $mail->isSMTP();
    $mail->Host       = getenv('SMTP_HOST');
    $mail->SMTPAuth   = true;
    $mail->Username   = getenv('SMTP_USER');
    $mail->Password   = getenv('SMTP_PASS');
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = getenv('SMTP_PORT');

    // --- Destinataire ---
    // Mettre une adresse "From" valide (souvent la même que le Username)
    $mail->setFrom(getenv('SMTP_USER'), 'Support Sere-na');
    $mail->addAddress($email);

    // --- Contenu ---
    $mail->isHTML(true);
    $mail->Subject = 'Reinitialisation de votre mot de passe';
    
    // Le lien vers ton Frontend (Port 5173 en dev)
    $link = "http://localhost:5173/reset-password?email=" . urlencode($email);
    
    $mail->Body    = "Bonjour,<br>Voici votre lien de réinitialisation : <a href='$link'>Cliquez ici</a>";
    $mail->AltBody = "Lien : $link";

    $mail->send();
    
    echo json_encode(['success' => true, 'message' => 'Email envoyé']);

} catch (Exception $e) {
    // En prod, on évite d'afficher l'erreur technique précise à l'utilisateur, 
    // mais pour le dev c'est utile :
    echo json_encode(['success' => false, 'message' => "Erreur d'envoi : {$mail->ErrorInfo}"]);
}