<?php
class StockDAO {
    private DAL $dal;

    public function __construct() {
        $this->dal = DAL::get();
    }



    public function getNbMedicament($stock,$nomMedicament) {
        $query = 'SELECT count(*) FROM STOCK_MEDICAMENT WHERE designation_medicament LIKE :nomMedicament';
        $stmt = $this->dal->prepare($query);

        return $stmt->execute(['nomMedicament' => $nomMedicament]);
    }

    public function getAll(): array {
        $query = 'SELECT * FROM STOCK_MEDICAMENT';
        $stmt = $this->dal->prepare($query);

        $stmt->execute();
        $data = $stmt->fetchAll();

        return $data;
    }

    public function addMedecine($name, $stock) {
        $query = 'INSERT INTO STOCK_MEDICAMENT (name, stock) VALUES (:name, :stock)';
        $stmt = $this->dal->prepare($query);

        return $stmt->execute(['name' => $name, 'stock' => $stock]);
    }

    public function deleteMedecine($id) {
        $query = 'DELETE FROM STOCK_MEDICAMENT WHERE id = :id';
        $stmt = $this->dal->prepare($query);

        return $stmt->execute(['id' => $id]);
    }
}