<?php
require_once(__DIR__ . '/trajet.class.php');
require_once(__DIR__ . '/dal.class.php');

class TrajetDAO {

    private DAL $dal;

    public function __construct()
    {
        $this->dal = DAL::get();
    }

    public function addTrajet($date_deb, $date_fin, $lieu_dep, $lieu_arr, $id_event, $aidant_id, $nom_societe, $id_famille)
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

            if (!empty($nom_societe)) {
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
            elseif (!empty($aidant_id)) {
            // CAS B : Aidant Interne (Ajout de la logique manquante)
            // On suppose ici une table de liaison nommée 'EFFECTUE' ou 'ACCOMPAGNE' 
            // Ajustez le nom de la table selon votre schéma (ex: EFFECTUE)

            if($aidant_id != "demande"){
            $qAidant = "INSERT INTO EFFECTUE (id_trajet, id_personne) VALUES (:id_trajet, :id_personne)";
            $stmtAidant = $this->dal->prepare($qAidant);
            $stmtAidant->execute([
                ':id_trajet'   => $id_trajet,
                ':id_personne' => $aidant_id
            ]);
            }else{
                $qFamille = "INSERT INTO FAMILLE_TRAJET (id_famille, id_trajet) 
                     VALUES (:id_famille, :id_trajet)";
                $stmtFam = $this->dal->prepare($qFamille);
                $stmtFam->execute([
                    ':id_famille' => $id_famille, // Variable récupérée via la session ou paramètre
                    ':id_trajet'  => $id_trajet
                ]);
            }
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

    public function AjouterPersonneAuTrajet(string $id_trajet,string $id_personne): bool
    {
        $this->dal->beginTransaction();
        $qLink = "INSERT INTO EFFECTUE (id_trajet, id_personne) VALUES (:id_trajet, :id_personne)";
                $stmtLink = $this->dal->prepare($qLink);
                $stmtLink->execute([
                    ':id_trajet' => $id_trajet,
                    ':id_personne' => $id_personne,
                ]);     
        

        return $this->dal->commit();;
    }


    public function getAllDemandeDeTrajet(string $id_famille): array
{
    // On sélectionne les trajets liés directement à l'ID famille via la table FAMILLE_TRAJET
    // Et on exclut ceux qui ont déjà un aidant affecté dans la table EFFECTUE
    $query = "SELECT t.* FROM TRAJET t
              JOIN FAMILLE_TRAJET ft ON t.id_trajet = ft.id_trajet
              WHERE ft.id_famille = :id_famille
              AND t.id_trajet NOT IN (SELECT id_trajet FROM EFFECTUE)";

        try {
            $stmt = $this->dal->prepare($query);
            $stmt->execute([':id_famille' => $id_famille]);
            
            // On récupère toutes les lignes
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            // En cas d'erreur, on retourne un tableau vide
            return [];
        }
    }

    public function updateTrajet($id_event, $date_deb, $date_fin, $lieu_dep, $lieu_arr, $nom_societe) {
        try {
            $this->dal->beginTransaction();

            // 1. Mise à jour des informations de base du trajet lié à l'événement
            $query = "UPDATE TRAJET 
                    SET date_deb = :date_deb, date_fin = :date_fin, lieu_dep = :lieu_dep, lieu_arr = :lieu_arr 
                    WHERE id_event = :id_event 
                    RETURNING id_trajet";
            
            $stmt = $this->dal->prepare($query);
            $stmt->execute([
                ':date_deb' => $date_deb,
                ':date_fin' => $date_fin,
                ':lieu_dep' => $lieu_dep,
                ':lieu_arr' => $lieu_arr,
                ':id_event' => $id_event
            ]);

            $result = $stmt->fetch();
            
            // Si un trajet existe et qu'une société est mentionnée, on met à jour la liaison
            if ($result && !empty($nom_societe)) {
                $id_trajet = $result['id_trajet'];

                // Vérifier/Créer la société (logique identique à addTrajet)
                $qSocCheck = "SELECT id_societe FROM SOCIETES WHERE nom = :nom";
                $stmtCheck = $this->dal->prepare($qSocCheck);
                $stmtCheck->execute([':nom' => $nom_societe]);
                $socRes = $stmtCheck->fetch();

                $id_societe = $socRes ? $socRes['id_societe'] : null;

                if (!$id_societe) {
                    $qSocCreate = "INSERT INTO SOCIETES (nom, adresse) VALUES (:nom, 'Non spécifiée') RETURNING id_societe";
                    $stmtCreate = $this->dal->prepare($qSocCreate);
                    $stmtCreate->execute([':nom' => $nom_societe]);
                    $socNew = $stmtCreate->fetch();
                    $id_societe = $socNew['id_societe'];
                }

                // Mise à jour ou insertion dans la table CHARGE
                $qCharge = "INSERT INTO CHARGE (id_trajet, id_societe) 
                            VALUES (:id_trajet, :id_societe) 
                            ON CONFLICT (id_trajet) DO UPDATE SET id_societe = EXCLUDED.id_societe";
                $stmtCharge = $this->dal->prepare($qCharge);
                $stmtCharge->execute([
                    ':id_trajet' => $id_trajet,
                    ':id_societe' => $id_societe
                ]);
            }

            return $this->dal->commit();
        } catch (Exception $e) {
            $this->dal->rollBack();
            throw $e; 
        }
    }
    
}
?>