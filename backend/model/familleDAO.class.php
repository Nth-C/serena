<?php
class familleDAO {
    private DAL $dal;

    public function __construct() {
        $this->dal = DAL::get();
    }

    /**
     * @return Personne[]
     */
    public function getPersFam($id_famille): array {
        // 1. Correction SQL : on met le nom de la colonne (ex: id_famille), pas la variable PHP ($...)
        // Assurez-vous que le nom de la colonne dans la BDD est bien 'id_famille'
        $query = 'SELECT * FROM PERSONNES WHERE id_famille = :id_famille';
        
        $stmt = $this->dal->prepare($query);
        $stmt->execute(['id_famille' => $id_famille]);
        $data = $stmt->fetchAll();

        // 2. Initialisation d'un tableau vide pour stocker les objets
        $resultats = [];

        // 3. Correction de la boucle
        foreach($data as $row) {
            // On crée l'objet à partir des données de la ligne (row)
            // et on l'ajoute dans le tableau de résultats
            $resultats[] = new Personne($row);
        }

        // 4. On retourne le tableau d'objets
        return $resultats;
    }
}