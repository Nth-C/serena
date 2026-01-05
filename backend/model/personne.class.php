<?php
class Personne {
    private readonly string $prenom;
    private readonly string $nom;
    private readonly int $age;
    private readonly string $role;

    public function __construct(array $data = array()) {
        $this->prenom = $data['prenom'];
        $this->nom = $data['nom'];
        $this->age = $data['age'];
        $this->role = $data['role'];
        }
    }
?>