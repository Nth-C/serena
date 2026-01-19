<?php
require_once(__DIR__ . '/../model/categorieDAO.class.php');
require_once(__DIR__ . '/../model/documentDAO.class.php');
require_once(__DIR__ . '/../app.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

// Sécurité : Vérification du rôle et de la session
if (!$app->connected || !$app->id_famille) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Session expirée']);
    exit;
}

if (!$app->checkRole('Famille')) {
    http_response_code(403);
    echo json_encode(['success' => false, 'error' => 'Accès refusé']);
    exit; 
}

try {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    $id_cat = filter_var($data['id_cat'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);

    if (empty($id_cat)) {
        http_response_code(400);
        throw new Exception("ID de catégorie manquant");
    }

    $categorieDao = new CategorieDAO();
    $documentDao = new DocumentDAO();

    // 1. Récupérer tous les documents de la catégorie pour supprimer les fichiers physiques
    $documents = $documentDao->getDocumentsDeIdCategorie($app->id_famille, $id_cat);

    foreach ($documents as $doc) {
        // Suppression du fichier sur le disque
        // On suppose que l'URL stockée est relative (ex: uploads/famille_X/doc.pdf)
        $filePath = __DIR__ . '/../' . $doc->url; 
        if (file_exists($filePath) && is_file($filePath)) {
            unlink($filePath);
        }

        // Suppression de l'entrée en BDD
        // Note : Vérifie si ta propriété est id_document ou id_doc
        $idDoc = $doc->id_document ?? $doc->id_doc ?? null;
        if ($idDoc) {
            $documentDao->deleteDocument($idDoc);
        }
    }

    // 2. Supprimer la catégorie elle-même
    $success = $categorieDao->deleteCategorie($app->id_famille, $id_cat);

    echo json_encode(["success" => $success]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}

exit();