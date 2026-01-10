<?php
require_once('model/categorieDAO.class.php');
require_once('model/documentDAO.class.php');
require_once(__DIR__ . '/../app.php');

header("Content-Type: application/json");

$app = new App();

// Sécurité : Vérifier la session UUID
if (!$app->connected || !$app->id_famille) {
    echo json_encode(["error" => "Session invalide ou famille non sélectionnée"]);
    exit;
}

try {
    $categorieDao = new CategorieDAO();
    $documentDao = new DocumentDAO();

    // 1. Récupérer toutes les catégories de la famille
    $categories = $categorieDao->getAllCategories($app->id_famille);

    // 2. Associer les documents à chaque catégorie
    foreach($categories as $categorie){
        // Utilisation de ta méthode existante dans le DAO
        $documents = $documentDao->getDocumentsDeIdCategorie($app->id_famille, $categorie->id_cat);
        
        // On remplit la propriété 'documents' de l'objet Categorie
        // Assure-toi que ta classe Categorie a bien une méthode ajouterDocument()
        foreach($documents as $document){
            $categorie->ajouterDocument($document);
        }
    }

    // 3. Envoi des données vers le front-end React
    echo json_encode($categories);

} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}