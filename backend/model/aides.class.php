<?php
class Aides{
    public string $id_aide_fin;
    public string $description;
    public string $acces;
    public string $obtention;
    public string $document_req;
    public string $montant;


    public function __construct(array $data = array()){

        $this->id_aide_fin = $data['id_aide_fin'] ?? '';        
        $this->description = $data['description'] ?? '';
        $this->acces = $data['acces'] ?? '';
        $this->obtention = $data['obtention'] ?? '';
        $this->document_req = $data['document_req'] ?? '';
        $this->montant = $data['montant'] ?? '';


    }
}
?>