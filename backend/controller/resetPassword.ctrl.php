<?php
require_once(__DIR__ . '/../model/personneDAO.class.php');
require_once(__DIR__ . '/../app.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

try {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    $email = filter_var($data['email'] ?? '', FILTER_VALIDATE_EMAIL);
    $newMdp = $data['newMdp'] ?? '';
    $pepper = $_ENV['APP_PEPPER'] ?? '';

    if (!$email || empty($newMdp)) {
        http_response_code(400);
        throw new Exception("Champs manquants ou email invalide");
    }

    $hashedMdp = password_hash($newMdp . $pepper, PASSWORD_BCRYPT);

    $dao = new PersonneDAO();
    $result = $dao->updatePasswordByEmail($email, $hashedMdp);

    if ($result) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        throw new Exception("Erreur lors de la mise à jour");
    }
} catch (Exception $e) {
    echo json_encode([
        'success' => false, 
        'error' => $e->getMessage()
    ]);
}

exit();