<?php
require_once(__DIR__ . '/rapport.class.php');
require_once(__DIR__ . '/dal.class.php');

class RapportDAO {
    private DAL $dal;

    public function __construct() {
        $this->dal = DAL::get();
    }


    public function getRapportsDuJour($id_famille) {
        $query = "SELECT r.*, p.prenom as auteur 
                  FROM RAPPORTS r 
                  JOIN PERSONNES p ON r.id_personne = p.id_personne
                  WHERE r.id_famille = :id_famille AND r.date = CURRENT_DATE
                  ORDER BY r.heure DESC";
        $stmt = $this->dal->prepare($query);
        $stmt->execute(['id_famille' => $id_famille]);
        return $stmt->fetchAll();
    }

    public function getAllRapports($id_famille) {
        $query = "SELECT r.*, p.prenom as auteur 
                  FROM RAPPORTS r 
                  JOIN PERSONNES p ON r.id_personne = p.id_personne
                  WHERE r.id_famille = :id_famille
                  ORDER BY r.heure DESC";
        $stmt = $this->dal->prepare($query);
        $stmt->execute(['id_famille' => $id_famille]);
        return $stmt->fetchAll();
    }

    public function getDernierRapport($id_famille) {
        $query = "SELECT r.*, p.prenom as auteur 
                  FROM RAPPORTS r 
                  JOIN PERSONNES p ON r.id_personne = p.id_personne
                  WHERE r.id_famille = :id_famille 
                  ORDER BY r.date DESC, r.heure DESC 
                  LIMIT 1";
        $stmt = $this->dal->prepare($query);
        $stmt->execute(['id_famille' => $id_famille]);
        return $stmt->fetchAll();
    }

    public function getMedicsByRapport($id_rapport) {
        $query = 'SELECT s.designation_med as nom, c.nombre_medic_conso as quantite, s.id_medicament
                  FROM CONSO c 
                  JOIN STOCK_MEDICS s ON c.id_medicament = s.id_medicament
                  WHERE c.id_rapport = :id';
        $stmt = $this->dal->prepare($query);
        $stmt->execute(['id' => $id_rapport]);
        return $stmt->fetchAll();
    }


    public function addRapport($id_famille, $id_personne, $description, $nom) {
        $query = 'INSERT INTO RAPPORTS (nom, description, date, heure, id_famille, id_personne) 
                  VALUES (:nom, :description, CURRENT_DATE, CURRENT_TIME, :id_famille, :id_personne)
                  RETURNING id_rapport';
        $stmt = $this->dal->prepare($query);
        $stmt->execute(['nom'=>$nom, 'description'=>$description, 'id_famille'=>$id_famille, 'id_personne'=>$id_personne]);
        $res = $stmt->fetch();
        return $res ? $res['id_rapport'] : false;
    }

    public function addMedicToConso($id_medicament, $id_rapport, $nombre) {
        $query = 'INSERT INTO CONSO (id_medicament, id_rapport, nombre_medic_conso) VALUES (:id_m, :id_r, :n)';
        $stmt = $this->dal->prepare($query);
        return $stmt->execute(['id_m'=>$id_medicament, 'id_r'=>$id_rapport, 'n'=>$nombre]);
    }

    public function updateMedicStock($id_m, $qte) {
        $query = 'UPDATE STOCK_MEDICS SET quantite = quantite - :q WHERE id_medicament = :id AND quantite >= :q';
        $stmt = $this->dal->prepare($query);
        return $stmt->execute(['q'=>(int)$qte, 'id'=>$id_m]);
    }

