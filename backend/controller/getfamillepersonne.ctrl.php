<?php
// On inclut le DAO Famille car c'est lui qui gère les personnes de la famille
require_once('model/FamilleDAO.class.php'); 
require_once(__DIR__ . '/../app.php');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

try {
    // Vérification de sécurité : l'utilisateur doit avoir une famille
    if (empty($app->id_famille)) {
        throw new Exception("Aucune famille identifiée pour cet utilisateur.");
    }

    $dao = new FamilleDAO();
    
    // On utilise la méthode que tu as déjà codée dans FamilleDAO !
    // Elle retourne un tableau d'objets Personne
    $membres = $dao->getPersFam($app->id_famille);

    // On prépare les données pour React (on ne garde que l'utile)
    $dataExport = [];
    foreach ($membres as $personne) {
        $dataExport[] = [
            'id' => $personne->id,       // id_personne
            'nom' => $personne->nom,
            'prenom' => $personne->prenom
        ];
    }

    echo json_encode([
        "success" => true,
        "membres" => $dataExport
    ]);

} catch (Exception $e) {
    http_response_code(500); // Erreur serveur
    echo json_encode([
        "success" => false, 
        "error" => $e->getMessage()
    ]);
}