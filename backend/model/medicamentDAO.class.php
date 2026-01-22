<?php
require_once(__DIR__ . '/medicament.class.php');

class MedicamentDAO {
    private DAL $dal;


public function __construct(?DAL $dal = null) {
    $this->dal = $dal ?? DAL::get();
}
    // renvoie la quantite d'un médicament 
     public function getNbMedicament($id_famille,$nomMedicament): array {
        $query = 'SELECT quantite FROM STOCK_MEDICS WHERE designation_med LIKE :nomMedicament AND id_famille = :id_famille';
        $stmt = $this->dal->prepare($query);

        $stmt->execute(['nomMedicament' => $nomMedicament,'id_famille' => $id_famille]);
        $data = $stmt->fetchAll();

        foreach($data as $medicament){
             $medicaments[] = new Medicament($medicament);
        }

        return $medicaments;
    }

    // renvoie la liste de tout les médicaments ajouter par la famille 
    public function getAllMedicaments($id_famille): array {
        $query = 'SELECT sm.*, cm.* 
                  FROM STOCK_MEDICS sm
                  LEFT JOIN CAT_MEDICS cm ON sm.id_cat_medicament = cm.id_medics
                  WHERE sm.id_famille = :id_famille
                  ORDER BY COALESCE(cm.denomination_substance, sm.designation_med) ASC';
        $stmt = $this->dal->prepare($query);

        $stmt->execute(['id_famille' => $id_famille]);
        $data = $stmt->fetchAll();
        $medicaments = [];
        foreach($data as $medicament){
             $medicaments[] = new Medicament($medicament);
        }

        return $medicaments;
    }

    // renvoie tout les médicament de la famille avecun stock inférieur à 10 % du stock total 
    public function getAllMedicamentsUrgent($id_famille): array {
        $query = 'SELECT sm.*, cm.* FROM STOCK_MEDICS sm
                LEFT JOIN CAT_MEDICS cm ON sm.id_cat_medicament = cm.id_medics
                WHERE sm.id_famille = :id_famille 
                AND (
                    (sm.total >= 10 AND sm.quantite <= (sm.total * 0.1)) 
                    OR 
                    (sm.total < 10 AND sm.quantite <= 1)
                )';
                
        $stmt = $this->dal->prepare($query);
        $stmt->execute(['id_famille' => $id_famille]);
        
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $medicaments = [];
        foreach($data as $medicament){
            $medicaments[] = new Medicament($medicament);
        }

        return $medicaments;
    }

    // recherche le nom entre dans la base de donné
    public function searchNomMedicament($texte): array {
        $query = 'SELECT DISTINCT denomination_substance 
                FROM CAT_MEDICS 
                WHERE denomination_substance ILIKE :search 
                ORDER BY denomination_substance ASC 
                LIMIT 10';
        
        $stmt = $this->dal->prepare($query);
        $stmt->execute(['search' => $texte . '%']);
        
        $resultats = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return [
            "resultats" => $resultats,
        ];
    }

    // vérifie si le nom existe dans la base de donnée
    public function isGoodName($texte): bool {
        $query = 'SELECT 1 
                FROM CAT_MEDICS 
                WHERE denomination_substance ILIKE :search 
                LIMIT 1';
        
        $stmt = $this->dal->prepare($query);
        $stmt->execute(['search' => $texte]);
        
        return $stmt->fetchColumn() !== false;
    }

    // renvoie les types du médicament entré
    public function getTypesByNomExact($nomExact): array {
        $query = 'SELECT DISTINCT ON (designation_elem_pharma) 
                        id_medics, 
                        designation_elem_pharma 
                FROM CAT_MEDICS 
                WHERE denomination_substance ILIKE :nom 
                ORDER BY designation_elem_pharma ASC, id_medics ASC';
        
        $stmt = $this->dal->prepare($query);
        $stmt->execute(['nom' => $nomExact]);
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // renvoie tout les médicament présent dans le catalogue
    public function getAllMedicamentNamesFromCatalogue(): array {
        $query = 'SELECT DISTINCT denomination_substance FROM CAT_MEDICS WHERE denomination_substance IS NOT NULL';
        $stmt = $this->dal->prepare($query);
        $stmt->execute();
        // PDO::FETCH_COLUMN fetches only a single column from the next row.
        return $stmt->fetchAll(PDO::FETCH_COLUMN, 0);
    }

    // met à jour le stock de médicament
    public function updateMedecine($id_famille, $nouveauStock, $id_medicament): bool {
        $query = 'UPDATE STOCK_MEDICS 
                SET quantite = :stock 
                WHERE id_medicament = :id_med 
                AND id_famille = :id_famille';
        
        $stmt = $this->dal->prepare($query);

        return $stmt->execute([
            'stock'      => $nouveauStock,
            'id_med'     => $id_medicament,
            'id_famille' => $id_famille
        ]);
    }

    // met à jour le stock si le médicament et déjà pésent et qu'on le rajoute
    public function addSameMedecine($id_famille,$id_medicament, $stockAAjouter): bool {
        $query = 'UPDATE STOCK_MEDICS 
                SET quantite = quantite + :stock 
                WHERE id_medicament = :id_medicament 
                AND id_famille = :id_famille';
                
        $stmt = $this->dal->prepare($query);

        return $stmt->execute([
            'id_medicament'       => $id_medicament, 
            'stock'      => (int)$stockAAjouter, 
            'id_famille' => (int)$id_famille
        ]);
    }

    // supprime un médicament ajouté par une famille 
    public function deleteMedecine($id_famille, $id_medicament): bool {
    try {
        $this->dal->beginTransaction();
        $queryConso = 'DELETE FROM CONSO WHERE id_medicament = :id_m';
        $this->dal->prepare($queryConso)->execute(['id_m' => $id_medicament]);

        $queryStock = 'DELETE FROM STOCK_MEDICS WHERE id_famille = :id_f AND id_medicament = :id_m';
        $stmt = $this->dal->prepare($queryStock);
        $res = $stmt->execute([
            'id_f' => $id_famille,
            'id_m' => $id_medicament
        ]);

        return $this->dal->commit();

        } catch (Exception $e) {
            $this->dal->rollBack();
            throw $e;
        }
    }

    // ajoute le médicament creer par la famille 
    public function addMedecine($id_famille, $name, $stock, $stockTotal, $id_cat_medicament): bool {
    if ($stockTotal < $stock) {
        $stockTotal = $stock;
    }

    try {
        $query = 'INSERT INTO STOCK_MEDICS (designation_med, quantite, id_famille, total, id_cat_medicament) 
                  VALUES (:name, :stock, :id_famille, :stockTotal, :id_cat_medicament)';
        
        $stmt = $this->dal->prepare($query);

        return $stmt->execute([
            'name'              => $name,
            'stock'             => (int)$stock,
            'id_famille'        => $id_famille,
            'stockTotal'        => (int)$stockTotal,
            'id_cat_medicament' => $id_cat_medicament
        ]);
        } catch (PDOException $e) {
            error_log("DAO Error in addMedecine: " . $e->getMessage());
            throw $e;
        }
    }


}