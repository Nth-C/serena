<?php
require_once('model/evenementDAO.class.php');
require_once('model/trajetDAO.class.php');
require_once(__DIR__ . '/../app.php');

$app = new App();

if (!$app->checkRole('Proche')) {
    header('HTTP/1.1 403 Forbidden');
    echo json_encode([
        'success' => false, 
        'message' => 'Erreur : Droits insuffisants.'
    ]);
    exit; 
}

try {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    $modelEv = new EvenementDAO();

    $newIdEvent = $modelEv->addEvenement(
        $app->id_famille,
        $data['titre'], 
        $data['debut'], 
        $data['fin'], 
        $data['lieu'], 
        $data['description']
    );

    if ($newIdEvent && !empty($data['accompagnants'])) {
        $modelEv->addAccompagnant($newIdEvent, $data['accompagnants']);
    }

    echo json_encode(["success" => ($newIdEvent !== false)]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}