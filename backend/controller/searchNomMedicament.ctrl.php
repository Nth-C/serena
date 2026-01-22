<?php
require_once(__DIR__ . '/../model/medicamentDAO.class.php');
require_once(__DIR__ . '/../app.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();
$model = new MedicamentDAO();

try {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    // récupère le texte du nom du médicament que l'on veux chercher pour la complétion 
    $texte = filter_var($data['texteNomMedicament'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);

    if (empty($texte)) {
        http_response_code(400);
        throw new Exception("Données manquantes");
    }
    //cherche les nom de médicaments qui ressemblent 
    $resultat = $model->searchNomMedicament($texte);

    // si 
    if ($model->isGoodName($texte)) {
        $resultat['types'] = $model->getTypesByNomExact($texte);
        $resultat['isUnique'] = true;
    }

    echo json_encode($resultat);

} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}

exit();