<?php
require_once(__DIR__ . '/evenement.class.php');
require_once(__DIR__ . '/dal.class.php');

class EvenementDAO{

    private DAL $dal;

public function __construct(?DAL $dal = null) {
    $this->dal = $dal ?? DAL::get();
}
    // récupère l'évènement avec son id
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

    // récupère les futures évènements et leur trajet avec l'id de la famille 
    public function getFutureEvenements($id_famille): array {
        $query = 'SELECT e.*, t.id_trajet, t.lieu_dep, t.lieu_arr, t.date_deb as trajet_date 
                FROM EVENEMENTS e
                LEFT JOIN TRAJET t ON e.id_event = t.id_event
                WHERE e.id_famille = :id_famille 
                AND e.date_deb >= CURRENT_DATE
                ORDER BY e.date_deb ASC';
        
        $stmt = $this->dal->prepare($query);
        $stmt->execute(['id_famille' => $id_famille]);
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $evenements = [];
        foreach($data as $row) {
            $evenements[] = new Evenement($row); 
        }
        return $evenements;
    }

    // ajoute un évènement pour la famille avec des informations de l'évènement
    public function addEvenement($id_famille, $nom, $debut, $fin, $lieu, $description, $id_recurrence = null) {
        $query = 'INSERT INTO EVENEMENTS (id_famille, nom, date_deb, date_fin, lieu, note, id_recurrence) 
                VALUES (:id_f, :nom, :deb, :fin, :lieu, :note, :id_recurrence) 
                RETURNING id_event';
        
        $stmt = $this->dal->prepare($query);
        $stmt->execute([
            'id_f'   => $id_famille,
            'nom'    => $nom,
            'deb'    => $debut,
            'fin'    => $fin,
            'lieu'   => $lieu,
            'note'   => $description,
            'id_recurrence' => $id_recurrence,

        ]);

        $result = $stmt->fetch();
        return $result ? $result['id_event'] : false;
    }

    // supprime un évènement avec son id et l'id de la famille
    public function deleteEvenement($id_famille, $id_evenement): bool {
    try {
        $this->dal->beginTransaction();

        $q0 = 'DELETE FROM CHARGE WHERE id_trajet IN (SELECT id_trajet FROM TRAJET WHERE id_event = :id_e)';
        $this->dal->prepare($q0)->execute(['id_e' => $id_evenement]);

        $q1 = 'DELETE FROM EFFECTUE WHERE id_trajet IN (SELECT id_trajet FROM TRAJET WHERE id_event = :id_e)';
        $this->dal->prepare($q1)->execute(['id_e' => $id_evenement]);

        $q2 = 'DELETE FROM TRAJET WHERE id_event = :id_e';
        $this->dal->prepare($q2)->execute(['id_e' => $id_evenement]);

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
   // supprime tout les évènements d"une meme récurrence
   public function deleteEvenementRecurrence($id_famille, $id_recurrence): bool {
    try {
        $this->dal->beginTransaction();

        $q0 = 'DELETE FROM CHARGE 
               WHERE id_trajet IN (
                   SELECT id_trajet FROM TRAJET 
                   WHERE id_event IN (SELECT id_event FROM EVENEMENTS WHERE id_recurrence = :id_rec AND id_famille = :id_f)
               )';
        $this->dal->prepare($q0)->execute(['id_rec' => $id_recurrence, 'id_f' => $id_famille]);

        $q1 = 'DELETE FROM EFFECTUE 
               WHERE id_trajet IN (
                   SELECT id_trajet FROM TRAJET 
                   WHERE id_event IN (SELECT id_event FROM EVENEMENTS WHERE id_recurrence = :id_rec AND id_famille = :id_f)
               )';
        $this->dal->prepare($q1)->execute(['id_rec' => $id_recurrence, 'id_f' => $id_famille]);

        $q2 = 'DELETE FROM TRAJET 
               WHERE id_event IN (SELECT id_event FROM EVENEMENTS WHERE id_recurrence = :id_rec AND id_famille = :id_f)';
        $this->dal->prepare($q2)->execute(['id_rec' => $id_recurrence, 'id_f' => $id_famille]);

        $q3 = 'DELETE FROM EVENEMENTS WHERE id_famille = :id_f AND id_recurrence = :id_rec';
        $stmt = $this->dal->prepare($q3);
        $res = $stmt->execute([
            'id_f' => $id_famille,
            'id_rec' => $id_recurrence
        ]);

        return $this->dal->commit();

    } catch (Exception $e) {
        try {
            $this->dal->rollBack();
        } catch (Exception $rollbackEx) {

        }
        throw $e; 
    }
}




    // récupère tout les évènements de la semaine d'une famille
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

    // met a jour l'évènement avec son id et ses nouvelles informations
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

    //ajoute un accompagnant a l'évènement avec l'id de la personne 
    public function addAccompagnant($id_event, $id_personne){
        $query = 'INSERT INTO accompagne(id_personne, id_event) VALUES (:id_personne, :id_event)';
        $stmt = $this->dal->prepare($query);
        return $stmt->execute([
            'id_personne' => $id_personne,
            'id_event' => $id_event
        ]);
    }

    //récupère l'accompagnant d'un évènement
    public function getAccompagnants($id_event): array {
        $query = 'SELECT a.id_personne, p.prenom, p.nom 
                FROM accompagne a 
                JOIN PERSONNES p ON a.id_personne = p.id_personne 
                WHERE a.id_event = :id_event';
        $stmt = $this->dal->prepare($query);
        $stmt->execute(['id_event' => $id_event]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}

?>