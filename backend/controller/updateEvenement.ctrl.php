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
    echo json_encode(['success' => false, 'error' => 'Accès refusé']);
    exit;
}

try {
    // récupère les données et filtre les donnee
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (empty($data['id_event'])) {
        http_response_code(400);
        throw new Exception("ID de l'événement manquant");
    }

    $evDAO = new EvenementDAO();
    $trDAO = new TrajetDAO();

    // met a jour l'évènement avec les nouvelle information
    $successEv = $evDAO->updateEvenement(
        filter_var($data['id_event'], FILTER_SANITIZE_SPECIAL_CHARS),
        filter_var($data['titre'], FILTER_SANITIZE_SPECIAL_CHARS),
        $data['debut'],
        $data['fin'],
        filter_var($data['lieu'], FILTER_SANITIZE_SPECIAL_CHARS),
        filter_var($data['description'], FILTER_SANITIZE_SPECIAL_CHARS)
    );

    // met a jour le trajet si il y en a 1
    if ($successEv && isset($data['trajet'])) {
        $trDAO->updateTrajet(
            $data['id_event'],
            $data['trajet']['date_deb'],
            filter_var($data['trajet']['lieu_dep'], FILTER_SANITIZE_SPECIAL_CHARS),
            filter_var($data['trajet']['lieu_arr'], FILTER_SANITIZE_SPECIAL_CHARS),
            $data['trajet']['societe'] ?? null,  // AJOUTÉ
            $data['trajet']['aidant_id'] ?? null // AJOUTÉ
        );
    }

    echo json_encode(['success' => true]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false, 
        'error' => $e->getMessage()
    ]);
}

exit();