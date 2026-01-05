<?php

class Formulaire
{
  public string $nom;
  public string $date;
  public string $nomDescription;

  public function __construct(array $data = array())
  {
    $this->nom = $data['nom'] ?? '';
    $this->date = $data['date'] ?? '';
    $this->nomDescription = $data['nomDescription'] ?? '';
  }



}
