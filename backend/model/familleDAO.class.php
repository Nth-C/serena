<?php
require_once(__DIR__ . '/famille.class.php');
require_once(__DIR__ . '/dal.class.php');
class FamilleDAO {
    private DAL $dal;

    public function __construct() {
        $this->dal = DAL::get();
    }

    public function insert(Famille $famille): bool {
        $query = 'INSERT INTO fams (nom, "desc", nom_aide) 
                  VALUES (:nom, :desc, :nom_aide)';
        
        $stmt = $this->dal->prepare($query);

        return $stmt->execute([
            ':nom'            => $famille->nom,
            ':desc'         => $famille->desc,
            ':nom_aide'           => $famille->nom_aide 
        ]);
    }

    public function findByName(string $nom): ?Famille {
        $query = 'SELECT * FROM fams WHERE nom = :nom';
        $stmt = $this->dal->prepare($query);
        $stmt->execute([':nom' => $nom]);   
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result === false) {
        return null;
        }
        
        return new Famille($result);
    }

    public function findAll(): array {
        $query = 'SELECT * FROM fams';
        $stmt = $this->dal->prepare($query);
        $stmt->execute();
        
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $resultats = [];

        foreach($data as $row) {
            $resultats[] = new Famille($row);
        }

        return $resultats;
    }

    public function getPersFam($id_famille): array {
        $query = 'SELECT * FROM PERSONNES WHERE id_famille = :id_famille';
        
        $stmt = $this->dal->prepare($query);
        $stmt->execute(['id_famille' => $id_famille]);
        $data = $stmt->fetchAll();

        $resultats = [];

        foreach($data as $row) {
            $resultats[] = new Personne($row);
        }

        return $resultats;
    }

    public function AddPersFam($id_famille,$id_personne): array {
        $query = 'INSERT INTO appartient_a (id_famille, id_personne) VALUES (:id_famille, :id_personne)';
        $stmt = $this->dal->prepare($query);
        $stmt->execute([
            'id_famille'  => $id_famille,
            'id_personne' => $id_personne
        ]);
    }
}