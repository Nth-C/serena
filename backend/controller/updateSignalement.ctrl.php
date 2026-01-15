<?php
$origin = $_SERVER['HTTP_ORIGIN'] ?? 'http://localhost:5173';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Gestion du préflight
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once(__DIR__ . '/../model/signalementDAO.class.php');
require_once(__DIR__ . '/../app.php');

try {
    $app = new App();
    $model = new signalementDAO();
    $json = file_get_contents('php://input'); // lit le body du fetch
    $data = json_decode($json, true); // transforme '$json' en tableau

    if (empty($data['status']) || empty($data['id_signalement'])) {
        throw new Exception("Données manquantes (status ou id_signalement).");
    }

    $success = $model->updateSignalement($data['id_signalement'], $app->id_pers, $data['status']);
    // renvoie a la vue des informations
    echo json_encode([
        "success" => $success,
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
} catch (Error $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erreur fatale: " . $e->getMessage()]);
}
?>