<?php
// 1. Charger les dépendances
require_once(__DIR__ . '/../model/personneDAO.class.php');
require_once __DIR__ . '/../vendor/autoload.php'; // Charge PHPMailer

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

// 2. Récupérer les données
$json = file_get_contents('php://input');
$data = json_decode($json, true);
$email = $data['email'] ?? '';

if (empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Email manquant']);
    exit;
}

// 3. Vérifier si l'utilisateur existe en BDD
$dao = new PersonneDAO();
$user = $dao->findByEmail($email);

if ($user) {
    // L'utilisateur existe, on prépare l'envoi du mail
    $mail = new PHPMailer(true);

    try {
        // --- Configuration SMTP (via Docker env) ---
        $mail->isSMTP();
        $mail->Host       = getenv('SMTP_HOST');
        $mail->SMTPAuth   = true;
        $mail->Username   = getenv('SMTP_USER');
        $mail->Password   = getenv('SMTP_PASS');
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = getenv('SMTP_PORT');

        // --- Expéditeur et Destinataire ---
        $mail->setFrom(getenv('SMTP_USER'), 'Support Sere-na');
        $mail->addAddress($email);

        // --- Contenu du mail ---
        $mail->isHTML(true);
        $mail->Subject = 'Reinitialisation de votre mot de passe';
        
        // Lien vers le frontend (React)
        // Attention : localhost:5173 c'est pour tes tests locaux. 
        // En production, ce sera ton vrai domaine.
        $link = "http://localhost:5173/reset-password?email=" . urlencode($email);
        
        $mail->Body    = "Bonjour " . ",<br><br>Vous avez demandé à réinitialiser votre mot de passe.<br>Cliquez ici : <a href='$link'>Réinitialiser mon mot de passe</a>";
        $mail->AltBody = "Copiez ce lien : $link";

        $mail->send();
        
        // Succès
        echo json_encode(['success' => true, 'message' => 'Un email de réinitialisation a été envoyé.']);

    } catch (Exception $e) {
        // Erreur technique d'envoi de mail
        echo json_encode(['success' => false, 'message' => "Erreur lors de l'envoi du mail : " . $mail->ErrorInfo]);
    }

} else {
    // Email inconnu en BDD
    // Note sécurité : En prod, on affiche souvent "Si l'email existe, un lien a été envoyé" pour ne pas révéler qui est inscrit.
    // Mais pour le dev, on reste explicite :
    echo json_encode(['success' => false, 'message' => 'Aucun compte associé à cet email.']);
}
?>