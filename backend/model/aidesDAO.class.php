<?php
require_once(__DIR__ . '/dal.class.php');

class AidesDAO {
    private DAL $dal;

    public function __construct() {
        $this->dal = DAL::get();
    }

    public function getAllAides(): array {
        $query = "SELECT * FROM aide_finance"; 
        $stmt = $this->dal->prepare($query);
        $stmt->execute();
        // Utilisation de FETCH_ASSOC pour une structure JSON propre
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}