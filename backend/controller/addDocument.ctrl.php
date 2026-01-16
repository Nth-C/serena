<?php
require_once('model/documentDAO.class.php');
require_once(__DIR__ . '/../app.php');

header("Content-Type: application/json");
$app = new App();

if (!$app->checkRole('Famille')) {
    header('HTTP/1.1 403 Forbidden');
    echo json_encode([
        'success' => false, 
        'message' => 'Erreur : Vous devez avoir au moins le role de famille pour faire ça.'
    ]);
    exit; 
}

if (!$app->connected || !$app->id_famille) {
    echo json_encode(["success" => false, "error" => "Session invalide ou famille non sélectionnée"]);
    exit;
}

try {
    $name = $_POST['name'] ?? null;
    $id_categorie = $_POST['id_categorie'] ?? null;

    if (!$name || !$id_categorie) {
        throw new Exception("Le nom du document et la catégorie sont obligatoires.");
    }

    if (!isset($_FILES['document']) || $_FILES['document']['error'] !== UPLOAD_ERR_OK) {
        throw new Exception("Erreur lors de la réception du fichier.");
    }

    $file = $_FILES['document'];

    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $allowedExtensions = ['jpg', 'jpeg', 'png', 'pdf'];

    if (!in_array($extension, $allowedExtensions)) {
        throw new Exception("Format .$extension non autorisé.");
    }

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);

    $allowedMimes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!in_array($mimeType, $allowedMimes)) {
        throw new Exception("Contenu du fichier invalide.");
    }

    $uploadDir = __DIR__ . '/../uploads/famille_' . $app->id_famille . '/';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $safeFileName = uniqid('doc_', true) . '.' . $extension;
    $targetPath = $uploadDir . $safeFileName;
    $relativeUrl = 'uploads/famille_' . $app->id_famille . '/' . $safeFileName;

    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
        throw new Exception("Échec de l'enregistrement sur le serveur.");
    }

    $model = new DocumentDAO();
    $success = $model->addDocument(
        $app->id_famille, 
        $id_categorie, 
        $name, 
        $relativeUrl,
    );

    echo json_encode(["success" => $success]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}