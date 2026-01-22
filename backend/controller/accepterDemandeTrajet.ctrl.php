<?php
require_once(__DIR__ . '/../model/trajetDAO.class.php');
require_once(__DIR__ . '/../app.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

if (!$app->connected || !$app->personne) {
    echo json_encode(['success' => false, 'error' => 'Utilisateur non connecté']);
    exit;
}

$json = file_get_contents('php://input');
$data = json_decode($json, true);


$id_trajet = filter_var($data['id_trajet'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);

// vérifie si il y a bien un id_trajet
if ($id_trajet) {
    $model = new TrajetDAO();
    
    try {
        $success = $model->AjouterPersonneAuTrajet($id_trajet, $app->personne->id);

        echo json_encode([
            "success" => $success,
            "message" => $success ? "Inscription au trajet réussie" : "Erreur lors de l'inscription"
        ]);
    } catch (Exception $e) {
        echo json_encode([
            "success" => false,
            "error" => "Erreur serveur : " . $e->getMessage()
        ]);
    }

} else {
    echo json_encode([
        "success" => false,
        "error" => "Identifiant de trajet manquant."
    ]);
}

exit();