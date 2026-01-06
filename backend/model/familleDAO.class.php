<?php
class familleDAO {
    private DAL $dal;

    public function __construct() {
        $this->dal = DAL::get();
    }

    /**
     * @return Personne[]
     */
    public function getPersFam($id_famille): array {
  
        $query = 'SELECT * FROM PERSONNES WHERE id_famille = :id_famille';
        
        $stmt = $this->dal->prepare($query);
        $stmt->execute(['id_famille' => $id_famille]);
        $data = $stmt->fetchAll();

        $resultats = [];

        foreach($data as $row) {

            $resultats[] = new Personne($row);
        }

        return $resultats;
    }

     public function AddPersFam($id_famille,$id_personne): array {
        $query = 'INSERT INTO appartient_a (id_famille, id_personne) VALUES (:id_famille, :id_personne)';
        $stmt = $this->dal->prepare($query);
        $stmt->execute([
            'id_famille'  => $id_famille,
            'id_personne' => $id_personne
        ]);
    }
}