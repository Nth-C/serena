<?php
require_once('model/categorieDAO.class.php');
require_once('model/documentDAO.class.php');
require_once(__DIR__ . '/../app.php');

header("Content-Type: application/json");

$app = new App();

if (!$app->connected || !$app->id_famille) {
    echo json_encode(["error" => "Session invalide ou famille non sélectionnée"]);
    exit;
}

try {
    $categorieDao = new CategorieDAO();
    $documentDao = new DocumentDAO();

    $categories = $categorieDao->getAllCategories($app->id_famille);

    foreach($categories as $categorie){
        $documents = $documentDao->getDocumentsDeIdCategorie($app->id_famille, $categorie->id_cat);
        
        foreach($documents as $document){
            $categorie->ajouterDocument($document);
        }
    }

    echo json_encode($categories);

} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}