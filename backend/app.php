<?php


class App
{
  //public Parametre $parametre;
  public array $aides;
  public array $formulaires;
  public array $categories;
  public array $rapports;
  public Stock $stock;
  public Planning $planning;
  public ?Personne $personne;
  public int $id_famille;
  public bool $connected; 


  

  public function __construct()
  {
    session_start();
    //$this->parametre = new Parametre();
    //$this->stock = new Stock();
    //$this->planning = new Planning();

    if (session_status() === PHP_SESSION_NONE) 
      { 
        session_start(); 
      }    
    $this->connected = $_SESSION['connected'] ?? false;
    $username = $_SESSION['username'] ?? '';
    if ($username != '') {
      $dao = new PersonneDAO();
      $this->personne = $dao->findByUsername($username);
    } else {
      $this->personne = null;
    }
    $this->id_famille = 2;
    $this->planning = new Planning();
  }

  public function __destruct()
  {
    if ($this->connected ) {
      $_SESSION['connected'] = true;
      $_SESSION['username'] = $this->personne->username;
    } else {
      $_SESSION['connected'] = false;
      $_SESSION['username'] = '';
    }
  }

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
