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
    // model/evenementDAO.class.php

    public function getFutureEvenements($id_famille): array {
        // On récupère les événements d'aujourd'hui et du futur
        $query = 'SELECT * FROM EVENEMENTS 
                WHERE id_famille = :id_famille 
                AND date_deb >= CURRENT_DATE
                ORDER BY date_deb ASC';
        
        $stmt = $this->dal->prepare($query);
        $stmt->execute(['id_famille' => $id_famille]);

        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $evenements = [];

        foreach($data as $row) {
            $evenements[] = new Evenement($row); 
        }

        return $evenements;
    }

    
    public function addEvenement($id_famille,$nom, $debut, $fin, $lieu, $description): bool {
        $query = 'INSERT INTO EVENEMENTS (nom,date_deb, date_fin, lieu ,note ,id_famille) VALUES (:nom, :date_deb, :date_fin, :lieu, :note, :id_famille)';
        $stmt = $this->dal->prepare($query);

        return $stmt->execute(['nom' => $nom, 'date_deb' => $debut, 'date_fin' => $fin, 'lieu' => $lieu, 'note' => $description, 'id_famille' => $id_famille]);
    }

    public function deleteEvenement($id_famille, $id_evenement): bool {
    try {
        $this->dal->beginTransaction();

        // 1. On nettoie la table CHARGE (via les trajets de l'event)
        $q0 = 'DELETE FROM CHARGE WHERE id_trajet IN (SELECT id_trajet FROM TRAJET WHERE id_event = :id_e)';
        $this->dal->prepare($q0)->execute(['id_e' => $id_evenement]);

        // 2. On nettoie la table EFFECTUE (via les trajets de l'event)
        $q1 = 'DELETE FROM EFFECTUE WHERE id_trajet IN (SELECT id_trajet FROM TRAJET WHERE id_event = :id_e)';
        $this->dal->prepare($q1)->execute(['id_e' => $id_evenement]);

        // 3. On nettoie la table TRAJET
        $q2 = 'DELETE FROM TRAJET WHERE id_event = :id_e';
        $this->dal->prepare($q2)->execute(['id_e' => $id_evenement]);

        // 4. On supprime l'événement final
        $q3 = 'DELETE FROM EVENEMENTS WHERE id_famille = :id_f AND id_event = :id_e';
        $stmt = $this->dal->prepare($q3);
        $stmt->execute([
            'id_f' => $id_famille,
            'id_e' => $id_evenement
        ]);

        return $this->dal->commit();
    } catch (Exception $e) {
        $this->dal->rollBack();
        throw $e; 
    }
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

    public function updateEvenement($id_event, $nom, $debut, $fin, $lieu, $description): bool {
    $query = 'UPDATE EVENEMENTS 
              SET nom = :nom, date_deb = :date_deb, date_fin = :date_fin, lieu = :lieu, note = :note 
              WHERE id_event = :id_event';
    $stmt = $this->dal->prepare($query);

    return $stmt->execute([
        'nom' => $nom, 
        'date_deb' => $debut, 
        'date_fin' => $fin, 
        'lieu' => $lieu, 
        'note' => $description, 
        'id_event' => $id_event
    ]);
}
    

}

?>