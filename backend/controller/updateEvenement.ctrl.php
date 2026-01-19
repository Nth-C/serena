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
    echo json_encode(['success' => false, 'error' => 'Accès refusé']);
    exit;
}

try {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (empty($data['id_event'])) {
        http_response_code(400);
        throw new Exception("ID de l'événement manquant");
    }

    $evDAO = new EvenementDAO();
    $trDAO = new TrajetDAO();

    $successEv = $evDAO->updateEvenement(
        filter_var($data['id_event'], FILTER_SANITIZE_SPECIAL_CHARS),
        filter_var($data['titre'], FILTER_SANITIZE_SPECIAL_CHARS),
        $data['debut'],
        $data['fin'],
        filter_var($data['lieu'], FILTER_SANITIZE_SPECIAL_CHARS),
        filter_var($data['description'], FILTER_SANITIZE_SPECIAL_CHARS)
    );

    if ($successEv && isset($data['trajet'])) {
        $trDAO->updateTrajet(
            $data['id_event'],
            $data['trajet']['date_deb'],
            $data['trajet']['date_deb'],
            filter_var($data['trajet']['lieu_dep'], FILTER_SANITIZE_SPECIAL_CHARS),
            filter_var($data['trajet']['lieu_arr'], FILTER_SANITIZE_SPECIAL_CHARS),
            filter_var($data['trajet']['societe'], FILTER_SANITIZE_SPECIAL_CHARS)
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