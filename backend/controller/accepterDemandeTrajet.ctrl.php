<?php
require_once('model/trajetDAO.class.php');
require_once(__DIR__ . '/../app.php');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

if (!$app->connected || !$app->personne) {
    echo json_encode(['success' => false, 'error' => 'Utilisateur non connecté']);
    exit;
}
    // 1. Récupération du JSON
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (empty($data['id_trajet'])) {
        throw new Exception("Données manquantes (id_trajet).");
    }

    

    $model = new TrajetDAO();

    // 3. Appel de la méthode
    // On utilise l'opérateur "null coalescing" (??) pour gérer les champs optionnels
    $success = $model->AjouterPersonneAuTrajet($data['id_trajet'],$app->personne->id);

    echo json_encode([
        "success" => $success,
    ]);

