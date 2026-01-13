<?php
require_once(__DIR__ . '/model/planning.class.php');
require_once(__DIR__ . '/model/personneDAO.class.php');
require_once(__DIR__ . '/model/dal.class.php'); 

class App
{
    public Planning $planning;
    public ?Personne $personne;
    public string $id_famille; 
    public bool $connected; 

    public function __construct()
    {
        if (session_status() === PHP_SESSION_NONE) { 
            session_start(); 
        }    

        $this->connected = $_SESSION['connected'] ?? false;
        $username_session = $_SESSION['username'] ?? '';
        
        // Initialisation par défaut
        $this->personne = null;
        $this->id_famille = $_SESSION['id_famille_active'] ?? 0;
        $this->planning = new Planning();

        // Si on a un username en session
        if ($username_session != '') {
            $dao = new PersonneDAO();
            $this->personne = $dao->findByUsername($username_session);

            if ($this->personne) {
                try {
                    $dal = DAL::get();
                    
                    // ON PREND LE USERNAME BRUT (sans regex pour tester)
                    // Le prepared statement (:user) protège déjà des injections SQL
                    $userToLog = $this->personne->username;
                    
                    // DEBUG : Si vous regardez les logs PHP (error.log), vous verrez si ça passe ici
                    // error_log("App.php : Envoi de l'utilisateur audit -> " . $userToLog);

                    // Envoi à PostgreSQL
                    $stmt = $dal->prepare("SELECT set_config('app.current_user', :user, false)");
                    $stmt->execute(['user' => $userToLog]);
                    
                } catch (Exception $e) {
                    error_log("ERREUR AUDIT : " . $e->getMessage());
                }
            }
        }
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
        $_SESSION['connected'] = true;      
        $_SESSION['username'] = $personne->username; 
        $_SESSION['user_id'] = $personne->id;
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
        $this->id_famille = "";
    }

    public function setFamilleActive( $id_famille)
    {
        $this->id_famille = $id_famille;
        $_SESSION['id_famille_active'] = $id_famille;
    }
}