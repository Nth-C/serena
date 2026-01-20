<?php
require_once(__DIR__ . '/audit.class.php'); 
require_once(__DIR__ . '/dal.class.php'); 

class ocrDAO {
    private DAL $dal;

    public function __construct() {
        $this->dal = DAL::get();
    }

    public function insertMedsFound($id_personne): array
    {
        //changer attributs
    $query = 'INSERT INTO DOCUMENTS (nom_doc, url, id_famille, id_cat) 
                    VALUES (:nom, :url, :id_famille, :id_cat)';

            $stmt = $this->dal->prepare($query);
            $stmt->execute([
                ':date_deb' => $date_deb,
                ':lieu_dep' => $lieu_dep,
                ':lieu_arr' => $lieu_arr,
                ':id_event' => $id_event
            ]);
    }

    

    
}
?>