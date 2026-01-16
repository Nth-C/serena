<?php
require_once(__DIR__ . '/personne.class.php');
require_once(__DIR__ . '/dal.class.php');

class PersonneDAO {
    private DAL $dal;

    // Dans PersonneDAO.class.php

    // Modifie le constructeur comme ceci :
    public function __construct(?DAL $dal = null) {
    // Si $dal est fourni (test), on l'utilise. Sinon (prod), on prend le Singleton.
    $this->dal = $dal ?: DAL::get();
}

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
              -- Filtre pour exclure ceux qui sont déjà dans la famille
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

public function findByEmail($email) {
    // CORRECTION ICI : on utilise "WHERE mail =" et non "WHERE email ="
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

public function updatePasswordByEmail($email, $hashedPassword) {
    // CORRECTION ICI : on utilise "mail" pour la clause WHERE
    $sql = "UPDATE PERSONNES SET mdp = :mdp WHERE mail = :email";
    $stmt = $this->dal->prepare($sql);
    $stmt->bindValue(':mdp', $hashedPassword);
    $stmt->bindValue(':email', $email);
    return $stmt->execute();
}

    // Dans model/PersonneDAO.class.php

// 1. Modifier INSERT pour inclure le token_activation
public function insert(Personne $personne, $tokenActivation): bool {
    // Note : On force 'est_actif' à FALSE par défaut dans la requête ou via la BDD
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
        ':token'          => $tokenActivation // On passe le token ici
    ]);
}

// 2. Nouvelle méthode pour activer le compte
public function activateAccount($token) {
    // On cherche si ce token existe
    $sql = "SELECT id_personne FROM PERSONNES WHERE token_activation = :token";
    $stmt = $this->dal->prepare($sql);
    $stmt->execute([':token' => $token]);
    
    if ($stmt->fetch()) {
        // Si oui, on active le compte et on supprime le token
        $update = "UPDATE PERSONNES SET est_actif = TRUE, token_activation = NULL WHERE token_activation = :token";
        $stmtUp = $this->dal->prepare($update);
        return $stmtUp->execute([':token' => $token]);
    }
    return false;
}

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
    
}
?>