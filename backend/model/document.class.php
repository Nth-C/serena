<?php

class Document
{
    public string $nom;

    public function __construct(array $data = array())
    {
        $this->nom = $data['nom'] ?? '';
        
    }

    public function addDocument(): array
    {
        return $this->dao->getOrdonnances($this);
    }



}
