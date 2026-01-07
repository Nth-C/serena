<?php
require_once(__DIR__ . '/rapport.class.php');

class RapportDAO {
    private DAL $dal;

    public function __construct() {
        $this->dal = DAL::get();
    }

    public function getAllRapports($id_famille): array {
        // Ajout de ORDER BY date DESC pour voir le nouveau rapport en haut de liste
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

    public function addRapport($id_famille, $id_personne, $description): bool {
        $query = 'INSERT INTO RAPPORTS (description, date, id_famille, id_personne) 
                  VALUES (:description, now(), :id_famille, :id_personne)';
        $stmt = $this->dal->prepare($query);

        return $stmt->execute([
            'description' => $description, 
            'id_famille' => $id_famille, 
            'id_personne' => $id_personne
        ]);
    }

    public function deleteRapport($id_rapport) : bool {
        $query = 'DELETE FROM RAPPORTS WHERE id_rapport = :id_rapport';
        $stmt = $this->dal->prepare($query);
        return $stmt->execute(['id_rapport' => $id_rapport]);
    }

    
}