    public function restockMedic($id_m, $qte) {
    try {
        // 1. Récupérer la quantité actuelle pour vérifier le seuil
        $querySelect = 'SELECT quantite FROM STOCK_MEDICS WHERE id_medicament = :id';
        $stmtSelect = $this->dal->prepare($querySelect);
        $stmtSelect->execute(['id' => $id_m]);
        $result = $stmtSelect->fetch();

        if (!$result) {
            throw new Exception("Médicament introuvable.");
        }

        $stockActuel = (int)$result['quantite'];
        $nouveauStock = $stockActuel + (int)$qte;

        // 2. Vérification : Interdire un stock négatif
        if ($nouveauStock < 0) {
            throw new Exception("Opération impossible : stock insuffisant (actuel : $stockActuel).");
        }

        // 3. Mise à jour si tout est bon
        $queryUpdate = 'UPDATE STOCK_MEDICS SET quantite = :q_new WHERE id_medicament = :id';
        $stmtUpdate = $this->dal->prepare($queryUpdate);
        
        return $stmtUpdate->execute([
            'q_new' => $nouveauStock, 
            'id'    => $id_m
        ]);

    } catch (Exception $e) {
        // On propage l'erreur pour qu'elle soit attrapée par le contrôleur
        throw $e;
    }
}

    public function clearConso($id_rapport) {
        $query = 'DELETE FROM CONSO WHERE id_rapport = :id';
        $stmt = $this->dal->prepare($query);
        return $stmt->execute(['id' => $id_rapport]);
    }

    public function updateRapportInfos($id, $nom, $desc) {
        $query = 'UPDATE RAPPORTS SET nom = :nom, description = :desc WHERE id_rapport = :id';
        $stmt = $this->dal->prepare($query);
        return $stmt->execute(['nom'=>$nom, 'desc'=>$desc, 'id'=>$id]);
    }

    public function deleteRapport($id_rapport, $id_famille) {
        $query = 'DELETE FROM RAPPORTS WHERE id_rapport = :id AND id_famille = :id_f';
        $stmt = $this->dal->prepare($query);
        return $stmt->execute([
            'id'   => $id_rapport,
            'id_f' => $id_famille
        ]);
    }

    public function createFullRapport($id_famille, $id_personne, $nom, $description, $medicaments) {
    try {
        $this->dal->beginTransaction();

        // 1. Création du rapport
        $sql = "INSERT INTO RAPPORTS (id_famille, id_personne, nom, description) 
                VALUES (?, ?, ?, ?) RETURNING id_rapport";
        
        $stmt = $this->dal->prepare($sql);
        $stmt->execute([$id_famille, $id_personne, $nom, $description]);
        
        $row = $stmt->fetch();
        if (!$row) {
            throw new Exception("Erreur lors de la récupération de l'ID du rapport.");
        }
        $id_rapport = $row['id_rapport'];

        
        // 2. Gestion des médicaments
        if (!empty($medicaments) && is_array($medicaments)) {
            foreach ($medicaments as $med) {
                $id_med = $med['id_med'];
                $qte_demandee = (int)$med['quantite'];

                if ($qte_demandee <= 0) continue;

                // CORRECTION : Utilisation de "designation_med" au lieu de "nom"
                $sqlStock = "SELECT quantite, designation_med FROM STOCK_MEDICS WHERE id_medicament = ?";
                $stmtStock = $this->dal->prepare($sqlStock);
                $stmtStock->execute([$id_med]);
                $stockData = $stmtStock->fetch();

                if (!$stockData) {
                    throw new Exception("Médicament introuvable (ID: $id_med)");
                }
                
                if ($stockData['quantite'] < $qte_demandee) {
                    $nomMed = $stockData['designation_med'] ?? "Inconnu";
                    throw new Exception("Stock insuffisant pour : $nomMed (Restant : " . $stockData['quantite'] . ")");
                }

                // Note : Vérifie si ta table s'appelle CONSO ou CONSOMMER (tu as utilisé les deux dans ton code)
                $sqlConso = "INSERT INTO CONSO (id_medicament, id_rapport, nombre_medic_conso) VALUES (?, ?, ?)";
                $this->dal->prepare($sqlConso)->execute([$id_med, $id_rapport, $qte_demandee]);

                $sqlUpdate = "UPDATE STOCK_MEDICS SET quantite = quantite - ? WHERE id_medicament = ?";
                $this->dal->prepare($sqlUpdate)->execute([$qte_demandee, $id_med]);
            }
        }

        $this->dal->commit();
        return true;

    } catch (Exception $e) {
        $this->dal->rollBack();
        throw $e; 
    }
}
}
