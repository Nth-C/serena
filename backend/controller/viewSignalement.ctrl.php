<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Gestion du préflight
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    if (!file_exists(__DIR__ . '/../model/signalementDAO.class.php')) {
        throw new Exception("Fichier DAO introuvable");
    }

    require_once(__DIR__ . '/../model/signalementDAO.class.php');
    require_once(__DIR__ . '/../app.php');

    $app = new App();
    $model = new SignalementDAO();

    $id_user = null;
    if (isset($app->personne) && isset($app->personne->id)) {
        $id_user = $app->personne->id;
    } elseif (isset($app->id_pers)) {
        $id_user = $app->id_pers;
    } elseif (isset($_SESSION['user_id'])) {
        $id_user = $_SESSION['user_id'];
    }

    if (!$id_user) {
        http_response_code(401);
        echo json_encode(["error" => "Utilisateur non identifié"]);
        exit;
    }

    $signalements = $model->getAllSignalement($id_user);
    echo json_encode($signalements);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
} catch (Error $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erreur PHP Fatale : " . $e->getMessage()]);
}
?>