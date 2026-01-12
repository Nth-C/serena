<?php
require_once('model/personneDAO.class.php');
require_once(__DIR__ . '/../app.php');


header("Content-Type: application/json"); // Précise que tu réponds en JSON

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

try {
    // 1. On essaie de récupérer le texte soit en POST JSON, soit en GET
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    // Si $data['texte'] n'existe pas dans le JSON, on regarde dans l'URL ($_GET)
    $texteRecherche = $data['texte'] ?? $_GET['texte'] ?? '';

    $model = new PersonneDAO();
    
    // On n'exécute la recherche que si le texte n'est pas vide (optionnel mais conseillé)
    $rapports = $model->getAllPersonneWithTexte($texteRecherche);

    echo json_encode($rapports);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}