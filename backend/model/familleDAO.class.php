<?php
require_once(__DIR__ . '/famille.class.php');
require_once(__DIR__ . '/dal.class.php');
class FamilleDAO {
    private DAL $dal;

    public function __construct(?DAL $dal = null) {
    $this->dal = $dal ?: DAL::get();
}


    public function insert(Famille $famille) {
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
    $query = 'DELETE FROM appartient_a 
              WHERE id_famille = :id_f 
              AND id_personne = :id_p';
              
    $stmt = $this->dal->prepare($query);
    
    return $stmt->execute([
        ':id_f' => $id_famille,
        ':id_p' => $id_personne
    ]);
    }

    public function inviterPersonneDansFamille($id_famille_invitee, $id_pers_invitee, $id_pers_qui_invite): bool {
    $query = 'INSERT INTO invitation (id_famille_invitee, id_pers_invitee, id_pers_qui_invite) 
              VALUES (:id_f, :id_p_invitee, :id_p_qui_invite)';
              
    $stmt = $this->dal->prepare($query);
    
    return $stmt->execute([
        ':id_f'           => $id_famille_invitee,
        ':id_p_invitee'    => $id_pers_invitee,
        ':id_p_qui_invite' => $id_pers_qui_invite
    ]);
}

public function deleteInviterPersonneDansFamille($id_famille_invitee, $id_pers_invitee, $id_pers_qui_invite): bool {
    // On supprime la ligne où les trois IDs correspondent
    $query = 'DELETE FROM invitation 
              WHERE id_famille_invitee = :id_f 
              AND id_pers_invitee = :id_p_invitee 
              AND id_pers_qui_invite = :id_p_qui_invite';
              
    $stmt = $this->dal->prepare($query);
    
    return $stmt->execute([
        ':id_f'           => $id_famille_invitee,
        ':id_p_invitee'    => $id_pers_invitee,
        ':id_p_qui_invite' => $id_pers_qui_invite
    ]);
}

    public function getInvitationDetails($id_personne): array {
    // Jointure triple pour avoir l'invitation, l'expéditeur et la famille
    $query = 'SELECT 
                i.id_famille_invitee,
                f.nom AS nom_famille,
                f.description AS desc_famille,
                p.nom AS nom_expediteur,
                p.prenom AS prenom_expediteur,
                p.username AS id_invitation
              FROM invitation i
              JOIN Fams f ON f.id_famille = i.id_famille_invitee
              JOIN PERSONNES p ON p.id_personne = i.id_pers_qui_invite
              WHERE i.id_pers_invitee = :id_p';
              
    $stmt = $this->dal->prepare($query);
    $stmt->execute([
        ':id_p' => $id_personne
    ]);

    // fetchAll est nécessaire pour retourner une liste à React
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

    public function AccepterInvitation($id_personne, $id_famille, $role = "Créateur"): bool {
    try {
        // 1. On commence une transaction pour s'assurer que si une étape échoue, rien n'est modifié
        $this->dal->beginTransaction();

        // 2. On ajoute la personne à la famille (Lien n-n)
        // Note : Vérifiez le nom de votre table de liaison (ici 'appartient_a')
        $queryInsert = 'INSERT INTO appartient_a (id_famille, id_personne,role) 
                        VALUES (:id_f, :id_p,\':role\')';
        $stmtInsert = $this->dal->prepare($queryInsert);
        $stmtInsert->execute([
            ':id_f' => $id_famille,
            ':id_p' => $id_personne,
            ':role' => $role,
        ]);

        // 3. On supprime l'invitation maintenant qu'elle est acceptée
        $queryDelete = 'DELETE FROM invitation 
                        WHERE id_famille_invitee = :id_f 
                        AND id_pers_invitee = :id_p';
        $stmtDelete = $this->dal->prepare($queryDelete);
        $stmtDelete->execute([
            ':id_f' => $id_famille,
            ':id_p' => $id_personne
        ]);

        // 4. On valide les changements
        return $this->dal->commit();

    } catch (Exception $e) {
    $this->dal->rollBack();
    // Renvoie l'erreur réelle pour le debug (à enlever en production)
    throw new Exception("SQL Error: " . $e->getMessage());
}
}

public function RefuserInvitation($id_personne, $id_famille): bool {
    try {
        $this->dal->beginTransaction();

        // On supprime simplement l'invitation correspondante
        $queryDelete = 'DELETE FROM invitation 
                        WHERE id_famille_invitee = :id_f 
                        AND id_pers_invitee = :id_p';
        
        $stmtDelete = $this->dal->prepare($queryDelete);
        $stmtDelete->execute([
            ':id_f' => $id_famille,
            ':id_p' => $id_personne
        ]);

        return $this->dal->commit();

    } catch (Exception $e) {
        if ($this->dal) $this->dal->rollBack();
        // Debug : à loguer ou envoyer selon tes besoins
        throw new Exception("SQL Error (Refuser): " . $e->getMessage());
    }
}

public function QuitterFamille(string $id_personne, string $id_famille): bool {
    try {
        $this->dal->beginTransaction();

        // On supprime la ligne qui lie cet utilisateur à cette famille
        $query = 'DELETE FROM appartient_a 
                  WHERE id_famille = :id_f 
                  AND id_personne = :id_p';
        
        $stmt = $this->dal->prepare($query);
        $res = $stmt->execute([
            ':id_f' => $id_famille,
            ':id_p' => $id_personne
        ]);

        // Si la suppression a fonctionné, on valide
        return $this->dal->commit();

    } catch (Exception $e) {
        if ($this->dal) $this->dal->rollBack();
        throw new Exception("Erreur SQL (Quitter): " . $e->getMessage());
    }
}



    public function getLastInsertedId(): string {
        return $this->dal->lastInsertId();
    }
}