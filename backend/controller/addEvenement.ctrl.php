<?php
require_once(__DIR__ . '/../model/evenementDAO.class.php');
require_once(__DIR__ . '/../model/trajetDAO.class.php');
require_once(__DIR__ . '/../app.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

if (!$app->checkRole('Proche')) {
    http_response_code(403);
    echo json_encode([
        'success' => false, 
        'error' => 'Droits insuffisants.'
    ]);
    exit; 
}

try {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    $modelEv = new EvenementDAO();

    $newIdEvent = $modelEv->addEvenement(
        $app->id_famille,
        $titre, 
        $debut, 
        $fin, 
        $lieu, 
        $description
    );

    if ($newIdEvent && !empty($data['accompagnants'])) {
        $modelEv->addAccompagnant($newIdEvent, $data['accompagnants']);
    }

    echo json_encode(["success" => ($newIdEvent !== false)]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
