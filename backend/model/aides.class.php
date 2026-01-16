<?php
class Aides{
    public string $id_aide_fin;
    public string $nom; // Ajouté
    public string $description;
    public string $acces;
    public string $obtention;
    public string $documents_req; // Corrigé avec un s
    public string $montant;

    public function __construct(array $data = array()){
        $this->id_aide_fin = $data['id_aide_fin'] ?? '';        
        $this->nom = $data['nom'] ?? ''; // Ajouté
        $this->description = $data['description'] ?? '';
        $this->acces = $data['acces'] ?? '';
        $this->obtention = $data['obtention'] ?? '';
        $this->documents_req = $data['documents_req'] ?? $data['document_req'] ?? '';
        $this->montant = $data['montant'] ?? '';
    }
}
?>