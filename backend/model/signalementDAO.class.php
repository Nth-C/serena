<?php
require_once(__DIR__ . '/signalement.class.php');
require_once(__DIR__ . '/dal.class.php');

class SignalementDAO {
    private DAL $dal;

    public function __construct() {
        $this->dal = DAL::get();
    }

    // Récupérer tous les signalements d'une personne
    public function getAllSignalement($id_pers): array {
        $query = 'SELECT * FROM signalements WHERE id_pers_signal = :id_pers';
        
        $stmt = $this->dal->prepare($query);
        $stmt->execute(['id_pers' => $id_pers]);
        $result = $stmt->fetchAll();
        error_log("getAllSignalement result: " . json_encode($result));
        return $result;
    }

    // Ajouter un signalement
    public function addSignalement($sujet, $message, $mail, $id_pers): bool {

        $query = 'INSERT INTO signalements (sujet, message, mail_signal, id_pers_signal, status)
                  VALUES (:sujet, :message, :mail, :id_pers, :status)';

        $stmt = $this->dal->prepare($query);

        return $stmt->execute([
            'sujet'   => $sujet,
            'message' => $message,
            'mail'    => $mail,
            'id_pers' => $id_pers,
            'status'  => 'En cours' // Valeur par défaut
        ]);
    }

    // Supprimer
    public function deleteSignalement($id_signalement, $id_pers): bool {
        // CORRECTION : id_signal
        $query = 'DELETE FROM signalements WHERE id_signal = :id AND id_pers_signal = :id_pers';
        $stmt = $this->dal->prepare($query);
        return $stmt->execute([
            'id'      => $id_signalement,
            'id_pers' => $id_pers
        ]);
    }
    
    // Mettre à jour le statut
    public function updateSignalement($id_signalement, $id_pers, string $status): bool {
        $query = 'UPDATE signalements
                  SET status = :status
                  WHERE id_signal = :id_s AND id_pers_signal = :id_pers';
        $stmt = $this->dal->prepare($query);
        return $stmt->execute([
            'status'  => $status,
            'id_s'    => $id_signalement,
            'id_pers' => $id_pers
        ]);
    }
    // Récupérer l'email d'une personne
    public function getEmail($id_pers) {
        $query = 'SELECT mail FROM personnes WHERE id_personne = :id_pers';
        $stmt = $this->dal->prepare($query);
        $stmt->execute(['id_pers' => $id_pers]);
        $result = $stmt->fetch();
        return $result ? $result['mail'] : null;
    }
}
?>