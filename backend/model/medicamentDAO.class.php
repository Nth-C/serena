<?php
require_once(__DIR__ . '/medicament.class.php');

class MedicamentDAO {
    private DAL $dal;


public function __construct(?DAL $dal = null) {
    $this->dal = $dal ?? DAL::get();
}

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

    public function getAllMedicamentsUrgent($id_famille): array {
    // On utilise une clause WHERE avec une condition logique (OR)
    $query = 'SELECT sm.*, cm.* FROM STOCK_MEDICS sm
              LEFT JOIN CAT_MEDICS cm ON sm.id_cat_medicament = cm.id_medics
              WHERE sm.id_famille = :id_famille 
              AND (
                  (sm.total >= 10 AND sm.quantite <= (sm.total * 0.1)) -- Règle des 10%
                  OR 
                  (sm.total < 10 AND sm.quantite <= 1) -- Règle du 1 restant
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

    public function searchNomMedicament($texte): array {
    // On récupère uniquement les noms de médicaments sans doublons
    $query = 'SELECT DISTINCT denomination_substance 
              FROM CAT_MEDICS 
              WHERE denomination_substance ILIKE :search 
              ORDER BY denomination_substance ASC 
              LIMIT 10';
    
    $stmt = $this->dal->prepare($query);
    // On cherche ce qui COMMENCE par le texte pour une meilleure suggestion
    $stmt->execute(['search' => $texte . '%']);
    
    $resultats = $stmt->fetchAll(PDO::FETCH_ASSOC);

    return [
        "resultats" => $resultats,
    ];
}

    public function isGoodName($texte): bool {
    // On compte si le nom existe exactement dans la table
    $query = 'SELECT 1 
              FROM CAT_MEDICS 
              WHERE denomination_substance ILIKE :search 
              LIMIT 1';
    
    $stmt = $this->dal->prepare($query);
    $stmt->execute(['search' => $texte]);
    
    // fetchColumn renvoie la valeur (1) ou false si rien n'est trouvé
    return $stmt->fetchColumn() !== false;
}

/**
 * Récupère les types uniques en utilisant DISTINCT ON (PostgreSQL spécifique)
 */
public function getTypesByNomExact($nomExact): array {
    // DISTINCT ON garantit un seul résultat par désignation
    // On doit ordonner par la même colonne que le DISTINCT ON en premier
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

/**
 * Récupère tous les noms de médicaments uniques depuis le catalogue.
 * @return array La liste des noms de médicaments.
 */
public function getAllMedicamentNamesFromCatalogue(): array {
    $query = 'SELECT DISTINCT denomination_substance FROM CAT_MEDICS WHERE denomination_substance IS NOT NULL';
    $stmt = $this->dal->prepare($query);
    $stmt->execute();
    // PDO::FETCH_COLUMN fetches only a single column from the next row.
    return $stmt->fetchAll(PDO::FETCH_COLUMN, 0);
}

    public function updateMedecine($id_famille, $nouveauStock, $id_medicament): bool {
    // La requête cible le médicament précis au sein d'une famille précise
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

    public function deleteMedecine($id_famille, $id_medicament): bool {
    try {
        $this->dal->beginTransaction();

        // 1. On supprime d'abord les traces de consommation (la contrainte bloquante)
        $queryConso = 'DELETE FROM CONSO WHERE id_medicament = :id_m';
        $this->dal->prepare($queryConso)->execute(['id_m' => $id_medicament]);

        // 2. On supprime le médicament du stock
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

    public function addMedecine($id_famille, $name, $stock, $stockTotal, $id_cat_medicament): bool {
    // Sécurité : Si le total est inférieur au stock actuel, on l'aligne
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


    public function getStockById($id_m) {
    $query = 'SELECT quantite FROM STOCK_MEDICS WHERE id_medicament = :id';
    $stmt = $this->dal->prepare($query);
    $stmt->execute(['id' => $id_m]);
    $res = $stmt->fetch();
    return $res ? (int)$res['quantite'] : 0;
}

}