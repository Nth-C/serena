<?php

class Document
{
    public readonly int $id_document;
    public string $nom;

    public function __construct(array $data = array())
    {
        $this->id_document = $data['id_document'] ?? -1;
        $this->nom = $data['nom'] ?? '';
    }

    public function addDocument(): array
    {
        return $this->dao->getOrdonnances($this);
    }



}
