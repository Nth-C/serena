<?php
class SocieteTrajet {
    private readonly string $nom;

    public function __construct(array $data = array()) {
        $this->nom = $data['nom'] ?? "";
        }
    }
?>