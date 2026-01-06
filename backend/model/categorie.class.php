<?php

class Categorie
{
  public readonly int $id_cat;
  public string $nom;
  public array $documents;

  public function __construct(array $data = array())
  {
    $this->id_cat = $data['id_cat'] ?? -1;
    $this->nom = $data['nom'] ?? '';
    $this->documents = $data['documents'] ?? array();
  }

  public function getCategories(): array
  {
    return $this->dao->getCategories($this);
  }



}
