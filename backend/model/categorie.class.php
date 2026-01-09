<?php
require_once(__DIR__ . '/document.class.php');

class Categorie
{
  public readonly string $id_cat;
  public string $nom;
  public array $documents;

  public function __construct(array $data = array())
  {
    $this->id_cat = $data['id_cat'] ?? -1;
    $this->nom = $data['nom'] ?? '';
    $this->documents = $data['documents'] ?? [];
  }

  public function ajouterDocument(Document $document){
    $this->documents[] = $document;
  }




}
