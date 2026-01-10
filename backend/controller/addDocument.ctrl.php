<?php
require_once('model/documentDAO.class.php');
require_once(__DIR__ . '/../app.php');

header("Content-Type: application/json");

$app = new App();

// Sécurité de base
if (!$app->connected || !$app->id_famille) {
    echo json_encode(["success" => false, "error" => "Session invalide"]);
    exit;
}

try {
    // 1. Récupération des données textuelles via $_POST (et non plus json_decode)
    $name = $_POST['name'] ?? null;
    $id_categorie = $_POST['id_categorie'] ?? null;

    if (!$name || !$id_categorie) {
        throw new Exception("Champs obligatoires manquants.");
    }

    // 2. Vérification du fichier via $_FILES
    if (!isset($_FILES['document']) || $_FILES['document']['error'] !== UPLOAD_ERR_OK) {
        throw new Exception("Erreur lors de la réception du fichier.");
    }

    // 3. Logique de stockage physique
    $uploadDir = __DIR__ . '/../uploads/';
    
    // Créer le dossier s'il n'existe pas
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    $extension = pathinfo($_FILES['document']['name'], PATHINFO_EXTENSION);
    $safeFileName = uniqid('doc_', true) . '.' . $extension; // Nom unique pour éviter les doublons
    $targetPath = $uploadDir . $safeFileName;

    // Déplacement du fichier temporaire vers le dossier final
    if (!move_uploaded_file($_FILES['document']['tmp_name'], $targetPath)) {
        throw new Exception("Impossible d'enregistrer le fichier sur le serveur.");
    }

    // 4. Enregistrement en base de données via le DAO
    $model = new DocumentDAO();
    
    // On passe $safeFileName pour stocker le chemin/nom du fichier réel
    $success = $model->addDocument(
        $app->id_famille, 
        $id_categorie, 
        $name, 
        $safeFileName // On ajoute ce paramètre pour le nom du fichier physique
    );

    echo json_encode(["success" => $success]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}