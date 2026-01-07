<?php

require_once(__DIR__ . '/document.class.php');
class DocumentDAO {
    private DAL $dal;

    // Dans DocumentDAO.php

public function __construct(DAL $dal = null) {
    // pour faire les tests
    $this->dal = $dal ?? DAL::get();
}


    public function addDocument($id_famille, $id_categorie, $nom): bool{
        $query = 'INSERT INTO DOCUMENTS (id_famille, id_cat, nom_doc) VALUES (:id_famille, :id_cat, :nom)';
        $stmt = $this->dal->prepare($query);
        
        return $stmt->execute([
            'id_famille' => $id_famille, 
            'id_cat'     => $id_categorie,
            'nom'        => $nom
        ]);
    }
    public function deleteDocument($id_document): bool{
        $query = 'DELETE FROM DOCUMENTS WHERE id_document = :id_document';
        $stmt = $this->dal->prepare($query);
        return $stmt->execute(['id_document' => $id_document]);
    }

    public function getOrdonnances($id_famille) {

        $query = 'SELECT * FROM DOCUMENTS WHERE id_famille = :id_famille AND  '; //attention
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
        $query = 'SELECT * FROM DOCUMENTS WHERE id_famille = :id_famille';
        $stmt = $this->dal->prepare($query);

        $stmt->execute(['id_famille' => $id_famille]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (!$result) { 
            return []; 
        }
    
        $documents = [];
        foreach($result as $document){
            $documents[] = new Document($document);
        }
        return $documents;
    }


    public function getDocumentsDeIdCategorie($id_famille, $id_cat) {
        $query = 'SELECT * FROM DOCUMENTS WHERE id_famille = :id_famille AND id_cat = :id_cat';
        $stmt = $this->dal->prepare($query);

        $stmt->execute(['id_famille' => $id_famille, 'id_cat' => $id_cat]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (!$result) { 
            return []; 
        }
    
        $documents = [];
        foreach($result as $document){
            $documents[] = new Document($document);
        }
        return $documents;
    }
}