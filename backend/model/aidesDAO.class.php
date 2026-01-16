<?php
require_once(__DIR__ . '/dal.class.php');

class AideDAO {
    private DAL $dal;

    public function __construct() {
        $this->dal = DAL::get();
    }

    public function getAllAides(): array {
        $query = "SELECT * FROM aides_fin"; 
        $stmt = $this->dal->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll();
    }
}