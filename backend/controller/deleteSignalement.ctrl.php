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
    $json = file_get_contents('php://input'); // lit le body du fetch
    $data = json_decode($json, true); // transforme '$json' en tableau

    if (empty($data['id_signalement']) || empty($data['id_pers_signal'])) {
        throw new Exception("ID manquant pour la suppression.");
    }

    $model = new signalementDAO();
    $success = $model->deleteSignalement($data['id_signalement'], $data['id_pers_signal']);

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