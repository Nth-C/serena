<?php
require_once(__DIR__ . '/../model/FamilleDAO.class.php');
require_once(__DIR__ . '/../app.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

if (!$app->checkRole('Createur')) {
    http_response_code(403);
    echo json_encode([
        'success' => false, 
        'error' => 'Droits insuffisants : Seul le créateur peut faire cela.'
    ]);
    exit; 
}

try {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    //filtre les données
    $id_personne = filter_var($data['id_personne'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);

    if (empty($id_personne)) {
        http_response_code(400);
        throw new Exception("ID personne manquant pour la suppression.");
    }

    $model = new FamilleDAO();
    // supprime la personne de la famille
    $success = $model->deletePersonneDeFamille($app->id_famille, $id_personne);

    echo json_encode([
        "success" => $success, 
    ]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}

exit();