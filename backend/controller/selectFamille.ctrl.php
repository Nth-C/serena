<?php
require_once(__DIR__ . '/../app.php');
require_once(__DIR__ . '/../model/familleDAO.class.php');

header("Content-Type: application/json");

$app = new App();

// Sécurité : l'utilisateur doit être connecté
if (!$app->connected || !$app->personne) {
    echo json_encode(['success' => false, 'error' => 'Non connecté']);
    exit;
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);
$id_famille_selectionne = isset($data['id_famille']) ? (int)$data['id_famille'] : null;

if ($id_famille_selectionne !== null && $id_famille_selectionne > 0) {
    $dao = new FamilleDAO();
    // On vérifie que la personne a le droit d'accéder à cette famille
    $mesFamilles = $dao->findByPersonne((int)$app->personne->id);
    
    $autorise = false;
    foreach ($mesFamilles as $f) {
        if ((int)$f->id_famille === $id_famille_selectionne) { 
            $autorise = true; 
            break; 
        }
    }

    if ($autorise) {
        // MISE À JOUR DE LA SESSION
        $_SESSION['id_famille_active'] = $id_famille_selectionne;
        $app->id_famille = $id_famille_selectionne; // On met aussi à jour l'objet courant
        
        // Force l'enregistrement de la session avant de répondre au JS
        session_write_close(); 
        
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Accès refusé à cette famille']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'ID invalide']);
}