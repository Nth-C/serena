<?php
require_once('model/categorieDAO.class.php');
require_once('model/documentDAO.class.php');
require_once(__DIR__ . '/../app.php');



$app = new App();

try {
    $categorieDao = new CategorieDAO();
    $categories = $categorieDao->getAllCategories($app->id_famille);
    // echo pour envoyer les données dans la vue
    $documentDao = new DocumentDAO();
    foreach($categories as $categorie){
        $documents = $documentDao->getDocumentsDeIdCategorie($app->id_famille,$categorie->id_cat);
        
        foreach($documents as $document){
            if($document->id_cat == $categorie->id_cat){

                $categorie->ajouterDocument($document);
            }
        }
    }
    echo json_encode($categories);
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}