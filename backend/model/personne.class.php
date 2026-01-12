<?php
class Personne{
    public readonly string $id;
    public readonly string $nom;  
    public readonly string $prenom;   
    public readonly string $mail;
    public readonly string $username;
    public readonly string $mdp;
    public readonly string $date_naissance;
    public readonly string $role;
         
    public function __construct(array $data=array())
    {
        $this->id = $data['id_personne'] ?? $data['id'] ?? '';        
        $this->nom = $data['nom'] ?? '';
        $this->prenom = $data['prenom'] ?? '';
        $this->mail = $data['mail'] ?? '';
        $this->username = $data['username'] ?? '';
        $this->mdp = $data['mdp'] ?? '';
        $this->date_naissance = $data['date_naissance'] ?? '';
        $this->role = $data['role'] ?? '';
}

    public function checkPassword(string $password) 
    {
        return password_verify($password,$this->mdp);
    }

}

?>