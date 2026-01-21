<?php
require_once(__DIR__ . '/evenement.class.php');
require_once(__DIR__ . '/dal.class.php');

class EvenementDAO{

    private DAL $dal;

public function __construct(?DAL $dal = null) {
    // Si on passe une $dal (test), on l'utilise. Sinon, on prend la vraie (prod).
    $this->dal = $dal ?? DAL::get();
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

    public function getFutureEvenements($id_famille): array {
        // On ajoute LEFT JOIN pour inclure les colonnes du trajet si elles existent
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

   public function deleteEvenementRecurrence($id_famille, $id_recurrence): bool {
    try {
        // On démarre la transaction via ton objet DAL
        $this->dal->beginTransaction();

        // 1. Supprimer les charges liées aux trajets de TOUS les événements de la série
        $q0 = 'DELETE FROM CHARGE 
               WHERE id_trajet IN (
                   SELECT id_trajet FROM TRAJET 
                   WHERE id_event IN (SELECT id_event FROM EVENEMENTS WHERE id_recurrence = :id_rec AND id_famille = :id_f)
               )';
        $this->dal->prepare($q0)->execute(['id_rec' => $id_recurrence, 'id_f' => $id_famille]);

        // 2. Supprimer les affectations (EFFECTUE) liées aux trajets de la série
        $q1 = 'DELETE FROM EFFECTUE 
               WHERE id_trajet IN (
                   SELECT id_trajet FROM TRAJET 
                   WHERE id_event IN (SELECT id_event FROM EVENEMENTS WHERE id_recurrence = :id_rec AND id_famille = :id_f)
               )';
        $this->dal->prepare($q1)->execute(['id_rec' => $id_recurrence, 'id_f' => $id_famille]);

        // 3. Supprimer les trajets liés à la série d'événements
        $q2 = 'DELETE FROM TRAJET 
               WHERE id_event IN (SELECT id_event FROM EVENEMENTS WHERE id_recurrence = :id_rec AND id_famille = :id_f)';
        $this->dal->prepare($q2)->execute(['id_rec' => $id_recurrence, 'id_f' => $id_famille]);

        // 4. Supprimer tous les événements de la série
        $q3 = 'DELETE FROM EVENEMENTS WHERE id_famille = :id_f AND id_recurrence = :id_rec';
        $stmt = $this->dal->prepare($q3);
        $res = $stmt->execute([
            'id_f' => $id_famille,
            'id_rec' => $id_recurrence
        ]);

        // On valide
        return $this->dal->commit();

    } catch (Exception $e) {
        // Correction ici : on tente le rollback sans la condition inTransaction()
        // La plupart des drivers PDO gèrent le fait de rollback même si c'est déjà fait
        try {
            $this->dal->rollBack();
        } catch (Exception $rollbackEx) {
            // On ignore l'erreur de rollback si la transaction n'existe pas
        }
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

    public function addAccompagnant($id_event, $id_personne){
        $query = 'INSERT INTO accompagne(id_personne, id_event) VALUES (:id_personne, :id_event)';
        $stmt = $this->dal->prepare($query);
        return $stmt->execute([
            'id_personne' => $id_personne,
            'id_event' => $id_event
        ]);
    }

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