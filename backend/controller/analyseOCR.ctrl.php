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

    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('JSON invalide reçu: ' . json_last_error_msg());
    }
    
    $ocrText = $data['ocrText'] ?? '';
    
    $suffixes = ['ol', 'ine', 'one', 'ide', 'vir', 'mab', 'statine', 'prazole', 'ane'];
    
    $pattern = '/\b\w+(' . implode('|', $suffixes) . ')\b/iu';
    $medicamentsParSuffixe = [];
    if (!empty($ocrText)) {
        preg_match_all($pattern, $ocrText, $matches);
        $medicamentsParSuffixe = $matches[0] ?? [];
    }
    
    $medicamentsEnMajuscules = [];
    if (!empty($ocrText)) {
        preg_match_all('/\b[A-Z]{2,}\b/u', $ocrText, $matchesMajuscules);
        $medicamentsEnMajuscules = $matchesMajuscules[0] ?? [];
    }
    
    $tousLesMedicaments = array_merge($medicamentsParSuffixe, $medicamentsEnMajuscules);
    
    ob_end_clean();
    echo json_encode([
        'success' => true,
        'message' => 'Analyse OCR terminée.',
        'medicaments' => array_unique($tousLesMedicaments)
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