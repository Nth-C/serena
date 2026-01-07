<?php
require_once(__DIR__ . '/Personne.class.php');
require_once(__DIR__ . '/PersonneDAO.class.php');

class Rapport {
    public readonly int $id_rapport;
    public string $description;
    public string $nom;
    public ?DateTimeImmutable $date;
    public ?Personne $auteur;

    public function __construct(array $data = array()) {
        
        $this->id_rapport = $data['id_rapport'] ?? -1;
        $this->description = $data['desc'] ?? '';
        $this->nom = $data['nom'] ?? '';
        $this->date = $data['date'];
        
        $dao = new PersonneDAO();
        $this->auteur = $dao->findPersonneById($data['id_personne']);
        
        
    }

}
?>