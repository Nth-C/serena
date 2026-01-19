<?php
require_once(__DIR__ . '/../model/personneDAO.class.php');
require_once(__DIR__ . '/../app.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

/**
 * Vérification de la session
 */
if (!$app->connected || !$app->personne) {
    http_response_code(401);
    echo json_encode([
        "success" => false, 
        "error" => "Utilisateur non connecté"
    ]);
    exit;
}

try {
    $model = new PersonneDAO();
    
    // Utilisation de l'ID stocké dans l'objet personne de l'App
    $user = $model->findPersonneById($app->personne->id);

    if ($user) {
        // On retourne l'objet utilisateur (le DAO devrait déjà masquer le mot de passe)
        echo json_encode($user);
    } else {
        http_response_code(404);
        echo json_encode([
            "success" => false, 
            "error" => "Profil introuvable"
        ]);
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "error" => "Erreur lors de la récupération du profil : " . $e->getMessage()
    ]);
}

exit();