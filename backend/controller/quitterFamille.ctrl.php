<?php
require_once(__DIR__ . '/../model/familleDAO.class.php');
require_once(__DIR__ . '/../app.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

if (!$app->connected || !$app->personne) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Authentification requise']);
    exit;
}

try {
    //récupère les infos et filtres les données
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    $id_famille = filter_var($data['id_famille'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);

    if (!empty($id_famille)) {
        $dao = new FamilleDAO();
        // quitte la famille
        $reussi = $dao->QuitterFamille($app->personne->id, $id_famille);

        // enlève id_famille de la session si elle existe
        if ($reussi) {
            if (isset($_SESSION['id_famille']) && $_SESSION['id_famille'] == $id_famille) {
                unset($_SESSION['id_famille']);
            }
            
            echo json_encode([
                'success' => true, 
                'message' => 'Action effectuée avec succès'
            ]);
        } else {
            http_response_code(500);
            echo json_encode([
                'success' => false, 
                'error' => 'Erreur lors du traitement de la demande'
            ]);
        }
    } else {
        http_response_code(400);
        echo json_encode([
            'success' => false, 
            'error' => 'Paramètre manquant'
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'error' => 'Erreur système'
    ]);
}

exit();