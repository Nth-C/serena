<?php
require_once(__DIR__ . '/evenement.class.php');
require_once(__DIR__ . '/dal.class.php');

class EvenementDAO{

    private DAL $dal;

    public function __construct()
    {
        $this->dal = DAL::get();
    }

    public function findById(string $id): ?Evenement
    {
        $query = 'SELECT * from evenement where id_event = :id_event';
        $stmt = $this->dal->prepare($query);
        $stmt->execute([':id' => $id]);   
        $result = $stmt->fetch();

        if ($result === false) {
        return null;
        }
    
        return new Evenement($result);
    }
    public function addEvenement($id_famille,$nom, $debut, $fin, $lieu, $description): bool {
        $query = 'INSERT INTO EVENEMENTS (nom,date_deb, date_fin, lieu ,note ,id_famille) VALUES (:nom, :date_deb, :date_fin, :lieu, :note, :id_famille)';
        $stmt = $this->dal->prepare($query);

        return $stmt->execute(['nom' => $nom, 'date_deb' => $debut, 'date_fin' => $fin, 'lieu' => $lieu, 'note' => $description, 'id_famille' => $id_famille]);
    }
    public function getAllEvenementsSemaine($id_famille, $date_debut, $date_fin): array {
    $query = 'SELECT * FROM EVENEMENTS 
              WHERE id_famille = :id_famille 
              AND date_deb BETWEEN :date_debut AND :date_fin
              ORDER BY date_deb ASC';
    
    $stmt = $this->dal->prepare($query);

    $stmt->execute([
        'id_famille' => $id_famille,
        'date_debut' => $date_debut,
        'date_fin'   => $date_fin
    ]);

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $evenements = [];

    foreach($data as $evenement) {
        $evenements[] = new Evenement($evenement); 
    }

    return $evenements;
}

}

?>