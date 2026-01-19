<?php
require_once(__DIR__ . '/../model/personneDAO.class.php');
require_once(__DIR__ . '/../app.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

if (!$app->checkRole('Createur')) {
    http_response_code(403);
    echo json_encode([
        'success' => false, 
        'error' => 'Droits insuffisants : réservé au chef de famille'
    ]);
    exit; 
}

try {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    $texteRecherche = filter_var($data['texte'] ?? $_GET['texte'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);

    $model = new PersonneDAO();
    
    $resultats = $model->getAllPersonneWithTexte(
        $texteRecherche,
        $app->personne->id,
        $app->id_famille
    );

    echo json_encode($resultats);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}

exit();