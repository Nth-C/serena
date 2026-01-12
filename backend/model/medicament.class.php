<?php

class Medicament
{
  public readonly string $id_medicament;
  public string $nomMedicament;
  public string $description;
  public int $numAutorisationEU;
  public string $type;
  public int $stock;
  public int $stockTotal;

  public function __construct(array $data = array())
  {
    $this->id_medicament = $data['id_medicament'] ?? '';
    $this->nomMedicament = $data['designation_med'] ?? '';
    $this->description = $data['desc'] ?? '';
    $this->numAutorisationEU = $data['numAutorisationEU'] ?? -1;
    $this->type = $data['type'] ?? $data['designation_elem_pharma'] ?? 'PAS DE TYPE';
    $this->stock = $data['quantite'] ?? -1;
    $this->stockTotal = $data['total'] ?? -1;
  }

  



}
