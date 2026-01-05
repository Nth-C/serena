<?php

class Categorie
{
  public readonly string $nom;
  public array $documents;

  public function __construct(array $data = array())
  {
    $this->nom = $data['nom'] ?? '';
    $this->documents = $data['documents'] ?? array();
  }

  public function getCategories(): array
  {
    return $this->dao->getCategories($this);
  }



}
