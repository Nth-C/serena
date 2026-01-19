<?php
require_once(__DIR__ . '/../model/medicamentDAO.class.php');
require_once(__DIR__ . '/../app.php');



if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

// --- 2. VÉRIFICATION SÉCURITÉ (Rôle) ---
// Note: credentials: 'include' dans fetch est requis pour que ceci fonctionne
if (!$app->checkRole('Famille')) {
    echo json_encode([
        'success' => false, 
        'error' => 'Accès refusé : Vous devez être connecté.'
    ]);
    exit;
}

$id_famille = $app->id_famille;

// --- 3. RÉCUPÉRATION DES DONNÉES JSON ---
// Comme filter_input(INPUT_POST) ne lit pas le JSON, on fait ceci :
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Équivalent de filter_input pour le format JSON
$name        = filter_var($data['name'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);
$stock       = filter_var($data['stock'] ?? null, FILTER_VALIDATE_INT);
$stockTotal  = filter_var($data['stockTotal'] ?? null, FILTER_VALIDATE_INT);
$idCatalogue = filter_var($data['idCatalogueMedecine'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);
// --- 4. VALIDATION ET INSERTION ---
if ($name && $stock !== false && $stockTotal !== false && $id_famille) {
    
    $model = new MedicamentDAO();
    
    try {
        $success = $model->addMedecine(
            $id_famille, 
            $name, 
            $stock, 
            $stockTotal, 
            $idCatalogue
        );

        echo json_encode([
            "success" => $success,
            "message" => "Médicament ajouté."
        ]);

    } catch (Exception $e) {
        echo json_encode([
            "success" => false, 
            "error" => "Erreur serveur : " . $e->getMessage()
        ]);
    }

} else {
    // Si une donnée est mal formée ou manquante
    $errorMsg = 'Veuillez remplir tous les champs correctement.';
    if ($stock === false || $stockTotal === false) {
        $errorMsg = 'Les stocks doivent être des nombres entiers.';
    }
    
    echo json_encode([
        'success' => false, 
        'error' => $errorMsg
    ]);
}

exit();