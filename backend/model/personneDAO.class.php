<?php
require_once(__DIR__ . '/personne.class.php');
require_once(__DIR__ . '/dal.class.php');

class PersonneDAO{

    private DAL $dal;

    public function __construct()
    {
        $this->dal = DAL::get();
    }

    public function findByUsername(string $username): ?Personne
    {
        $query = 'SELECT * from personnes where username = :username';
        $stmt = $this->dal->prepare($query);
        $stmt->execute([':username' => $username]);   
        $result = $stmt->fetch();

        if ($result === false) {
        return null;
        }
    
        return new Personne($result);
    }

    public function insert(Personne $personne): bool
    {
        $query = 'INSERT INTO personnes (nom, prenom, mail, username, mdp, date_naissance) VALUES (:nom, :prenom, :mail, :username, :mdp, :date_naissance)';
        $stmt = $this->dal->prepare($query);
        return $stmt->execute([
            ':nom' => $personne->nom,
            ':prenom' => $personne->prenom,
            ':mail' => $personne->mail,
            ':username' => $personne->username,
            ':mdp' => $personne->mdp,
            ':date_naissance' => $personne->date_naissance->format('Y-m-d')
        ]);
    }
}

?>