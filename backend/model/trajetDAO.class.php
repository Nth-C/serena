<?php
require_once(__DIR__ . '/trajet.class.php');
require_once(__DIR__ . '/dal.class.php');

class TrajetDAO{

    private DAL $dal;

    public function __construct()
    {
        $this->dal = DAL::get();
    }

    public function findById(string $id): ?Trajet
    {
        $query = 'SELECT * from trajet where id = :id';
        $stmt = $this->dal->prepare($query);
        $stmt->execute([':id' => $id]);   
        $result = $stmt->fetch();

        if ($result === false) {
        return null;
        }
    
        return new Trajet($result);
    }
}

?>