<?php
require_once(__DIR__ . '/medicament.class.php');

class MedicamentDAO {
    private DAL $dal;

    public function __construct() {
        $this->dal = DAL::get();
    }

     public function getNbMedicament($id_famille,$nomMedicament): array {
        $query = 'SELECT quantite FROM STOCK_MEDICS WHERE designation_medicament LIKE :nomMedicament AND id_famille = :id_famille';
        $stmt = $this->dal->prepare($query);

        $stmt->execute(['nomMedicament' => $nomMedicament,'id_famille' => $id_famille]);
        $data = $stmt->fetchAll();

        foreach($data as $medicament){
             $medicaments[] = new Medicament($medicament);
        }

        return $medicaments;
    }

    public function getAllMedicaments($id_famille): array {
        $query = 'SELECT * FROM STOCK_MEDICS,CAT_MEDICS WHERE id_famille = :id_famille AND CAT_MEDICS.id_medics = STOCK_MEDICS.idCatalogueMedecine';
        $stmt = $this->dal->prepare($query);

        $stmt->execute(['id_famille' => $id_famille]);
        $data = $stmt->fetchAll();
        $medicaments = [];
        foreach($data as $medicament){
             $medicaments[] = new Medicament($medicament);
        }

        return $medicaments;
    }

    public function searchNomMedicament($texteNomMedicament): array {
    // 1. On récupère d'abord les noms DISTINCTS pour tester l'unicité
    $queryDistinct = 'SELECT DISTINCT denomination_substance 
                      FROM CAT_MEDICS 
                      WHERE denomination_substance ILIKE :search';
    
    $stmt = $this->dal->prepare($queryDistinct);
    $stmt->execute(['search' => '%' . $texteNomMedicament . '%']);
    $nomsDistincts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($nomsDistincts)) {
        return ["resultats" => [], "isUnique" => false];
    }

    // On regarde s'il y a plus d'une dénomination différente
    $nbNoms = count($nomsDistincts);

    if ($nbNoms > 1) {
        // CAS MULTIPLE : On refait la requête SANS DISTINCT avec un LIMIT 5
        $querySimple = 'SELECT DISTINCT denomination_substance 
                        FROM CAT_MEDICS 
                        WHERE denomination_substance ILIKE :search 
                        LIMIT 5';
        $stmtSimple = $this->dal->prepare($querySimple);
        $stmtSimple->execute(['search' => '%' . $texteNomMedicament . '%']);
        
        return [
            "resultats" => $stmtSimple->fetchAll(PDO::FETCH_ASSOC),
            "isUnique" => false
        ];
    } else {
        // CAS UNIQUE : On récupère les détails (ID, Pharma, etc.) pour ce nom précis
        $nomUnique = $nomsDistincts[0]['denomination_substance'];

        $queryDetails = 'SELECT id_medics, designation_elem_pharma, denomination_substance
                         FROM CAT_MEDICS 
                         WHERE denomination_substance = :nomUnique';
        
        $stmtDetails = $this->dal->prepare($queryDetails);
        $stmtDetails->execute(['nomUnique' => $nomUnique]);
        
        return [
            "resultats" => $stmtDetails->fetchAll(PDO::FETCH_ASSOC),
            "isUnique" => true
        ];
    }
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

    public function deleteMedecine($id_famille,$id_medicament) : bool {
        $query = 'DELETE FROM STOCK_MEDICS WHERE id_famille = :id_famille AND id_medicament = :id_medicament';
        $stmt = $this->dal->prepare($query);

        return $stmt->execute(['id_famille' => $id_famille,'id_medicament' => $id_medicament]);
    }

    public function addMedecine($id_famille, $name, $stock, $stockTotal, $id_cat_medicament): bool {
    // Sécurité : Si le total est inférieur au stock actuel, on l'aligne
    if ($stockTotal < $stock) {
        $stockTotal = $stock;
    }

    $query = 'INSERT INTO STOCK_MEDICS (designation_med, quantite, id_famille, total, id_cat_medicament) 
              VALUES (:name, :stock, :id_famille, :stockTotal, :id_cat_medicament)';
    
    $stmt = $this->dal->prepare($query);

    return $stmt->execute([
        'name'       => $name,
        'stock'      => (int)$stock,      // On force le type entier
        'id_famille' => (int)$id_famille,
        'stockTotal' => (int)$stockTotal,
        'id_cat_medicament'       => (int)$id_cat_medicament     // On force le type string
    ]);    
    }


}