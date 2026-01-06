<?php

require_once(__DIR__ . '/document.class.php');
class DocumentDAO {
    private DAL $dal;

    public function __construct() {
        $this->dal = DAL::get();
    }


    public function addDocument($id_famille, $id_categorie, $nom, $type){
        $query = 'INSERT INTO DOCUMENT (id_famille, id_cat, nom, type) VALUES (:id_famille, :id_cat, :nom, :type)';
        $stmt = $this->dal->prepare($query);
        
        $stmt->execute([
            'id_famille' => $id_famille, 
            'id_cat'     => $id_categorie,
            'nom'        => $nom, 
            'type'       => $type
        ]);
    }
    public function deleteDocument($id_doc){
        $query = 'DELETE FROM DOCUMENT WHERE id_doc = :id_doc';
        $stmt = $this->dal->prepare($query);
        $stmt->execute(['id_doc' => $id_doc]);
    }

    public function getOrdonnances($id_famille) {

        $query = 'SELECT * FROM DOCUMENT WHERE id_famille = :id_famille AND  '; //attention
        $stmt = $this->dal->prepare($query);

        $stmt->execute(['id_famille' => $id_famille]);
        $result = $stmt->fetchAll();

        if ($result === false) {
        return null;
        }
        
        $ordonnances = [];
        foreach($result as $ordonnance){
            $ordonnances[] = new Ordonnance($ordonnance);
        }
        return $ordonnances;
    }
    

    public function getDocuments($id_famille) {
        $query = 'SELECT * FROM DOCUMENT WHERE id_famille = :id_famille';
        $stmt = $this->dal->prepare($query);

        $stmt->execute(['id_famille' => $id_famille]);
        $result = $stmt->fetch();

        if ($result === false) {
        return null;
        }
    
        $documents = [];
        foreach($result as $document){
            $documents[] = new Document($document);
        }
        return $documents;
    }


    public function getDocumentsDeIdCategorie($id_famille, $id_cat) {
        $query = 'SELECT * FROM DOCUMENT WHERE id_famille = :id_famille AND id_cat = :id_cat';
        $stmt = $this->dal->prepare($query);

        $stmt->execute(['id_famille' => $id_famille, 'id_cat' => $id_cat]);
        $result = $stmt->fetch();

        if ($result === false) {
        return null;
        }
    
        $documents = [];
        foreach($result as $document){
            $documents[] = new Document($document);
        }
        return $documents;
    }
}