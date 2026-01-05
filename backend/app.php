<?php


class App
{
  public Parametre $parametre;
  public array $aides;
  public array $formulaires;
  public array $categories;
  public array $rapports;
  public Stock $stock;
  public Planning $planning;
  

  public function __construct()
  {
    session_start();
    $this->parametre = new Parametre();
    $this->stock = new Stock();
    $this->planning = new Planning();
  }

  public function __destruct()
  {
    // Ne conserve que l'id de l'étudiant
    if ($this->connected ) {
      $_SESSION['connected'] = true;
      $_SESSION['login'] = $this->personne->login;
    } else {
      $_SESSION['connected'] = false;
      $_SESSION['login'] = '';
    }
  }

  // Indique un étudiant correctement logué
  public function login(Personne $personne)
  {
    $this->connected = true;
    if ($personne == null) {
      throw new Exception("null pointer");
    }
    $this->personne = $personne;
  }

  // Déconnection
  public function logout()
  {
    $this->connected = false;
    $this->personne = null;
  }
}
