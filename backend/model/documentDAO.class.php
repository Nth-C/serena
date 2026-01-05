<?php
class DocumentDAO {
    private DAL $dal;

    public function __construct() {
        $this->dal = DAL::get();
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