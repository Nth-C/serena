<?php
require_once(__DIR__ . '/../model/personneDAO.class.php');

$json = file_get_contents('php://input');
$data = json_decode($json, true);
$email = $data['email'] ?? '';

$dao = new PersonneDAO();
$user = $dao->findByEmail($email);

if ($user) {
    // ICI : Code pour envoyer un vrai mail via mail() ou PHPMailer.
    // Pour l'instant, on renvoie juste succès.
    
    // Exemple basique (ne marche souvent pas en local sans config SMTP)
    $to = $email;
    $subject = "Réinitialisation de mot de passe";
    $message = "Cliquez ici : http://localhost:5173/reset_password?email=" . urlencode($email);
    // mail($to, $subject, $message); 

    echo json_encode(['success' => true, 'message' => 'Email envoyé (simulé)']);
} else {
    // Par sécurité, on dit souvent "Si l'email existe, on a envoyé..." 
    // mais pour le dev on peut dire "Email inconnu"
    echo json_encode(['success' => false, 'message' => 'Email introuvable']);
}