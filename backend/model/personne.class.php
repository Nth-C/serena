<?php
class Personne{
    public readonly string $id;
    public string $nom;  
    public string $prenom;   
    public string $mail;
    public string $username;
    public string $mdp;
    public DateTimeImmutable $date_naissance;
         
    public function __construct(array $data=array())
    {
        $this->id = $data['id'] ?? '';
        $this->nom = $data['nom'] ?? '';
        $this->prenom = $data['prenom'] ?? '';
        $this->mail = $data['mail'] ?? '';
        $this->username = $data['username'] ?? '';
        $this->mdp = $data['mdp'] ?? '';
        $this->date_naissance = $data['date_naissance'] ?? '';
}

    public function checkPassword(string $password) 
    {
        return password_verify($password,$this->mdp);
    }

}

?>