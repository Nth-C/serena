<?php
session_start(); // Important pour accéder à l'utilisateur connecté
require_once(__DIR__ . '/../model/famille.class.php'); 
require_once(__DIR__ . '/../model/familleDAO.class.php');
require_once(__DIR__ . '/../app.php');

// On vérifie si l'utilisateur est connecté
$user = $_SESSION['user'] ?? null; 

if (!$user) {
    echo json_encode(['error' => 'Non connecté']);
    exit;
}

try {
    $dao = new FamilleDAO();
    $familles = $dao->findByPersonne((int)$user['id_personne']);

    echo json_encode($familles);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}