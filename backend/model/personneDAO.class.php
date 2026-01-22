<?php
require_once(__DIR__ . '/personne.class.php');
require_once(__DIR__ . '/dal.class.php');

class PersonneDAO {
    private DAL $dal;

    public function __construct(?DAL $dal = null) {
    $this->dal = $dal ?: DAL::get();
}

    // renvoie toutes les comptes
    public function getAllPersonneWithTexte($texte, $monId, $idFamille): array {
        $query = 'SELECT id_personne, nom, prenom, username,
                (EXISTS (
                    SELECT 1 
                    FROM INVITATION
                    WHERE id_pers_invitee = PERSONNES.id_personne 
                    AND id_pers_qui_invite = :me
                )) AS invite
                FROM PERSONNES 
                WHERE (username ILIKE :search 
                OR nom ILIKE :search 
                OR prenom ILIKE :search)
                AND id_personne != :me
                AND id_personne NOT IN (
                    SELECT id_personne 
                    FROM APPARTIENT_A 
                    WHERE id_famille = :idFamille
                )
                LIMIT 16';
        
        $stmt = $this->dal->prepare($query);
        $stmt->execute([
            'search' => '%' . $texte . '%',
            'me' => $monId,
            'idFamille' => $idFamille
        ]);
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // renvoie si le nom d'utilisateur existe ou non 
    public function findByUsername(string $username): ?Personne {
        $query = 'SELECT * FROM personnes WHERE username = :username';
        $stmt = $this->dal->prepare($query);
        $stmt->execute([':username' => $username]);   
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result === false) {
            return null;
        }
        return new Personne($result);
    }

    // renvoie si l'email est deja utilisé
    public function findByEmail($email) {
        $sql = "SELECT * FROM PERSONNES WHERE mail = :email"; 
        $stmt = $this->dal->prepare($sql);
        $stmt->bindValue(':email', $email);
        $stmt->execute();
        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($data) {
            return (object) $data; 
        }
        return null;
    }

    // remet le token à null
    public function updateResetToken($email, $token, $expiration) {
        $sql = "UPDATE PERSONNES 
                SET reset_token = :token, 
                    reset_expires = :expires 
                WHERE mail = :email";
    
        $stmt = $this->dal->prepare($sql);
        
        $stmt->bindValue(':token', $token);
        $stmt->bindValue(':expires', $expiration);
        $stmt->bindValue(':email', $email);
        
        $stmt->execute();
    }

    // modifie le mot de passe avec l'envoie d'un email
    public function updatePasswordByEmail($email, $hashedPassword) {
        $sql = "UPDATE PERSONNES SET mdp = :mdp WHERE mail = :email";
        $stmt = $this->dal->prepare($sql);
        $stmt->bindValue(':mdp', $hashedPassword);
        $stmt->bindValue(':email', $email);
        return $stmt->execute();
    }

    // ajoute une personne 
    public function insert(Personne $personne, $tokenActivation): bool {
        $query = 'INSERT INTO personnes (nom, prenom, mail, username, mdp, date_naissance, token_activation, est_actif) 
                VALUES (:nom, :prenom, :mail, :username, :mdp, :date_naissance, :token, FALSE)';
        
        $stmt = $this->dal->prepare($query);

        return $stmt->execute([
            ':nom'            => $personne->nom,
            ':prenom'         => $personne->prenom,
            ':mail'           => $personne->mail,
            ':username'       => $personne->username,
            ':mdp'            => $personne->mdp,
            ':date_naissance' => $personne->date_naissance,
            ':token'          => $tokenActivation 
        ]);
    }

    // active le compte 
    public function activateAccount($token) {
        $sql = "SELECT id_personne FROM PERSONNES WHERE token_activation = :token";
        $stmt = $this->dal->prepare($sql);
        $stmt->execute([':token' => $token]);
        
        if ($stmt->fetch()) {
            $update = "UPDATE PERSONNES SET est_actif = TRUE, token_activation = NULL WHERE token_activation = :token";
            $stmtUp = $this->dal->prepare($update);
            return $stmtUp->execute([':token' => $token]);
        }
        return false;
    }

    // renvoie la personne en fonction de. l'id 
    public function findPersonneById(string $id_personne): ?Personne {
        $query = 'SELECT * FROM personnes WHERE id_personne = :id_personne';
        $stmt = $this->dal->prepare($query);
        $stmt->execute([':id_personne' => $id_personne]);   
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result === false) {
            return null;
        }
    
        return new Personne($result);
    }

    // modifie les informations du compte 
    public function updateUser($id_personne, $mail, $nom, $prenom, $username, $date_naissance){
        $query = 'UPDATE PERSONNES SET
                nom = :nom,
                prenom = :prenom,
                mail = :mail,
                username = :username,
                date_naissance = :date_naissance
                WHERE id_personne = :id_personne';
        $stmt = $this->dal->prepare($query);
        return $stmt->execute([
                'nom' => $nom,
                'prenom' => $prenom,
                'mail' => $mail,
                'id_personne' => $id_personne,
                'username' => $username,
                'date_naissance' => $date_naissance
        ]);
    }

    // supprime un compte 
    public function deleteUser($id_personne) {
        $query = "DELETE FROM PERSONNES WHERE id_personne = :id";
        $stmt = $this->dal->prepare($query);
        return $stmt->execute(['id' => $id_personne]);
    }
}
?>