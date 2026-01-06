<?php
class CategorieDAO {
    private DAL $dal;

    public function __construct() {
        $this->dal = DAL::get();
    }

    public function getAllCategories(): array
    {
        $query = 'SELECT CAT.* FROM CAT, FAMILLE WHERE CAT.id_famille = FAMILLE.id_famille';
        $stmt = $this->dal->prepare($query);

        $stmt->execute();
        $data = $stmt->fetchAll();

        return $data;
    }

    public function addCategorie($id_famille, $nom){
        $query = 'INSERT INTO CAT (id_famille, nom) VALUES (:id_famille, :nom)';
        $stmt = $this->dal->prepare($query);
        $stmt->execute(['id_famille' => $id_famille, 'nom' => $nom]);
    }

    
}