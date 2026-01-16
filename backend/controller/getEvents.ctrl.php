<?php
require_once('model/evenementDAO.class.php');
require_once(__DIR__ . '/../app.php');

header("Access-Control-Allow-Methods: GET, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit; }

$app = new App();

if (!$app->checkRole('Proche')) {
    header('HTTP/1.1 403 Forbidden');
    echo json_encode([
        'success' => false, 
        'message' => 'Erreur : Vous devez avoir au moins le role de Proche pour faire ça.'
    ]);
    exit; 
}

try {
    if (empty($app->id_famille)) {
        throw new Exception("Utilisateur non connecté ou sans famille.");
    }

    $dao = new EvenementDAO();
    $events = $dao->getFutureEvenements($app->id_famille);

    // On prépare un tableau léger pour le select
    $dataExport = [];
    foreach ($events as $ev) {
        $dataExport[] = [
            'id_event' => $ev->id_event, // Assure-toi que ta classe Evenement a cet attribut public ou un getter
            'nom' => $ev->nom, // ou $ev->getNom() selon ta classe
            'date_deb' => $ev->date_deb,
            'date_fin' => $ev->date_fin,
            'lieu' => $ev->lieu
        ];
    }

    echo json_encode(["success" => true, "evenements" => $dataExport]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}