<?php
require_once(__DIR__ . '/../model/famille.class.php'); 
require_once(__DIR__ . '/../model/familleDAO.class.php');
require_once(__DIR__ . '/../app.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

if (!$app->connected) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Non connecté']);
    exit;
}

try {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    $id       = $data['id_famille'] ?? null;
    $nom      = filter_var($data['nom_groupe'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS); 
    $desc     = filter_var($data['description'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS); 
    $nom_aide = filter_var($data['nom_aide'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);

    if ($id && $nom && $desc && $nom_aide) {
        $dao = new FamilleDAO();
        
        $famille = new Famille([
            'id_famille' => (int)$id,
            'nom'        => $nom,
            'description'=> $desc,
            'nom_aide'   => $nom_aide
        ]);

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