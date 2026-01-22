<?php
require_once(__DIR__ . '/../model/categorieDAO.class.php');
require_once(__DIR__ . '/../model/documentDAO.class.php');
require_once(__DIR__ . '/../app.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

if (!$app->connected || !$app->id_famille) {
    http_response_code(401);
    echo json_encode(["success" => false, "error" => "Session invalide ou famille non sélectionnée"]);
    exit;
}

try {

    $categorieDao = new CategorieDAO();
    $documentDao = new DocumentDAO();

    // affiche toutes les catégories que la famille à creer dans explorateur
    $categories = $categorieDao->getAllCategories($app->id_famille, $app->getRole());
    
    foreach ($categories as $categorie) {

        // affiche tout les documents des differentes catégories de la famille
        $documents = $documentDao->getDocumentsDeIdCategorie($app->id_famille, $categorie->id_cat);
        
    }

    echo json_encode($categories);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}

exit();