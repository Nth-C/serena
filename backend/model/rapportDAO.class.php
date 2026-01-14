<?php
require_once(__DIR__ . '/rapport.class.php');
require_once(__DIR__ . '/dal.class.php');

class RapportDAO {
    private DAL $dal;

    public function __construct() {
        $this->dal = DAL::get();
    }

    public function getAllRapports($id_famille): array {
        $query = "SELECT r.*, p.prenom as auteur,
                  COALESCE(json_agg(
                      json_build_object(
                          'nom', s.designation_med, 
                          'quantite', c.nombre_medic_conso
                      )
                  ) FILTER (WHERE s.id_medicament IS NOT NULL), '[]') as medics_details
                  FROM RAPPORTS r 
                  JOIN PERSONNES p ON r.id_personne = p.id_personne
                  LEFT JOIN CONSO c ON r.id_rapport = c.id_rapport
                  LEFT JOIN STOCK_MEDICS s ON c.id_medicament = s.id_medicament
                  WHERE r.id_famille = :id_famille 
                  GROUP BY r.id_rapport, p.prenom
                  ORDER BY r.date DESC, r.heure DESC";
        
        $stmt = $this->dal->prepare($query);
        $stmt->execute(['id_famille' => $id_famille]); 
        $results = $stmt->fetchAll();

        foreach ($results as &$row) {
            $row['medics_details'] = json_decode($row['medics_details'], true);
        }
        return $results;
    }

    public function addRapport($id_famille, $id_personne, $description, $nom) {
        $query = 'INSERT INTO RAPPORTS (nom, description, date, heure, id_famille, id_personne) 
                  VALUES (:nom, :description, CURRENT_DATE, CURRENT_TIME, :id_famille, :id_personne)
                  RETURNING id_rapport';

        $stmt = $this->dal->prepare($query);
        $stmt->execute([
            'nom'         => $nom,
            'description' => $description, 
            'id_famille'  => $id_famille, 
            'id_personne' => $id_personne  
        ]);

        $res = $stmt->fetch();
        return $res ? $res['id_rapport'] : false;
    }

    public function addMedicToConso($id_medicament, $id_rapport, $nombre) {
        $query = 'INSERT INTO CONSO (id_medicament, id_rapport, nombre_medic_conso) 
                  VALUES (:id_medicament, :id_rapport, :nombre)';
        $stmt = $this->dal->prepare($query);
        return $stmt->execute([
            'id_medicament'      => $id_medicament,
            'id_rapport'         => $id_rapport,
            'nombre'             => $nombre
        ]);
    }

    public function deleteRapport($id_rapport): bool {
        $query1 = 'DELETE FROM CONSO WHERE id_rapport = :id';
        $stmt1 = $this->dal->prepare($query1);
        $stmt1->execute(['id' => $id_rapport]);

        $query2 = 'DELETE FROM RAPPORTS WHERE id_rapport = :id';
        $stmt2 = $this->dal->prepare($query2);
        return $stmt2->execute(['id' => $id_rapport]);
    }

    public function updateMedicStock($id_medicament, $quantiteConsommee) {
        $query = 'UPDATE STOCK_MEDICS 
                  SET quantite = quantite - :conso 
                  WHERE id_medicament = :id 
                  AND quantite >= :conso'; 
        
        $stmt = $this->dal->prepare($query);
        return $stmt->execute([
            'conso' => $quantiteConsommee,
            'id'    => $id_medicament
        ]);
    }
}