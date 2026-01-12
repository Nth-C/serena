<?php
require_once(__DIR__ . '/famille.class.php');
require_once(__DIR__ . '/dal.class.php');
class FamilleDAO {
    private DAL $dal;

    // Dans FamilleDAO.class.php
    public function __construct(?DAL $dal = null) {
    $this->dal = $dal ?: DAL::get();
}
    /*
    public function insert(Famille $famille): bool {
        $query = 'INSERT INTO fams (nom, description, nom_aide) 
                  VALUES (:nom, :description, :nom_aide)';
        
        $stmt = $this->dal->prepare($query);

        return $stmt->execute([
            ':nom'            => $famille->nom,
            ':description'         => $famille->desc,
            ':nom_aide'           => $famille->nom_aide 
        ]);
    }*/

    public function insert(Famille $famille) {
    // On ajoute RETURNING id_famille à la fin de la requête
    $query = "INSERT INTO fams (nom, description, nom_aide) 
              VALUES (:nom, :description, :nom_aide) 
              RETURNING id_famille";
              
    $stmt = $this->dal->prepare($query);
    
    $res = $stmt->execute([
            ':nom'            => $famille->nom,
            ':description'         => $famille->desc,
            ':nom_aide'           => $famille->nom_aide 
        ]);

    if ($res) {
        // On récupère l'ID généré directement dans le jeu de résultats
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['id_famille'];
    }
    
    return false;
}

    public function update(Famille $famille): bool {
        $query = 'UPDATE fams 
                SET nom = :nom, description = :description, nom_aide = :nom_aide 
                WHERE id_famille = :id';
        
        $stmt = $this->dal->prepare($query);

        return $stmt->execute([
            ':nom'      => $famille->nom,
            ':description'     => $famille->desc,
            ':nom_aide' => $famille->nom_aide,
            ':id'       => $famille->id_famille
        ]);
    }

    public function findByPersonne($id_personne): array {
        $query = 'SELECT f.* FROM FAMS f
                    JOIN APPARTIENT_A a ON f.id_famille = a.id_famille
                    WHERE a.id_personne = :id_pers;';
        
        $stmt = $this->dal->prepare($query);
        $stmt->execute([':id_pers' => $id_personne]);
        
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $resultats = [];

        foreach($data as $row) {
            $resultats[] = new Famille($row);
        }

        return $resultats;
    }
    public function findByName(string $nom): ?Famille {
        $query = 'SELECT * FROM fams WHERE nom = :nom';
        $stmt = $this->dal->prepare($query);
        $stmt->execute([':nom' => $nom]);   
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result === false) {
        return null;
        }
        
        return new Famille($result);
    }

    public function findAll(): array {
        $query = 'SELECT * FROM fams';
        $stmt = $this->dal->prepare($query);
        $stmt->execute();
        
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $resultats = [];

        foreach($data as $row) {
            $resultats[] = new Famille($row);
        }

        return $resultats;
    }

    public function getPersFam($id_famille): array {
    // CORRECTION : On joint PERSONNES avec APPARTIENT_A
    $query = 'SELECT p.*,a.role  FROM PERSONNES p
              JOIN APPARTIENT_A a ON p.id_personne = a.id_personne
              WHERE a.id_famille = :id_famille';
    
    $stmt = $this->dal->prepare($query);
    $stmt->execute(['id_famille' => $id_famille]);
    $data = $stmt->fetchAll();

    $resultats = [];

    foreach($data as $personne) {
        $resultats[] = new Personne($personne);
    }

    return $resultats;
    }

    public function AddPersFam($id_famille, $id_personne, string $role = 'createur'): bool {
        $query = 'INSERT INTO appartient_a (id_famille, id_personne, role) 
                VALUES (:id_f, :id_p, :role)';
        $stmt = $this->dal->prepare($query);
        return $stmt->execute([
            ':id_f' => $id_famille,
            ':id_p' => $id_personne,
            ':role' => $role
        ]);
    }


    public function UpdateRolePersFam($id_famille, $id_personne, $role): bool {
    // On met à jour le champ 'role' là où l'id_famille ET l'id_personne correspondent
    $query = 'UPDATE appartient_a 
              SET role = :role 
              WHERE id_famille = :id_f 
              AND id_personne = :id_p';
              
    $stmt = $this->dal->prepare($query);
    
    return $stmt->execute([
        ':id_f' => $id_famille,
        ':id_p' => $id_personne,
        ':role' => $role
    ]);
    }

    public function deletePersonneDeFamille($id_famille, $id_personne): bool {
    // On supprime la ligne qui correspond au couple famille / personne
    $query = 'DELETE FROM appartient_a 
              WHERE id_famille = :id_f 
              AND id_personne = :id_p';
              
    $stmt = $this->dal->prepare($query);
    
    return $stmt->execute([
        ':id_f' => $id_famille,
        ':id_p' => $id_personne
    ]);
}



    public function getLastInsertedId(): string {
        return $this->dal->lastInsertId();
    }
}