<?php
require_once(__DIR__ . '/trajet.class.php');
require_once(__DIR__ . '/dal.class.php');

class TrajetDAO {

    private DAL $dal;

    public function __construct()
    {
        $this->dal = DAL::get();
    }

    public function addTrajet($date_deb, $date_fin, $lieu_dep, $lieu_arr, $id_event, $aidant_id, $nom_societe)
    {
        try {
            // Démarrage de la transaction (sécurité)
            $this->dal->beginTransaction();

            // 1. Insertion dans TRAJET
            // J'ai retiré 'demande_trajet' et 'TRUE' de la requête
            $query = "INSERT INTO TRAJET (date_deb, date_fin, lieu_dep, lieu_arr, id_event) 
                      VALUES (:date_deb, :date_fin, :lieu_dep, :lieu_arr, :id_event) 
                      RETURNING id_trajet";
            
            $stmt = $this->dal->prepare($query);
            $stmt->execute([
                ':date_deb' => $date_deb,
                ':date_fin' => $date_fin,
                ':lieu_dep' => $lieu_dep,
                ':lieu_arr' => $lieu_arr,
                ':id_event' => $id_event
            ]);

            // Récupération de l'UUID créé
            $result = $stmt->fetch();
            
            if (!$result) {
                throw new Exception("Erreur création trajet : aucun ID retourné.");
            }
            $id_trajet = $result['id_trajet'];

            // 2. Gestion des liaisons (Aidant OU Société)

            if (!empty($aidant_id)) {
                // Cas A : C'est un Aidant -> Table EFFECTUE
                $qLink = "INSERT INTO EFFECTUE (id_trajet, id_personne) VALUES (:id_trajet, :id_personne)";
                $stmtLink = $this->dal->prepare($qLink);
                $stmtLink->execute([
                    ':id_trajet' => $id_trajet,
                    ':id_personne' => $aidant_id
                ]);

            } elseif (!empty($nom_societe)) {
                // Cas B : C'est une Société -> Tables SOCIETES et CHARGE
                
                // Vérifier si la société existe déjà
                $qSocCheck = "SELECT id_societe FROM SOCIETES WHERE nom = :nom";
                $stmtCheck = $this->dal->prepare($qSocCheck);
                $stmtCheck->execute([':nom' => $nom_societe]);
                $socRes = $stmtCheck->fetch();

                if ($socRes) {
                    $id_societe = $socRes['id_societe'];
                } else {
                    // Création de la société
                    $qSocCreate = "INSERT INTO SOCIETES (nom, adresse) VALUES (:nom, 'Non spécifiée') RETURNING id_societe";
                    $stmtCreate = $this->dal->prepare($qSocCreate);
                    $stmtCreate->execute([':nom' => $nom_societe]);
                    $socNew = $stmtCreate->fetch();
                    $id_societe = $socNew['id_societe'];
                }

                // Liaison Table CHARGE
                $qCharge = "INSERT INTO CHARGE (id_trajet, id_societe) VALUES (:id_trajet, :id_societe)";
                $stmtCharge = $this->dal->prepare($qCharge);
                $stmtCharge->execute([
                    ':id_trajet' => $id_trajet,
                    ':id_societe' => $id_societe
                ]);
            }

            // Validation finale
            $this->dal->commit();
            return true;

        } catch (Exception $e) {
            // Annulation en cas d'erreur
            $this->dal->rollBack();
            // Permet de voir l'erreur dans le contrôleur
            throw $e; 
        }
    }

    // ... Le reste de tes méthodes (findById, demandeDeTrajet) reste inchangé
    public function findById(string $id): ?Trajet
    {
        $query = 'SELECT * from trajet where id_trajet = :id'; // Attention : id_trajet dans ton CREATE TABLE, pas id
        $stmt = $this->dal->prepare($query);
        $stmt->execute([':id' => $id]);   
        $result = $stmt->fetch();

        if ($result === false) {
            return null;
        }
    
        return new Trajet($result);
    }

    public function demandeDeTrajet(string $id_famille): array
    {
        $query = 'SELECT TRAJET.* FROM TRAJET,EVENEMENTS WHERE TRAJET.demande_trajet = TRUE AND TRAJET.id_event = EVENEMENTS.id_event AND EVENEMENTS.id_famille = :id_famille';
        $stmt = $this->dal->prepare($query);

        $stmt->execute([':id_famille' => $id_famille]);
        $data = $stmt->fetchAll();
        
         $trajets = [];
        foreach($data as $trajet){
             $trajets[] = new Trajet($trajet);
        }

        return $trajets;
    }
}
?>