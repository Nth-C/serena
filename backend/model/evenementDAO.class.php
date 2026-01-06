<?php
require_once(__DIR__ . '/evenement.class.php');
require_once(__DIR__ . '/dal.class.php');

class EvenementDAO{

    private DAL $dal;

    public function __construct()
    {
        $this->dal = DAL::get();
    }

    public function findById(string $id): ?Evenement
    {
        $query = 'SELECT * from evenement where id_event = :id_event';
        $stmt = $this->dal->prepare($query);
        $stmt->execute([':id' => $id]);   
        $result = $stmt->fetch();

        if ($result === false) {
        return null;
        }
    
        return new Evenement($result);
    }
    public function addEvenement($id_event, $id_famille,$titre, $debut, $fin, $lieu, $description): bool {
        $query = 'INSERT INTO STOCK_MEDICS (designation_med, quantite,id_famille) VALUES (:name, :stock, :id_famille)';
        $stmt = $this->dal->prepare($query);

        return $stmt->execute(['name' => $name, 'stock' => $stock, 'id_famille' => $id_famille]);
    }

}

?>