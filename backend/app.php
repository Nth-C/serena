<?php
require_once(__DIR__ . '/model/planning.class.php');
require_once(__DIR__ . '/model/personneDAO.class.php');

class App
{
  //public array $aides;
  //public array $formulaires;
  //public array $categories;
  //public array $rapports;
  public Stock $stock;
  public Planning $planning;
  public ?Personne $personne;
  public int $id_famille;
  public bool $connected; 

  public function __construct()
  {
    if (session_status() === PHP_SESSION_NONE) { 
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
    if ($this->connected && $this->personne) {
      $_SESSION['connected'] = true;
      $_SESSION['username'] = $this->personne->username;
      // AJOUT : Stocker l'ID pour les contrôleurs
      $_SESSION['user_id'] = $this->personne->id; 
    } else {
      $_SESSION['connected'] = false;
      $_SESSION['username'] = '';
      unset($_SESSION['user_id']);
    }
  }

  public function login(Personne $personne)
  {
    $this->connected = true;
    if ($personne == null) {
      throw new Exception("null pointer");
    }
    $this->personne = $personne;
    // AJOUT : Immédiatement disponible en session
    $_SESSION['user_id'] = $personne->id; 
  }

  public function logout()
  {
    $this->connected = false;
    $this->personne = null;
    session_destroy();
  }
}