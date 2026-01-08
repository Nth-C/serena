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

        $this->id_famille = $_SESSION['id_famille_active'] ?? 0;

        $this->planning = new Planning();
    }

    public function __destruct()
    {
        if ($this->connected && $this->personne) {
            $_SESSION['connected'] = true;
            $_SESSION['username'] = $this->personne->username;
            $_SESSION['id_famille_active'] = $this->id_famille;
        } else {
            $_SESSION['connected'] = false;
            $_SESSION['username'] = '';
            unset($_SESSION['id_famille_active']);
        }
    }


    public function login(Personne $personne)
    {
        $this->connected = true;
        $this->personne = $personne;
        $_SESSION['connected'] = true;       // INDISPENSABLE
        $_SESSION['username'] = $personne->username; // INDISPENSABLE
        $_SESSION['user_id'] = $personne->id;
    }


    public function logout()
    {
        $this->connected = false;
        $this->personne = null;
        $this->id_famille = 0;
        session_destroy();
    }

    public function setFamilleActive(int $id_famille)
    {
        $this->id_famille = $id_famille;
        $_SESSION['id_famille_active'] = $id_famille;
    }
}