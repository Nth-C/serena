<?php

require_once(__DIR__ . '/../model/personneDAO.class.php');

$origin = $_SERVER['HTTP_ORIGIN'] ?? 'http://localhost:5173';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// récupération du token
$json = file_get_contents('php://input');
$data = json_decode($json, true);
$token = $data['token'] ?? $_GET['token'] ?? '';

if (empty($token)) {
    echo json_encode(['success' => false, 'message' => 'Token manquant']);
    exit;
}

$dao = new PersonneDAO();

// activation du compte
if ($dao->activateAccount($token)) {
    echo json_encode(['success' => true, 'message' => 'Compte activé avec succès !']);
} else {
    echo json_encode(['success' => false, 'message' => 'Lien invalide ou compte déjà activé.']);
}
?>