<?php

class Categorie
{
  public readonly string $nom;
  private CategorieDAO $dao;

  public function __construct(array $data = array())
  {
    $this->nom = $data['nom'] ?? '';
    $this->dao = new CategorieDAO();
  }

  public function getCategories(): array
  {
    return $this->dao->getCategories($this);
  }



}
