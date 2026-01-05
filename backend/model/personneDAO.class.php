<?php
require_once(__DIR__ . '/personne.class.php');
require_once(__DIR__ . '/dal.class.php');

class PersonneDAO{

    private DAL $dal;

    public function __construct()
    {
        $this->dal = DAL::get();
    }

    public function findByUsername(string $username): ?Personne
    {
        $query = 'SELECT * from personne where login = :login';
        $stmt = $this->dal->prepare($query);
        $stmt->execute([':login' => $username]);   
        $result = $stmt->fetch();

        if ($result === false) {
        return null;
        }
    
        return new Personne($result);
    }
}

?>