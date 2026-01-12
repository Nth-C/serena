<?php
require_once(__DIR__ . '/../model/personneDAO.class.php');

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$email = $data['email'] ?? '';
$newMdp = $data['newMdp'] ?? '';
$pepper = $_ENV['APP_PEPPER']; // Important : le même poivre que pour le Login !

if (empty($email) || empty($newMdp)) {
    echo json_encode(['success' => false, 'message' => 'Champs manquants']);
    exit();
}

// Hachage du nouveau mot de passe (Même méthode que Register)
$hashedMdp = password_hash($newMdp . $pepper, PASSWORD_BCRYPT);

$dao = new PersonneDAO();
// On met à jour
$result = $dao->updatePasswordByEmail($email, $hashedMdp);

if ($result) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Erreur SQL ou Email inconnu']);
}