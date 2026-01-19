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
    echo json_encode(['success' => false, 'error' => 'Droits insuffisants']);
    exit; 
}

try {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    $modelEv = new EvenementDAO();
    
    // Extraction des paramètres de récurrence
    $typeRecurrence = $data['recurrence'] ?? 'aucun';
    $nbRecurrence = isset($data['nbRecurrence']) ? (int)$data['nbRecurrence'] : 1;

    // Si aucune récurrence, on force à 1 itération
    if ($typeRecurrence === 'aucun') {
        $nbRecurrence = 1;
    }

    $success = true;
    $currentStart = new DateTime($data['debut']);
    $currentEnd = new DateTime($data['fin']);

    // Définition de l'intervalle selon le type
    $interval = '';
    switch ($typeRecurrence) {
        case 'journalier':   $interval = '+1 day';   break;
        case 'hebdomadaire': $interval = '+1 week';  break;
        case 'mensuel':      $interval = '+1 month'; break;
        case 'annuel':       $interval = '+1 year';  break;
        default:             $interval = '';         break;
    }

    for ($i = 0; $i < $nbRecurrence; $i++) {
        // Insertion de l'événement
        $newIdEvent = $modelEv->addEvenement(
            $app->id_famille,
            filter_var($data['titre'], FILTER_SANITIZE_SPECIAL_CHARS), 
            $currentStart->format('Y-m-d H:i:s'), 
            $currentEnd->format('Y-m-d H:i:s'), 
            filter_var($data['lieu'], FILTER_SANITIZE_SPECIAL_CHARS), 
            filter_var($data['description'], FILTER_SANITIZE_SPECIAL_CHARS)
        );

        if (!$newIdEvent) {
            $success = false;
            break;
        }

        // Ajout de l'accompagnant si renseigné
        if (!empty($data['accompagnants'])) {
            $modelEv->addAccompagnant($newIdEvent, $data['accompagnants']);
        }

        // Préparation de la date pour la prochaine itération
        if ($interval !== '') {
            $currentStart->modify($interval);
            $currentEnd->modify($interval);
        }
    }

    echo json_encode(["success" => $success]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}

exit();