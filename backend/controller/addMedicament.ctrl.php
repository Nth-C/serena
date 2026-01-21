<?php
require_once(__DIR__ . '/../model/medicamentDAO.class.php');
require_once(__DIR__ . '/../app.php');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

// --- 2. VÉRIFICATION SÉCURITÉ (Rôle) ---
if (!$app->checkRole('Famille')) {
    http_response_code(403);
    echo json_encode([
        'success' => false, 
        'error' => 'Accès refusé : droits insuffisants.'
    ]);
    exit; 
}

$id_famille = $app->id_famille;

// --- 3. RÉCUPÉRATION DES DONNÉES JSON ---
$json = file_get_contents('php://input');
$data = json_decode($json, true);

$name        = filter_var($data['name'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);
$stock       = filter_var($data['stock'] ?? null, FILTER_VALIDATE_INT);
$stockTotal  = filter_var($data['stockTotal'] ?? null, FILTER_VALIDATE_INT);

$type        = filter_var($data['type'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);
$idCatalogue = filter_var($data['idCatalogueMedecine'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);

// --- 4. VALIDATION ET INSERTION ---

// Logique de valeurs par défaut, notamment pour l'OCR où ces champs peuvent manquer.
if ($stock === null || $stock === false) {
    $stock = 1;
}
if ($stockTotal === null || $stockTotal === false) {
    // Le stock total par défaut est au moins égal au stock actuel.
    $stockTotal = $stock;
}
if (empty($type)) {
    // Si le type n'est pas fourni, on utilise une valeur par défaut.
    $type = 'Comprimé';
}

if (empty($idCatalogue)) {
    $idCatalogue = null;
}

if (!empty($name) && $id_famille) {
    
    $model = new MedicamentDAO();
    
    try {
        $success = $model->addMedecine(
            $id_famille, 
            $name, 
            $stock, 
            $stockTotal, 
            $idCatalogue,
            $type
        );

        if ($success) {
            http_response_code(201); // Created
            echo json_encode([
                "success" => true,
                "message" => "Médicament ajouté."
            ]);
        } else {
            http_response_code(400); // Bad Request
            echo json_encode([
                "success" => false,
                "error" => "Le médicament n'a pas pu être ajouté."
            ]);
        }

    } catch (Exception $e) {
        http_response_code(500); // Internal Server Error
        error_log($e->getMessage()); // Log for backend only
        echo json_encode([
            "success" => false, 
            "error" => "Erreur interne du serveur."
        ]);
    }

} else {
    http_response_code(400); // Bad Request
    $errorMsg = empty($name) ? 'Le nom du médicament est obligatoire.' : 'Aucune famille sélectionnée.';
    echo json_encode([
        'success' => false, 
        'error' => $errorMsg
    ]);
}

exit();