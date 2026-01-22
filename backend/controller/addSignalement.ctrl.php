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
    error_log("DEBUG: addSignalement controller started");
    $app = new App();
    error_log("DEBUG: App initialized");
    
    
    $json = file_get_contents('php://input');
    
    error_log("DEBUG: Raw body received: " . (strlen($json) > 0 ? "YES (" . strlen($json) . " bytes)" : "NO"));
    error_log("DEBUG: Raw JSON: " . substr($json, 0, 200)); 
    
    if (empty($json)) {
        throw new Exception("Corps de la requête vide.");
    }
    
    $data = json_decode($json, true);
    
    error_log("DEBUG: Decoded data: " . json_encode($data));
    
    if ($data === null) {
        throw new Exception("JSON invalide : " . json_last_error_msg());
    }

    if (empty($data['sujet']) || empty($data['message'])) {
        throw new Exception("Données manquantes - sujet: '" . ($data['sujet'] ?? 'absent') . "', message: '" . ($data['message'] ?? 'absent') . "'");
    }

    // 2. Récupérer l'ID utilisateur
    $id_pers = null;
    if (isset($app->personne) && isset($app->personne->id)) {
        $id_pers = $app->personne->id;
    } elseif (isset($_SESSION['user_id'])) {
        $id_pers = $_SESSION['user_id'];
    }

    if (!$id_pers) {
        throw new Exception("Impossible d'ajouter un signalement : Utilisateur non identifié (ID manquant).");
    }

    // Créer le model AVANT d'utiliser getEmail
    $model = new SignalementDAO();
    
    // 3. Récupérer l'Email de l'utilisateur
    $email_user = $model->getEmail($id_pers);
    
    if (!$email_user) {
        throw new Exception("Email de l'utilisateur introuvable.");
    }

    // Appel avec les variables maintenant définies
    $success = $model->addSignalement($data['sujet'], $data['message'], $email_user, $id_pers);

    echo json_encode(["success" => $success]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
} catch (Error $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erreur fatale: " . $e->getMessage()]);
}
?>