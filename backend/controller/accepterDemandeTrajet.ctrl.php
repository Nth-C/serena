<?php
require_once(__DIR__ . '/../model/trajetDAO.class.php');
require_once(__DIR__ . '/../app.php');

// On garde le type de contenu JSON
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

// 1. Vérification de sécurité
if (!$app->connected || !$app->personne) {
    echo json_encode(['success' => false, 'error' => 'Utilisateur non connecté']);
    exit;
}

// 2. Récupération des données JSON
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// 3. Nettoyage des données (on pioche dans $data car c'est du JSON)
// Comme c'est un ID, on peut utiliser SANITIZE_SPECIAL_CHARS ou VALIDATE_INT selon ton type de clé
$id_trajet = filter_var($data['id_trajet'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);

// 4. Validation et Insertion
if ($id_trajet) {
    $model = new TrajetDAO();
    
    try {
        // On utilise l'ID de la personne connectée via l'objet App
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