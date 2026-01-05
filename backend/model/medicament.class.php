<?php

class Medicament
{
  public string $nomMedicament;
  public string $description;
  public int $numAutorisationEU;
  public string $type;

  public function __construct(array $data = array())
  {
    $this->nomMedicament = $data['nomMedicament'] ?? '';
    $this->description = $data['description'] ?? '';
    $this->numAutorisationEU = $data['numAutorisationEU'] ?? -1;
    $this->type = $data['type'] ?? -1;
  }

  public function getNbMedicament(string $nomMedicament = ''): int
  {
    return $this->dao->getNbMedicament($this,$nomMedicament);
  }



}
