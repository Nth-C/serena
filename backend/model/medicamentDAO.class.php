<?php
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
        $query = 'SELECT * FROM STOCK_MEDICS WHERE id_famille = :id_famille';
        $stmt = $this->dal->prepare($query);

        $stmt->execute(['id_famille' => $id_famille]);
        $data = $stmt->fetchAll();

        $medicaments = [];
        foreach($data as $medicament){
             $medicaments[] = new Medicament($medicament);
        }

        return $medicaments;
    }

    // A MODIFIER PAS ENCORE FONCTIONNELL
    public function addMedecine($id_famille,$name, $stock) {
        $query = 'INSERT INTO STOCK_MEDICS (designation_med, stock,id_famille) VALUES (:name, :stock, :id_famille)';
        $stmt = $this->dal->prepare($query);

        $stmt->execute(['name' => $name, 'stock' => $stock, 'id_famille' => $id_famille]);
    }

    public function deleteMedecine($id_famille,$id_medicament) {
        $query = 'DELETE FROM STOCK_MEDICS WHERE id_famille = :id_famille AND id_medicament = :id_medicament';
        $stmt = $this->dal->prepare($query);

        $stmt->execute(['id_famille' => $id_famille,'id_medicament' => $id_medicamentd]);
    }
}