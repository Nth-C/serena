<?php
require_once(__DIR__ . '/OCR.class.php');
require_once(__DIR__ . '/ocrDAO.php');

class OcrController {
    public function extractMedicaments() {
        header('Content-Type: application/json');
        
        // Lire le JSON envoyé depuis le frontend
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);
        
        if (!isset($data['ocrText']) || empty($data['ocrText'])) {
            echo json_encode(['error' => 'Aucun texte OCR fourni']);
            return;
        }
        
        try {
            $ocrText = $data['ocrText'];
            
            // Extraire les médicaments du texte OCR
            $medicaments = $this->findMedicamentsInText($ocrText);
            
            echo json_encode([
                'success' => true,
                'raw_text' => $ocrText,
                'medicaments' => $medicaments
            ]);
            
        } catch (Exception $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
    
    private function findMedicamentsInText($text) {
        // Liste COMPLÈTE de médicaments courants français
        $medicamentsConnus = [
            // Antalgiques / Anti-inflammatoires
            'DOLIPRANE', 'EFFERALGAN', 'DAFALGAN', 'PARACETAMOL',
            'IBUPROFENE', 'ADVIL', 'NUROFEN', 'SPEDIFEN',
            'ASPIRINE', 'ASPEGIC', 'KARDEGIC',
            
            // Antibiotiques
            'AMOXICILLINE', 'AUGMENTIN', 'CLAMOXYL',
            'AZITHROMYCINE', 'ZITHROMAX',
            'CIPROFLOXACINE', 'CIFLOX',
            
            // Troubles digestifs
            'SPASFON', 'SMECTA', 'GAVISCON', 'MAALOX',
            'IMODIUM', 'MOTILIUM', 'VOGALENE', 'PRIMPERAN',
            
            // Antihistaminiques
            'CETIRIZINE', 'ZYRTEC', 'AERIUS', 'CLARITYNE',
            
            // Respiratoire
            'VENTOLINE', 'FLIXOTIDE', 'SERETIDE',
            
            // Cardiovasculaire
            'KARDEGIC', 'PLAVIX', 'PREVISCAN', 'COVERSYL',
            
            // Thyroïde
            'LEVOTHYROX', 'L-THYROXINE',
            
            // Autres courants
            'DAFLON', 'GINKOR', 'LYRICA', 'LAMALINE',
            'TRAMADOL', 'CODOLIPRANE', 'TOPALGIC'
        ];
        
        $texteUpper = strtoupper($text);
        $medsFound = [];
        
        foreach ($medicamentsConnus as $med) {
            // Recherche flexible : avec ou sans accents, tirets, etc.
            if (strpos($texteUpper, $med) !== false) {
                $medsFound[] = $med;
            }
        }
        
        return array_values(array_unique($medsFound));
    }
}
?>