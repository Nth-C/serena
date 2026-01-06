<?php
class SocieteTrajet {
    private readonly string $id_societe_trajet;
    private string $nom;

    public function __construct(array $data = array()) 
    {
        $this->id_societe_trajet = $data['id_societe_trajet'] ?? -1;
        $this->nom = $data['nom'] ?? "";
    }
    }
?>