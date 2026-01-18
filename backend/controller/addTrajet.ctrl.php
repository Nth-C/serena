<?php
require_once('model/trajetDAO.class.php');
require_once(__DIR__ . '/../app.php');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

if (!$app->checkRole('Proche')) {
    header('HTTP/1.1 403 Forbidden');
    echo json_encode([
        'success' => false, 
        'message' => 'Erreur : Vous devez avoir au moins le role de Proche pour faire ça.'
    ]);
    exit; 
}

    // 1. Récupération du JSON
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    // 2. Vérification des champs obligatoires
    // Note : Selon ton JS, date_deb, lieux et id_event sont le minimum requis
    if (empty($data['lieu_dep']) || empty($data['lieu_arr']) || empty($data['id_event']) || empty($data['date_deb'])) {
        throw new Exception("Données manquantes (lieux, date ou événement lié).");
    }

    $model = new TrajetDAO();

    // 3. Appel de la méthode
    // On utilise l'opérateur "null coalescing" (??) pour gérer les champs optionnels
    $success = $model->addTrajet(
        $data['date_deb'],
        $data['date_fin'] ?? $data['date_deb'], // Si fin vide, on utilise début
        $data['lieu_dep'],
        $data['lieu_arr'],
        $data['id_event'],
        $data['aidant_id'] ?? null, // Peut être null
        $data['societe'] ?? null,    // Peut être null
        $app->id_famille
    );

    echo json_encode([
        "success" => $success,
    ]);

