<?php
require_once(__DIR__ . '/OCR.class.php');
require_once(__DIR__ . '/ocrDAO.php');

class OcrController {
    public function extractMedicaments() {
        header('Content-Type: application/json');
        
        if (!isset($_FILES['ordonnance'])) {
            echo json_encode(['error' => 'Aucun fichier uploadé']);
            return;
        }
        
        $file = $_FILES['ordonnance'];
        
        if ($file['error'] !== UPLOAD_ERR_OK) {
            echo json_encode(['error' => 'Erreur lors de l\'upload']);
            return;
        }
        
        try {
            $imagePath = $file['tmp_name'];
            $rawText = $this->performOCR($imagePath);
            $medicaments = $this->findMedicamentsInText($rawText);
            
            echo json_encode([
                'success' => true,
                'raw_text' => $rawText,
                'medicaments' => $medicaments
            ]);
            
        } catch (Exception $e) {
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
    
    private function performOCR($imagePath) {
        $command = "tesseract " . escapeshellarg($imagePath) . " stdout -l fra 2>&1";
        $output = shell_exec($command);
        return $output ?: 'Aucun texte extrait';
    }
    
    private function findMedicamentsInText($text) {
        $medicamentsConnus = [
            'DOLIPRANE', 'EFFERALGAN', 'DAFALGAN', 'IBUPROFENE',
            'PARACETAMOL', 'ASPIRINE', 'AMOXICILLINE', 'VENTOLINE',
            'SPASFON', 'SMECTA', 'VOGALENE', 'LEVOTHYROX'
        ];
        
        $texteUpper = strtoupper($text);
        $medsFound = [];
        
        foreach ($medicamentsConnus as $med) {
            if (strpos($texteUpper, $med) !== false) {
                $medsFound[] = $med;
            }
        }
        
        return array_unique($medsFound);
    }
}
?>  