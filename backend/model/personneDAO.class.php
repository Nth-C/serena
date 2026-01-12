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

public function updatePasswordByEmail($email, $hashedPassword) {
    // CORRECTION ICI : on utilise "mail" pour la clause WHERE
    $sql = "UPDATE PERSONNES SET mdp = :mdp WHERE mail = :email";
    $stmt = $this->dal->prepare($sql);
    $stmt->bindValue(':mdp', $hashedPassword);
    $stmt->bindValue(':email', $email);
    return $stmt->execute();
}

    public function insert(Personne $personne): bool {
        $query = 'INSERT INTO personnes (nom, prenom, mail, username, mdp, date_naissance) 
                  VALUES (:nom, :prenom, :mail, :username, :mdp, :date_naissance)';
        
        $stmt = $this->dal->prepare($query);

        return $stmt->execute([
            ':nom'            => $personne->nom,
            ':prenom'         => $personne->prenom,
            ':mail'           => $personne->mail,
            ':username'       => $personne->username,
            ':mdp'            => $personne->mdp,
            ':date_naissance' => $personne->date_naissance 
        ]);
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