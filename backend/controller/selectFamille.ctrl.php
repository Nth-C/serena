<?php
require_once(__DIR__ . '/../app.php');
require_once(__DIR__ . '/../model/familleDAO.class.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

if (!$app->connected || !$app->personne) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Non connecté']);
    exit;
}

try {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    $id_famille_selectionne = $data['id_famille'] ?? null;

    if ($id_famille_selectionne !== null && $id_famille_selectionne > 0) {
        $dao = new FamilleDAO();
        $mesFamilles = $dao->findByPersonne($app->personne->id);

        $autorise = false;
        foreach ($mesFamilles as $f) {
            if ($f->id_famille === $id_famille_selectionne) { 
                $autorise = true; 
                break; 
            }
        }

        if ($autorise) {
            $_SESSION['id_famille_active'] = $id_famille_selectionne;
            $app->id_famille = $id_famille_selectionne;

            session_write_close(); 

            echo json_encode([
                'success' => true, 
                'role' => $dao->getRoleInFamily($app->personne->id, $id_famille_selectionne)
            ]);
        } else {
            http_response_code(403);
            echo json_encode(['success' => false, 'error' => 'Accès refusé']);
        }
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'ID manquant']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

exit();