<?php

class Medicament
{
  public readonly int $id_medicament;
  public string $nomMedicament;
  public string $description;
  public int $numAutorisationEU;
  public string $type;
  public int $stock;

  public function __construct(array $data = array())
  {
    $this->id_medicament = $data['id_medicament'] ?? -1;
    $this->nomMedicament = $data['designation_med'] ?? '';
    $this->description = $data['description'] ?? '';
    $this->numAutorisationEU = $data['numAutorisationEU'] ?? -1;
    $this->type = $data['type'] ?? -1;
    $this->stock = $data['quantite'] ?? 0;
  }

  



}
