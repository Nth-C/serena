<?php
require_once(__DIR__ . '/rapport.class.php');

class RapportDAO {
    private DAL $dal;

    public function __construct() {
        $this->dal = DAL::get();
    }

    public function getAllRapports($id_famille): array {
        $query = 'SELECT * FROM RAPPORTS WHERE id_famille = :id_famille ORDER BY date DESC';
        $stmt = $this->dal->prepare($query);
        $stmt->execute(['id_famille' => $id_famille]);
        $data = $stmt->fetchAll();

        $rapports = [];
        foreach($data as $rapport){
             $rapports[] = new Rapport($rapport);
        }
        return $rapports;
    }

    public function addRapport($id_famille, $id_personne, $description, $nom): bool {
        $query = 'INSERT INTO RAPPORTS (description, date, id_famille, id_personne, nom) 
                  VALUES (:description, now(), :id_famille, :id_personne, :nom)';
        $stmt = $this->dal->prepare($query);

        return $stmt->execute([
            'description' => $description, 
            'id_famille' => $id_famille, 
            'id_personne' => $id_personne,
            'nom' => $nom
        ]);
    }

    public function deleteRapport($id_rapport) : bool {
        $query = 'DELETE FROM RAPPORTS WHERE id_rapport = :id_rapport';
        $stmt = $this->dal->prepare($query);
        return $stmt->execute(['id_rapport' => $id_rapport]);
    }

    
}