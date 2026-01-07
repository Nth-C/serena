<?php
require_once(__DIR__ . '/Personne.class.php');
require_once(__DIR__ . '/PersonneDAO.class.php');

class Rapport {
    public readonly int $id_rapport;
    public string $description;
    public ?DateTimeImmutable $date;
    public readonly int $id_famille;
    public readonly int $id_personne;




    public function __construct(array $data = array()) {
        
        $this->id_rapport = $data['id_rapport'] ?? -1;
        $this->description = $data['description'] ?? '';
        $this->date = $data['date'];
        $this->id_famille = $data['id_famille'];
        $this->id_personne = $data['id_personne'];
        
    }

}
?>