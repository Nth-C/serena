<?php
// controller/verifyAccount.ctrl.php

require_once(__DIR__ . '/../model/personneDAO.class.php');

// Headers CORS
$origin = $_SERVER['HTTP_ORIGIN'] ?? 'http://localhost:5173';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Récupération du token
$json = file_get_contents('php://input');
$data = json_decode($json, true);
// On regarde dans le JSON ou dans l'URL ($_GET)
$token = $data['token'] ?? $_GET['token'] ?? '';

if (empty($token)) {
    echo json_encode(['success' => false, 'message' => 'Token manquant']);
    exit;
}

$dao = new PersonneDAO();

// Appel de la méthode d'activation (et PAS insert)
if ($dao->activateAccount($token)) {
    echo json_encode(['success' => true, 'message' => 'Compte activé avec succès !']);
} else {
    echo json_encode(['success' => false, 'message' => 'Lien invalide ou compte déjà activé.']);
}
?>