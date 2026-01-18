<?php
require_once('model/evenementDAO.class.php');
require_once('model/trajetDAO.class.php');
require_once(__DIR__ . '/../app.php');

$app = new App();

// Sécurité : Seuls les proches peuvent ajouter des événements
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

    if (!$data) {
        throw new Exception("Données invalides.");
    }

    $modelEv = new EvenementDAO();
    $modelTrajet = new TrajetDAO();
    $db = DAL::get();

    // 1. Insertion de l'événement
    $success = $modelEv->addEvenement(
        $app->id_famille,
        $data['titre'], 
        $data['debut'], 
        $data['fin'], 
        $data['lieu'], 
        $data['description']
    );

    // 2. Si l'événement est créé et qu'un trajet est demandé
    if ($success && !empty($data['besoinTrajet'])) {
        // Récupération de l'ID de l'événement venant d'être créé
        // lastInsertId() fonctionne ici car addEvenement utilise la même instance DAL
        $id_event = $db->prepare("SELECT id_event FROM EVENEMENTS WHERE id_famille = ? ORDER BY id_event DESC LIMIT 1");
        $id_event->execute([$app->id_famille]);
        $row = $id_event->fetch();
        $new_id_event = $row['id_event'];

        // Insertion du trajet
        $modelTrajet->addTrajet(
            $data['trajet']['date_deb'],
            $data['trajet']['date_deb'], // Fin identique au début par défaut
            $data['trajet']['lieu_dep'],
            $data['trajet']['lieu_arr'],
            $new_id_event,
            $data['trajet']['aidant_id'] ?? null,
            $data['trajet']['societe'] ?? null
        );
    }

    echo json_encode(["success" => $success]);

} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}