<?php
class MedicamentDAO {
    private DAL $dal;

    public function __construct() {
        $this->dal = DAL::get();
    }

    public function getAll(): array {
        $query = 'SELECT * FROM medicament';
        $stmt = $this->dal->prepare($query);

        $stmt->execute();
        $data = $stmt->fetchAll();

        return $data;
    }

    public function addMedecine($name, $stock) {
        $query = 'INSERT INTO medicament (name, stock) VALUES (:name, :stock)';
        $stmt = $this->dal->prepare($query);

        return $stmt->execute(['name' => $name, 'stock' => $stock]);
    }

    public function deleteMedecine($id) {
        $query = 'DELETE FROM medicament WHERE id = :id';
        $stmt = $this->dal->prepare($query);

        return $stmt->execute(['id' => $id]);
    }
}