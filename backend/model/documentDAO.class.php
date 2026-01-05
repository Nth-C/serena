<?php
class DocumentDAO {
    private DAL $dal;

    public function __construct() {
        $this->dal = DAL::get();
    }


    public function addDocument($id_doc,$categorie,$nom,$type){
        $query = 'INSERT INTO DOCUMENT (name, stock) VALUES (:name, :stock)';
        $stmt = $this->dal->prepare($query);
        $stmt->execute(['id_doc' => $id_doc, 'categorie' => $categorie, 'nom' => $nom, 'type']);
    }
    

    public function getOrdonnances($name, $stock) {
        $query = 'INSERT INTO STOCK_MEDICAMENT (name, stock) VALUES (:name, :stock)';
        $stmt = $this->dal->prepare($query);

        return $stmt->execute(['name' => $name, 'stock' => $stock]);
    }

    public function deleteMedecine($id) {
        $query = 'DELETE FROM STOCK_MEDICAMENT WHERE id = :id';
        $stmt = $this->dal->prepare($query);

        return $stmt->execute(['id' => $id]);
    }
}