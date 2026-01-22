<?php
require_once(__DIR__ . '/../model/famille.class.php'); 
require_once(__DIR__ . '/../model/familleDAO.class.php');
require_once(__DIR__ . '/../app.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();
// vérifie si on est connecter 
if (!$app->connected) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Non connecté']);
    exit;
}
//vérifie le role
if (!$app->checkRole('Famille')) {
    http_response_code(403);
    echo json_encode([
        'success' => false, 
        'error' => 'Accès refusé'
    ]);
    exit; 
}

try {

// récupère les données et filtre les données
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    $id       = $data['id_famille'] ?? null;
    $nom      = filter_var($data['nom_groupe'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS); 
    $desc     = filter_var($data['description'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS); 
    $nom_aide = filter_var($data['nom_aide'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);

    if ($id && $nom && $desc && $nom_aide) {
        $dao = new FamilleDAO();
        // créer une famille
        $famille = new Famille([
            'id_famille' => $id,
            'nom'        => $nom,
            'description'=> $desc,
            'nom_aide'   => $nom_aide
        ]);

        //met a jour la famille avec les nouvelles informations
        if ($dao->update($famille)) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            throw new Exception("Erreur lors de la mise à jour BDD");
        }
    } else {
        http_response_code(400);
        throw new Exception("Données incomplètes");
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false, 
        'error' => $e->getMessage()
    ]);
}

exit();