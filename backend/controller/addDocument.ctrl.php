<?php
require_once('model/documentDAO.class.php');
require_once(__DIR__ . '/../app.php');

header("Content-Type: application/json");

$app = new App();

if (!$app->connected || !$app->id_famille) {
    echo json_encode(["success" => false, "error" => "Session invalide ou famille non sélectionnée"]);
    exit;
}

try {
    if (!isset($_FILES['document'])) throw new Exception("Fichier manquant.");

    $file = $_FILES['document'];
    
    $allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf'];
    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

    if (!in_array($extension, $allowedExtensions)) {
        throw new Exception("Format de fichier non autorisé (Seuls JPG, PNG et PDF sont acceptés).");
    }

    $allowedMimes = ['image/jpeg', 'image/png', 'application/pdf'];
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);

    if (!in_array($mimeType, $allowedMimes)) {
        throw new Exception("Le contenu du fichier est invalide.");
    }

} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
    exit;
}