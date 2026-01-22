<?php
ob_start();
header('Content-Type: application/json');

try {
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        ob_end_clean();
        exit;
    }

    // Inclusion des dépendances
    require_once(__DIR__ . '/../app.php');
    require_once(__DIR__ . '/../model/medicamentDAO.class.php');
    $app = new App();

    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    $ocrText = $data['ocrText'] ?? '';
    
    $foundMeds = [];
    $tousLesMedicaments = [];

    //mot commun d'une ordonnance
    $commonMeds = [
        'doliprane', 'dafalgan', 'efferalgan', 'spasfon', 'advil', 'nurofen', 
        'smecta', 'fervex', 'amoxicilline', 'augmentin', 'voltarene', 'imodium', 
        'gaviscon', 'ventoline', 'aerius', 'zyrtec', 'xanax', 'lexomil', 
        'valium', 'stilnox', 'imovane', 'paracetamol', 'ibuprofene', 'aspirine',
        'kardegic', 'plavix', 'tahor', 'elisor', 'levothyrox', 'glucophage'
    ];

    if (!empty($ocrText)) {
        // 1. Recherche basée sur le catalogue de médicaments
        $medicamentDAO = new MedicamentDAO();
        $catalogueMeds = $medicamentDAO->getAllMedicamentNamesFromCatalogue();
        
        // On ne garde que les médicaments de 4 caractères ou plus pour éviter les faux positifs
        $catalogueMeds = array_filter($catalogueMeds, function($med) {
            return mb_strlen($med) >= 4;
        });

        if (!empty($catalogueMeds)) {
            // Échapper les noms pour les utiliser dans une regex
            $escapedMeds = array_map(function($med) {
                return preg_quote($med, '/');
            }, $catalogueMeds);

            // Création du pattern regex
            $pattern = '/\b(' . implode('|', $escapedMeds) . ')\b/iu';
            
            preg_match_all($pattern, $ocrText, $matches);
            if (!empty($matches[0])) {
                $foundMeds = array_merge($foundMeds, $matches[0]);
            }
        }

        // 2. Recherche par structure (nom + dosage), très fiable
        $patternDosage = '/\b([a-zA-ZÀ-ÖØ-öø-ÿ]{4,})\s+\d+(?:[\.,]\d+)?\s*(?:mg|g|ml|cp|comprimé|gélule|sachet|inhal|bouffée|unité)s?\b/iu';
        preg_match_all($patternDosage, $ocrText, $matchesDosage);
        if (!empty($matchesDosage[1])) {
            $foundMeds = array_merge($foundMeds, $matchesDosage[1]);
        }
    }
    
    ob_end_clean();
    echo json_encode([
        'success' => true,
        'message' => 'Analyse OCR terminée.',
        'raw_text' => $ocrText,
        // On nettoie, on met en minuscule et on supprime les doublons
        'medicaments' => array_values(array_unique(array_map('mb_strtolower', $foundMeds)))
    ]);
} catch (Exception $e) {
    ob_end_clean();
    http_response_code(500); 
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}

exit();