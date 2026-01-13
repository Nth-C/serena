<?php
class DAL {
    private static $instance = null;
    private PDO $db;

    private function __construct() {
        // 1. Récupération des variables d'environnement
        $host = getenv('DB_HOST');
        $port = getenv('DB_PORT');
        $dbname = getenv('DB_NAME');
        $user = getenv('DB_USER');
        $password = getenv('DB_PASSWORD');

        // 2. Création de la connexion PDO
        $dataSourceName = "pgsql:host=" . $host . ";port=" . $port . ";dbname=" . $dbname;        
        try {
            $this->db = new PDO($dataSourceName, $user, $password, [            
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION // Important pour voir les erreurs
            ]);
        } catch (PDOException $e) {
            die("Erreur de connexion BDD : " . $e->getMessage());
        }

        // --- 3. AJOUT MAJEUR : IDENTIFICATION DE L'UTILISATEUR ---
        
        // On vérifie si une session est active, sinon on la démarre pour lire $_SESSION
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        // On récupère le username (ou 'Système' si personne n'est connecté)
        // On utilise le username stocké lors du login
        $currentUser = $_SESSION['username'] ?? 'Système';

        // Nettoyage de sécurité (ne garde que lettres, chiffres, tirets)
        $currentUserClean = preg_replace('/[^a-zA-Z0-9_ -]/', '', $currentUser);
        if (empty($currentUserClean)) { $currentUserClean = 'Invite'; }

        // On envoie l'ordre à PostgreSQL : "Je suis cet utilisateur"
        // La variable 'app.current_user' sera lue par le Trigger SQL
        try {
            $stmt = $this->db->prepare("SELECT set_config('app.current_user', :u, false)");
            $stmt->execute(['u' => $currentUserClean]);
        } catch (Exception $e) {
            // On ne bloque pas tout le site si ça échoue, mais on le note
            error_log("DAL Audit Error: " . $e->getMessage());
        }
    }

    public static function get(): DAL {
        if (is_null(self::$instance)) {
            self::$instance = new DAL();
        }
        return self::$instance;
    }

    public function prepare(string $query): PDOStatement {
        try {
            $stmt = $this->db->prepare($query);
            if ($stmt == FALSE) {
                throw new Exception('PDO query Error');
            }
        } catch (Exception $e) { // Changé en Exception générique pour attraper plus large
            die('PDO query Error on "' . $query . '" ' . $e->getMessage());
        }
        return $stmt;
    }
    public function beginTransaction(): bool {
        return $this->db->beginTransaction();
    }

    public function commit(): bool {
        return $this->db->commit();
    }

    public function rollBack(): bool {
        return $this->db->rollBack();
    }

    public function lastInsertId(): string {
        return $this->db->lastInsertId();
    }
}