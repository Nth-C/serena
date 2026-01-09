<?php

class Rapport {
    public readonly string $id_rapport;
    public string $description;
    public ?DateTimeImmutable $date;
    public readonly string $id_famille;
    public readonly string $id_personne;
    public readonly string $nom;
    public string $heure;




    public function __construct(array $data = array()) {
        
        $this->id_rapport = $data['id_rapport'] ?? -1;
        $this->nom = $data['nom'] ??'';
        $this->description = $data['description'] ?? '';
        $this->date = $data['date'];
        $this->id_famille = $data['id_famille'];
        $this->id_personne = $data['id_personne'];
        $this->heure = $data['heure'];
        
    }

}
?>