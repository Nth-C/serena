<?php
class familleDAO {
    private DAL $dal;

    public function __construct() {
        $this->dal = DAL::get();
    }


     public function getPersFam($id_famille): array {
        $query = 'SELECT * FROM PERSONNES WHERE $id_famille = :id_famille';
        $stmt = $this->dal->prepare($query);

        $stmt->execute(['id_famille' => $id_famille]);
        $data = $stmt->fetchAll();

        foreach($data as $medicament){
             $medicaments[] = new Medicament($medicament);
        }

        return $medicaments;
    }


}