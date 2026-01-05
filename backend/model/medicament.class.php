<?php

class Medicament
{
  public readonly string $nomMedicament;
  public readonly string $description;
  public readonly int $numAutorisationEU;
  public readonly string $type;
  private MedicamentDAO $dao;

  public function __construct(array $data = array())
  {
    $this->nomMedicament = $data['nomMedicament'] ?? '';
    $this->description = $data['description'] ?? '';
    $this->numAutorisationEU = $data['numAutorisationEU'] ?? -1;
    $this->type = $data['type'] ?? -1;
    $this->dao = new MedicamentDAO();
  }

  public function getNbMedicament(string $nomMedicament = ''): int
  {
    return $this->dao->getNbMedicament($this,$nomMedicament);
  }



}
