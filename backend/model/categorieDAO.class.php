<?php
class CategorieDAO {
    private DAL $dal;

    public function __construct() {
        $this->dal = DAL::get();
    }

    public function getAllCategories($id_famille): array
    {
        $query = 'SELECT * FROM CAT WHERE id_famille = :id_famille';
        $stmt = $this->dal->prepare($query);

        $stmt->execute(['id_famille' => $id_famille]);
        $data = $stmt->fetchAll();

        if ($data === false) {
        return null;
        }
        
        $categories = [];
        foreach($data as $categorie){
            $categories[] = new Categorie($categorie);
        }
        return $categories;

        
    }

    public function addCategorie($id_famille, $nom){
        $query = 'INSERT INTO CAT (id_famille, nom) VALUES (:id_famille, :nom)';
        $stmt = $this->dal->prepare($query);
        $stmt->execute(['id_famille' => $id_famille, 'nom' => $nom]);
    }

    
}