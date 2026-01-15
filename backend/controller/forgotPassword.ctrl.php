<?php
// forgotPassword.ctrl.php

// 1. Dépendances et Config
require_once(__DIR__ . '/../model/personneDAO.class.php');
require_once __DIR__ . '/../vendor/autoload.php';
$config = require __DIR__ . '/../config.php'; // Votre fichier config.php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// 2. Récupération des données
$json = file_get_contents('php://input');
$data = json_decode($json, true);
$email = $data['email'] ?? '';

if (empty($email)) {
    echo json_encode(['success' => false, 'message' => 'Email manquant']);
    exit;
}

// 3. Logique métier
$dao = new PersonneDAO();
$user = $dao->findByEmail($email); // Assurez-vous que findByEmail existe dans votre DAO

if ($user) {
    try {
        // A. Génération du Token Sécurisé (32 bytes = 64 caractères hex)
        $token = bin2hex(random_bytes(32));
        
        // B. Expiration : Maintenant + 1 heure
        // PostgreSQL aime le format 'Y-m-d H:i:s'
        $expiresAt = date('Y-m-d H:i:s', time() + 3600); 

        // C. Enregistrement en Base de Données
        $dao->updateResetToken($email, $token, $expiresAt);

        // D. Envoi du Mail
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
        
        // LE LIEN SECURISE
        // On envoie SEULEMENT le token. Pas l'email.
        $link = "http://localhost:5173/reset-password?token=" . $token;
        
        $mail->Body    = "
            <h3>Bonjour,</h3>
            <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
            <p>Cliquez sur le lien ci-dessous (valide 1 heure) :</p>
            <p><a href='$link'>$link</a></p>
            <br>
            <p>Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.</p>
        ";
        
        $mail->AltBody = "Lien de reset : $link";

        $mail->send();
        
        echo json_encode(['success' => true, 'message' => 'Email envoyé.']);

    } catch (Exception $e) {
        // Erreur PHPMailer
        echo json_encode(['success' => false, 'message' => "Erreur Mail : " . $mail->ErrorInfo]);
    } catch (PDOException $e) {
        // Erreur SQL
        die("ERREUR SQL : " . $e->getMessage());
        echo json_encode(['success' => false, 'message' => "Erreur Base de données."]);
    }

} else {
    // Message générique pour ne pas fuiter les emails inscrits
    echo json_encode(['success' => true, 'message' => 'Si cet email existe, un lien a été envoyé.']);
}
?>