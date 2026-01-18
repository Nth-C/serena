<?php
require_once('model/evenementDAO.class.php');
require_once('model/trajetDAO.class.php');
require_once(__DIR__ . '/../app.php');

$app = new App();

// Sécurité : Vérification du rôle
if (!$app->checkRole('Proche')) {
    echo json_encode(['success' => false, 'message' => 'Accès refusé']);
    exit;
}

try {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (empty($data['id_event'])) {
        throw new Exception("ID de l'événement manquant.");
    }

    $evDAO = new EvenementDAO();
    $trDAO = new TrajetDAO();

    // 1. Mise à jour de l'événement
    $successEv = $evDAO->updateEvenement(
        $data['id_event'],
        $data['titre'],
        $data['debut'],
        $data['fin'],
        $data['lieu'],
        $data['description']
    );

    // 2. Mise à jour du trajet (si les infos sont présentes)
    if ($successEv && isset($data['trajet'])) {
        $trDAO->updateTrajet(
            $data['id_event'],
            $data['trajet']['date_deb'],
            $data['trajet']['date_deb'], // fin = début par défaut
            $data['trajet']['lieu_dep'],
            $data['trajet']['lieu_arr'],
            $data['trajet']['societe']
        );
    }

    echo json_encode(['success' => true]);

} catch (Exception $e) {
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}