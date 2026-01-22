<?php
require_once(__DIR__ . '/famille.class.php');
require_once(__DIR__ . '/dal.class.php');
class FamilleDAO {
    private DAL $dal;

    public function __construct(?DAL $dal = null) {
    $this->dal = $dal ?: DAL::get();
}

    // créer une famille 
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
    // met a jour la famille avec les informations
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

    // cherche les familles qui appartient a une personne avec son id
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

    // cherche les familles avec le nom de la famille
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

    // cherche toute les familles
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

    // récupère les personnes d'une famille avec son id
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
    // ajjoute une personne a une famille
    public function AddPersFam($id_famille, $id_personne, string $role = 'Createur'): bool {
        $query = 'INSERT INTO appartient_a (id_famille, id_personne, role) 
                VALUES (:id_f, :id_p, :role)';
        $stmt = $this->dal->prepare($query);
        return $stmt->execute([
            ':id_f' => $id_famille,
            ':id_p' => $id_personne,
            ':role' => $role
        ]);
    }

    // met a jour le role d'une personne dans une famille
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

    // supprime une personne d'une famille
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

    // créer une nouvelles invitations pour une personne dans une famille
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
// supprime l'invitation envoyer a une personne
public function deleteInviterPersonneDansFamille($id_famille_invitee, $id_pers_invitee, $id_pers_qui_invite): bool {
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

    // récupère les details des invitations dans une famille pour une personnes
    public function getInvitationDetails($id_personne): array {
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

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

    //accepter l'invitation d'une personne dans la famille et l'ajoute dedans, supprime également l'invitation
    public function AccepterInvitation($id_personne, $id_famille, $role = "Professionelle"): bool {
    try {
        $this->dal->beginTransaction();
        $queryInsert = 'INSERT INTO appartient_a (id_famille, id_personne,role) 
                        VALUES (:id_f, :id_p, :role)';
        $stmtInsert = $this->dal->prepare($queryInsert);
        $stmtInsert->execute([
            ':id_f' => $id_famille,
            ':id_p' => $id_personne,
            ':role' => $role,
        ]);

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
    $this->dal->rollBack();
    throw new Exception("SQL Error: " . $e->getMessage());
    }
    }

    // supprime l'invation de la base de donnée
    public function RefuserInvitation($id_personne, $id_famille): bool {
        try {
            $this->dal->beginTransaction();
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
            throw new Exception("SQL Error (Refuser): " . $e->getMessage());
        }
    }

    //quitte la famille avec son id et l'id de la personne qui veux quitter 
    public function QuitterFamille(string $id_personne, string $id_famille): bool {
        try {
            $this->dal->beginTransaction();

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


    // récupère le role qu'une personne à dans une famille
    public function getRoleInFamily(string $userId, string $familleId): string 
    {
        $sql = "SELECT role 
                FROM appartient_a 
                WHERE id_personne = :id_user 
                AND id_famille = :id_famille";

        try {
            $stmt = $this->dal->prepare($sql);
            $stmt->execute([
                'id_user'    => $userId,
                'id_famille' => $familleId
            ]);

            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result['role'] ?? 'Visiteur';

        } catch (PDOException $e) {
            return 'Visiteur';
        }
    }
}