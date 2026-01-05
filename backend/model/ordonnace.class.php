<?php

class Ordonnance
{
  public readonly string $nom;
  private DocumentDAO $dao;

  public function __construct(array $data = array())
  {
    $this->nom = $data['nom'] ?? '';
    $this->dao = new DocumentDAO();
  }

  public function getOrdonnances(): array
  {
    return $this->dao->getOrdonnances($this);
  }
}
