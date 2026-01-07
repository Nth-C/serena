<?php
require_once(__DIR__ . '/model/planning.class.php');
require_once(__DIR__ . '/model/personneDAO.class.php');

class App
{
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

    // Récupération de la famille active depuis la session
    $this->id_famille = $_SESSION['id_famille_active'] ?? 0;
    $this->planning = new Planning();
  }

  // CETTE MÉTHODE MANQUAIT ET CAUSAIT L'ERREUR
  public function setFamilleActive(int $id) {
    $this->id_famille = $id;
    $_SESSION['id_famille_active'] = $id;
  }

  public function __destruct()
  {
    if ($this->connected && $this->personne) {
      $_SESSION['connected'] = true;
      $_SESSION['username'] = $this->personne->username;
      $_SESSION['user_id'] = $this->personne->id; 
      // Conservation de la famille active en fin de script
      $_SESSION['id_famille_active'] = $this->id_famille;
    } else {
      $_SESSION['connected'] = false;
      $_SESSION['username'] = '';
      unset($_SESSION['user_id']);
      unset($_SESSION['id_famille_active']);
    }
  }

  public function login(Personne $personne)
  {
    $this->connected = true;
    if ($personne == null) {
      throw new Exception("null pointer");
    }
    $this->personne = $personne;
    $_SESSION['user_id'] = $personne->id; 
    $_SESSION['connected'] = true;
    $_SESSION['username'] = $personne->username;
  }

  public function logout()
  {
    $this->connected = false;
    $this->personne = null;
    $this->id_famille = 0;
    session_destroy();
  }
}