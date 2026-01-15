<?php
require_once(__DIR__ . '/model/planning.class.php');
require_once(__DIR__ . '/model/personneDAO.class.php');

class App
{
    public Planning $planning;
    public ?Personne $personne;
    public string $id_famille; 
    public bool $connected; 
    public string $id_personne; 

    public function __construct()
    {
        if (session_status() === PHP_SESSION_NONE) { 
            session_start([
                'cookie_httponly' => true,
                'cookie_samesite' => 'Lax',
            ]);
        }    

        $this->connected = $_SESSION['connected'] ?? false;
        $username = $_SESSION['username'] ?? '';
        $this->id_personne = $_SESSION['user_id'] ?? ''; 

        if ($username != '') {
            $dao = new PersonneDAO();
            $this->personne = $dao->findByUsername($username);
            if ($this->personne) {
                $this->id_personne = $this->personne->id; 
            }
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
            $_SESSION['user_id'] = $this->personne->id; // Sauvegarde de l'ID en session
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
        $this->personne = $personne;
        $this->id_personne = $personne->id; // Mise à jour de l'ID dans l'objet
        $_SESSION['connected'] = true;      
        $_SESSION['username'] = $personne->username; 
        $_SESSION['user_id'] = $personne->id; // Mise à jour de l'ID en session
    }

    public function logout() {
        $_SESSION = array();

        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        session_destroy();
        $this->connected = false;
        $this->id_personne = "";
        $this->id_famille = "";
    }

    public function setFamilleActive($id_famille)
    {
        $this->id_famille = $id_famille;
        $_SESSION['id_famille_active'] = $id_famille;
    }

    public function checkRole(string $requiredRole): bool 
    {
        require_once(__DIR__ . '/model/familleDAO.class.php');
        if (!$this->personne || $this->id_famille == 0) return false;

        $dao = new FamilleDAO();
        $currentRole = $dao->getRoleInFamily($this->personne->id, $this->id_famille);
        
        if ($requiredRole === 'Createur') {
            return $currentRole === 'Createur';
        }

        if ($requiredRole === 'Aidant') {
            return $currentRole === 'Aidant';
        }

        if ($requiredRole === 'Visiteur') {
            return $currentRole === 'Visiteur';
        }
        
        return false;
    }
}