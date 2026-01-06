<?php

class Famille
{
    public readonly int $id_famille;
    public string $nom;
    public string $nom_aide;
    public string $desc;

    public function __construct(array $data = array())
    {
        $this->id_famille = $data['id_famille'] ?? -1;
        $this->nom = $data['nom'] ?? '';
        $this->nom_aide = $data['nom_aide'] ?? '';
        $this->desc = $data['desc'] ?? '';
    }



}
