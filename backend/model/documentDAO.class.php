<?php
class DocumentDAO {
    private DAL $dal;

    public function __construct() {
        $this->dal = DAL::get();
    }


    public function addDocument($id_doc,$categorie,$nom,$type){
        $query = 'INSERT INTO DOCUMENT (id_doc, categorie, nom, type) VALUES (:id_doc, :categorie, :nom, :type)';
        $stmt = $this->dal->prepare($query);
        $stmt->execute(['id_doc' => $id_doc, 'categorie' => $categorie, 'nom' => $nom, 'type'=>$type]);
    }

    public function deleteDocument($id_doc){
        $query = 'DELETE FROM DOCUMENT WHERE id_doc = :id_doc)';
        $stmt = $this->dal->prepare($query);
        $stmt->execute(['id_doc' => $id_doc]);
    }

    public function getOrdonnances($id_famille) {
        $query = 'SELECT * FROM DOCUMENT WHERE id_famille = :id_famille AND categorie = "ordonnance" ';
        $stmt = $this->dal->prepare($query);

        return $stmt->execute(['id_famille' => $id_famille]);
    }
    

    public function getDocuments($id_famille) {
        $query = 'SELECT * FROM DOCUMENT WHERE id_famille = :id_famille';
        $stmt = $this->dal->prepare($query);

        return $stmt->execute(['id_famille' => $id_famille]);
    }
}