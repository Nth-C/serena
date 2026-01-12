<?php
require_once('model/documentDAO.class.php');
require_once(__DIR__ . '/../app.php');

header("Content-Type: application/json");
$app = new App();

if (!$app->connected || !$app->id_famille) {
    echo json_encode(["success" => false, "error" => "Non autorisé"]);
    exit;
}

try {
    $id_doc = $_GET['id'] ?? $_POST['id'] ?? null;

    if (!$id_doc) {
        throw new Exception("ID manquant pour la suppression.");
    }

    $dao = new DocumentDAO();
    $doc = $dao->getDocumentById($id_doc);

    if ($doc) {
        $filePath = __DIR__ . '/../' . $doc['url'];
        if (file_exists($filePath)) {
            unlink($filePath);
        }

        $success = $dao->deleteDocument($id_doc);
        echo json_encode(["success" => $success]);
    } else {
        throw new Exception("Document introuvable dans la base de données.");
    }
} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);

} catch (Exception $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}