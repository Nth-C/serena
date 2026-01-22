<?php
require_once(__DIR__ . '/trajet.class.php');
require_once(__DIR__ . '/dal.class.php');

class TrajetDAO {

    private DAL $dal;

    public function __construct()
    {
        $this->dal = DAL::get();
    }

    // ajout d'un trajet
    public function addTrajet($date_deb, $lieu_dep, $lieu_arr, $id_event, $aidant_id, $nom_societe, $id_famille)
    {
        try {
            $this->dal->beginTransaction();
            $query = "INSERT INTO TRAJET (date_deb, lieu_dep, lieu_arr, id_event) 
                      VALUES (:date_deb, :lieu_dep, :lieu_arr, :id_event) 
                      RETURNING id_trajet";
            
            $stmt = $this->dal->prepare($query);
            $stmt->execute([
                ':date_deb' => $date_deb,
                ':lieu_dep' => $lieu_dep,
                ':lieu_arr' => $lieu_arr,
                ':id_event' => $id_event
            ]);

            $result = $stmt->fetch();
            
            if (!$result) {
                throw new Exception("Erreur création trajet : aucun ID retourné.");
            }
            $id_trajet = $result['id_trajet'];

            if (!empty($nom_societe)) {                
                $qSocCheck = "SELECT id_societe FROM SOCIETES WHERE nom = :nom";
                $stmtCheck = $this->dal->prepare($qSocCheck);
                $stmtCheck->execute([':nom' => $nom_societe]);
                $socRes = $stmtCheck->fetch();

                if ($socRes) {
                    $id_societe = $socRes['id_societe'];
                } else {
                    $qSocCreate = "INSERT INTO SOCIETES (nom, adresse) VALUES (:nom, 'Non spécifiée') RETURNING id_societe";
                    $stmtCreate = $this->dal->prepare($qSocCreate);
                    $stmtCreate->execute([':nom' => $nom_societe]);
                    $socNew = $stmtCreate->fetch();
                    $id_societe = $socNew['id_societe'];
                }

                $qCharge = "INSERT INTO CHARGE (id_trajet, id_societe) VALUES (:id_trajet, :id_societe)";
                $stmtCharge = $this->dal->prepare($qCharge);
                $stmtCharge->execute([
                    ':id_trajet' => $id_trajet,
                    ':id_societe' => $id_societe
                ]);
            }
            elseif (!empty($aidant_id)) {

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
                    ':id_famille' => $id_famille, 
                    ':id_trajet'  => $id_trajet
                ]);
            }
        }

            $this->dal->commit();
            return true;

        } catch (Exception $e) {
            $this->dal->rollBack();
            throw $e; 
        }
    }

    // ajoute la personne résponsable du trajet
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


    // renvoie toutes les demandes de trajet de la famille 
    public function getAllDemandeDeTrajet(string $id_famille): array
{
    $query = "SELECT t.* FROM TRAJET t
              JOIN FAMILLE_TRAJET ft ON t.id_trajet = ft.id_trajet
              WHERE ft.id_famille = :id_famille
              AND t.id_trajet NOT IN (SELECT id_trajet FROM EFFECTUE)";

        try {
            $stmt = $this->dal->prepare($query);
            $stmt->execute([':id_famille' => $id_famille]);
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            return [];
        }
    }

    // met à jour un trajet 
    public function updateTrajet($id_event, $date_deb, $lieu_dep, $lieu_arr, $nom_societe, $aidant_id) {
        try {
            $this->dal->beginTransaction();

            $query = "UPDATE TRAJET 
                    SET date_deb = :date_deb, lieu_dep = :lieu_dep, lieu_arr = :lieu_arr
                    WHERE id_event = :id_event 
                    RETURNING id_trajet";
            
            $stmt = $this->dal->prepare($query);
            $stmt->execute([
                ':date_deb' => $date_deb,
                ':lieu_dep' => $lieu_dep,
                ':lieu_arr' => $lieu_arr,
                ':id_event' => $id_event
            ]);

            $result = $stmt->fetch();
            
            if ($result) {
                $id_trajet = $result['id_trajet'];

                $this->dal->prepare("DELETE FROM CHARGE WHERE id_trajet = :id")->execute([':id' => $id_trajet]);
                $this->dal->prepare("DELETE FROM EFFECTUE WHERE id_trajet = :id")->execute([':id' => $id_trajet]);

                if (!empty($nom_societe)) {
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

                    $this->dal->prepare("INSERT INTO CHARGE (id_trajet, id_societe) VALUES (:id, :idsoc)")
                            ->execute([':id' => $id_trajet, ':idsoc' => $id_societe]);
                } 
                elseif (!empty($aidant_id) && $aidant_id !== 'demande') {
                    $this->dal->prepare("INSERT INTO EFFECTUE (id_trajet, id_personne) VALUES (:id, :idp)")
                            ->execute([':id' => $id_trajet, ':idp' => $aidant_id]);
                }
            }

            return $this->dal->commit();
        } catch (Exception $e) {
            $this->dal->rollBack();
            throw $e; 
        }
    }

    // renvoie le trajet de l'événement 
    public function getTrajetsParEvent(string $id_event): array
    {
        try {
            $query = "SELECT t.id_trajet, t.date_deb, t.lieu_dep, t.lieu_arr, t.id_event,
                             e.id_personne as aidant_id,
                             s.nom as societe
                      FROM TRAJET t
                      LEFT JOIN EFFECTUE e ON t.id_trajet = e.id_trajet
                      LEFT JOIN CHARGE c ON t.id_trajet = c.id_trajet
                      LEFT JOIN SOCIETES s ON c.id_societe = s.id_societe
                      WHERE t.id_event = :id_event";
            
            $stmt = $this->dal->prepare($query);
            $stmt->execute([':id_event' => $id_event]);
            
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            return [];
        }
    }
    
}
?>