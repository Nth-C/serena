<?php
require_once(__DIR__ . '/../model/evenementDAO.class.php');
require_once(__DIR__ . '/../model/trajetDAO.class.php');
require_once(__DIR__ . '/../app.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

// vérifie le role
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

    $daoEvent = new EvenementDAO();
    $daoTrajet = new TrajetDAO();
    //récupère les prochains évènements
    $events = $daoEvent->getFutureEvenements($app->id_famille);

    $dataExport = [];
    foreach ($events as $ev) {
        // Récupérer l'accompagnant de cet événement
        $accompantsData = $daoEvent->getAccompagnants($ev->id_event);
        $accompagnant = null;
        if (!empty($accompantsData)) {
            $accompagnant = $accompantsData[0]; 
        }

        // Récupérer les trajets liés à cet événement
        $trajets = $daoTrajet->getTrajetsParEvent($ev->id_event);

        $dataExport[] = [
            'id_event' => $ev->id_event,
            'nom'      => $ev->nom,
            'date_deb' => $ev->date_deb,
            'date_fin' => $ev->date_fin,
            'lieu'     => $ev->lieu,
            'description' => $ev->note,
            'id_recurrence' => $ev->id_recurrence,
            'accompagnant' => $accompagnant,
            'trajets' => $trajets,
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