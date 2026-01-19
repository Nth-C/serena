<?php
require_once(__DIR__ . '/../model/personneDAO.class.php');
require_once(__DIR__ . '/../app.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

if (!$app->connected || !$app->personne) {
    http_response_code(401);
    echo json_encode(["success" => false, "error" => "Session expirée"]);
    exit;
}

try {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (empty($data)) {
        http_response_code(400);
        throw new Exception("Données manquantes");
    }

    $nom      = filter_var($data['nom'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);
    $prenom   = filter_var($data['prenom'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);
    $mail     = filter_var($data['mail'] ?? '', FILTER_VALIDATE_EMAIL);
    $username = filter_var($data['username'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);
    $date_naiss = $data['date_naissance'] ?? null;

    if (!$mail) {
        throw new Exception("Format d'email invalide");
    }

    $model = new PersonneDAO();
    $success = $model->updateUser(
        $app->personne->id,
        $nom,
        $prenom,
        $mail,
        $username,
        $date_naiss
    );

    echo json_encode(["success" => $success]);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}

exit();