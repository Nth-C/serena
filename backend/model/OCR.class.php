<?php
require_once(__DIR__ . '/audit.class.php'); 
require_once(__DIR__ . '/dal.class.php'); 

class OCR {
    private string $text_fichier;
    private string  $resultat_ocr;
    public function __construct(array $data = array()) {
        $this->text_fichier = $data['text_fichier'] ?? '';
        $this->resultat_ocr = $data['resultat_ocr'] ?? '';
    }
    

}
?>