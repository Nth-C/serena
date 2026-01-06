<?php

require_once(__DIR__ . '/categorie.class.php');
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
        $query = 'INSERT INTO CAT (nom, id_famille) VALUES (:nom, :id_famille)';
        $stmt = $this->dal->prepare($query);
        return $stmt->execute(['nom' => $nom,'id_famille' => $id_famille]);
    }

    public function deleteCategorie($id_famille,$id_categorie) : bool {
        $query = 'DELETE FROM CAT WHERE id_famille = :id_famille AND id_categorie = :id_categorie';
        $stmt = $this->dal->prepare($query);

        return $stmt->execute(['id_famille' => $id_famille,'id_categorie' => $id_categorie]);
    }

    
}