<?php
require_once(__DIR__ . '/../app.php');

header("Content-Type: application/json");

$app = new App();

try {
    $app->logout();

    echo json_encode([
        "success" => true, 
        "message" => "Déconnexion réussie"
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false, 
        "error" => $e->getMessage()
    ]);
}

exit();