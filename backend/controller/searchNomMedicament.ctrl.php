<?php
require_once(__DIR__ . '/../model/medicamentDAO.class.php');
require_once(__DIR__ . '/../app.php');

header("Content-Type: application/json");

$model = new MedicamentDAO();

try {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (empty($data['texteNomMedicament'])) {
        throw new Exception("Données manquantes (texteNomMedicament).");
    }

    $texte = $data['texteNomMedicament'];
    
    // 1. Recherche initiale des noms correspondants
    $resultat = $model->searchNomMedicament($texte);

    // 2. Si un nom unique est identifié (ou trouvé exactement)
    if($model->isGoodName($texte)){

    $resultat['types'] = $model->getTypesByNomExact($texte);
    $resultat['isUnique'] = true;
        
        
    }

    echo json_encode($resultat);

} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}