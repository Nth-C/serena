<?php
require_once(__DIR__ . '/../model/famille.class.php'); 
require_once(__DIR__ . '/../model/familleDAO.class.php');
require_once(__DIR__ . '/../app.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

if (!$app->connected || !$app->personne) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Utilisateur non connecté']);
    exit;
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$nom = filter_var($data['nom_groupe'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);
$desc = filter_var($data['description'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);
$nom_aide = filter_var($data['nom_aide'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);

if ($nom && $desc && $nom_aide) {
    $dao = new FamilleDAO();

    $famille = new Famille([
        'nom' => $nom,
        'description' => $desc,
        'nom_aide' => $nom_aide
    ]);

    try {
        $id_famille = $dao->insert($famille);

        if ($id_famille) { 
            $id_personne = $app->personne->id;
            
            if ($dao->AddPersFam($id_famille, $id_personne, 'Createur')) {
                echo json_encode(['success' => true]);
            } else {
                http_response_code(500);
                echo json_encode(['success' => false, 'error' => 'Liaison échouée.']);
            }
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Erreur lors de la création.']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Champs incomplets.']);
}

exit();