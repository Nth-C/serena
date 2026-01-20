<?php
ob_start();
header('Content-Type: application/json');

try {
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        ob_end_clean();
        exit;
    }

    require_once(__DIR__ . '/../app.php');
    $app = new App();

    $ocrText = '';

    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    $ocrText = $data['ocrText'] ?? '';
    
    $tousLesMedicaments = [];

    $commonMeds = [
        'doliprane', 'dafalgan', 'efferalgan', 'spasfon', 'advil', 'nurofen', 
        'smecta', 'fervex', 'amoxicilline', 'augmentin', 'voltarene', 'imodium', 
        'gaviscon', 'ventoline', 'aerius', 'zyrtec', 'xanax', 'lexomil', 
        'valium', 'stilnox', 'imovane', 'paracetamol', 'ibuprofene', 'aspirine',
        'kardegic', 'plavix', 'tahor', 'elisor', 'levothyrox', 'glucophage'
    ];

    if (!empty($ocrText)) {
        foreach ($commonMeds as $med) {
            if (preg_match('/\b' . preg_quote($med, '/') . '\b/iu', $ocrText, $match)) {
                $tousLesMedicaments[] = $match[0];
            }
        }
    }

    $suffixes = ['ol', 'ine', 'one', 'ide', 'vir', 'mab', 'statine', 'prazole', 'ane'];
    $pattern = '/\b\w+(' . implode('|', $suffixes) . ')\b/iu';
    
    if (!empty($ocrText)) {
        preg_match_all($pattern, $ocrText, $matches);
        if (!empty($matches[0])) {
            $tousLesMedicaments = array_merge($tousLesMedicaments, $matches[0]);
        }
        
        preg_match_all('/\b[A-Z]{3,}\b/u', $ocrText, $matchesMajuscules);
        if (!empty($matchesMajuscules[0])) {
            $tousLesMedicaments = array_merge($tousLesMedicaments, $matchesMajuscules[0]);
        }


        preg_match_all('/([a-zA-Z]{3,})\s+\d+(?:[\.,]\d+)?\s*(?:mg|g|ml|cp|gelule|sachet)/iu', $ocrText, $matchesDosage);
        if (!empty($matchesDosage[1])) {
            $tousLesMedicaments = array_merge($tousLesMedicaments, $matchesDosage[1]);
        }
    }
    
    ob_end_clean();
    echo json_encode([
        'success' => true,
        'message' => 'Analyse OCR terminée.',
        'raw_text' => $ocrText,
        'medicaments' => array_values(array_unique($tousLesMedicaments))
    ]);
} catch (Exception $e) {
    ob_end_clean();
    if ($e->getMessage() === 'Erreur de sécurité : Jeton CSRF invalide ou manquant.') {
        http_response_code(403);
    } else {
        http_response_code(500); 
    }
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

exit();