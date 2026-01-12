<?php
require_once('model/evenementDAO.class.php');
require_once(__DIR__ . '/../app.php');

/*
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { exit; }

$app = new App();

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
            'date_deb' => $ev->date_deb
        ];
    }

    echo json_encode(["success" => true, "evenements" => $dataExport]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}