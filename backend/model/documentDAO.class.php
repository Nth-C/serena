<?php

require_once(__DIR__ . '/document.class.php');
class DocumentDAO {
    private DAL $dal;


public function __construct(?DAL $dal = null) {
    $this->dal = $dal ?? DAL::get();
}

    // récupère les documents des categories
    public function getDocumentsParCategorie(string $id_famille): array {
        $query = 'SELECT c.id_cat, c.nom AS cat_nom, 
                         d.id_doc, d.nom_doc, d.url, d.type
                  FROM CAT c
                  LEFT JOIN DOCUMENTS d ON c.id_cat = d.id_cat
                  WHERE c.id_famille = :id_famille
                  ORDER BY c.nom ASC';
        
        $stmt = $this->dal->prepare($query);
        $stmt->execute(['id_famille' => $id_famille]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $categories = [];
        foreach ($result as $row) {
            $idCat = $row['id_cat'];
            
            if (!isset($categories[$idCat])) {
                $categories[$idCat] = [
                    'id_cat' => $idCat,
                    'nom' => $row['cat_nom'],
                    'documents' => []
                ];
            }

            if ($row['id_doc']) {
                $categories[$idCat]['documents'][] = [
                    'id_document' => $row['id_doc'],
                    'nom_doc' => $row['nom_doc'],
                    'url' => $row['url'],
                    'type' => $row['type']
                ];
            }
        }
        return array_values($categories);
    }

    // ajoute un document a la base de donnée dans une categorie d'une famille avec des informations du document
    public function addDocument(string $id_famille, string $id_categorie, string $nom, string $url): bool {
        $query = 'INSERT INTO DOCUMENTS (nom_doc, url, id_famille, id_cat) 
                  VALUES (:nom, :url, :id_famille, :id_cat)';
        $stmt = $this->dal->prepare($query);
        
        return $stmt->execute([
            'id_famille' => $id_famille, 
            'id_cat'     => $id_categorie,
            'nom'        => $nom,
            'url'        => $url
        ]);
    }

    // récupère le document avec son id
    public function getDocumentById(string $id_doc) {
        $query = 'SELECT * FROM DOCUMENTS WHERE id_doc = :id_doc';
        $stmt = $this->dal->prepare($query);
        $stmt->execute(['id_doc' => $id_doc]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    // efface le document de la base de donnée
    public function deleteDocument(string $id_doc): bool {
        $query = 'DELETE FROM DOCUMENTS WHERE id_doc = :id_doc';
        $stmt = $this->dal->prepare($query);
        return $stmt->execute(['id_doc' => $id_doc]);
    }


    
    // récupère les documents d'une famille
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

    // récupère les documents d'une categorie
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