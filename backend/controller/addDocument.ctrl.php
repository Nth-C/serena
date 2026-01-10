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
    $name = $_POST['name'] ?? null;
    $id_categorie = $_POST['id_categorie'] ?? null;

    if (!$name || !$id_categorie) {
        throw new Exception("Le nom du document et la catégorie sont obligatoires.");
    }

    if (!isset($_FILES['document']) || $_FILES['document']['error'] !== UPLOAD_ERR_OK) {
        throw new Exception("Fichier non reçu ou erreur lors du transfert.");
    }

    $uploadDir = __DIR__ . '/../uploads/famille_' . $app->id_famille . '/';
    
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $extension = pathinfo($_FILES['document']['name'], PATHINFO_EXTENSION);
    $safeFileName = uniqid('doc_', true) . '.' . $extension;
    $targetPath = $uploadDir . $safeFileName;

    if (!move_uploaded_file($_FILES['document']['tmp_name'], $targetPath)) {
        throw new Exception("Impossible d'enregistrer le fichier sur le serveur.");
    }

    $model = new DocumentDAO();
    
    $relativeUrl = 'uploads/famille_' . $app->id_famille . '/' . $safeFileName;

    $success = $model->addDocument(
        $app->id_famille, 
        $id_categorie, 
        $name, 
        $relativeUrl 
    );

    echo json_encode(["success" => $success]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}