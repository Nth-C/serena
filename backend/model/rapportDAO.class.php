<?php
require_once(__DIR__ . '/rapport.class.php');
require_once(__DIR__ . '/dal.class.php');


class RapportDAO {
    private DAL $dal;

    public function __construct() {
        $this->dal = DAL::get();
    }


    public function getAllRapports($id_famille): array {
        $query = 'SELECT r.*, p.prenom as auteur 
                FROM RAPPORTS r 
                JOIN PERSONNES p ON r.id_personne = p.id_personne
                WHERE r.id_famille = :id_famille 
                ORDER BY r.date DESC';
        
        $stmt = $this->dal->prepare($query);
        $stmt->execute(['id_famille' => $id_famille]);
        $data = $stmt->fetchAll();
        return $data; 
    }

    public function addRapport($id_famille, $id_personne, $description, $nom): bool {$query = 
        'INSERT INTO RAPPORTS (nom, description, date, heure, id_famille, id_personne) 
        VALUES (:nom, :description, CURRENT_DATE, CURRENT_TIME, :id_famille, :id_personne)';

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