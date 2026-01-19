<?php
require_once(__DIR__ . '/../model/evenementDAO.class.php');
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
        'error' => 'Accès refusé.'
    ]);
    exit; 
}

try {
    if (empty($app->id_famille)) {
        http_response_code(401);
        throw new Exception("Utilisateur non connecté ou sans famille.");
    }

    $dao = new EvenementDAO();
    $events = $dao->getFutureEvenements($app->id_famille);

    $dataExport = [];
    foreach ($events as $ev) {
        $dataExport[] = [
            'id_event' => $ev->id_event,
            'nom'      => $ev->nom,
            'date_deb' => $ev->date_deb,
            'date_fin' => $ev->date_fin,
            'lieu'     => $ev->lieu
        ];
    }

    echo json_encode([
        "success" => true, 
        "evenements" => $dataExport
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "error" => $e->getMessage()
    ]);
}

exit();