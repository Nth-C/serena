<?php
class DAL {
    private static $instance = null;
    private PDO $db;

    private function __construct() {
        // recupere les login depuis le .env
        $host = getenv('DB_HOST');
        $port = getenv('DB_PORT');
        $dbname = getenv('DB_NAME');
        $user = getenv('DB_USER');
        $password = getenv('DB_PASSWORD');

        $dataSourceName = "pgsql:host=" . $host . ";port=" . $port . ";dbname=" . $dbname;        
        $this->db = new PDO($dataSourceName, $user, $password, [            
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC // pour avoir des tableaux propres a l'affichage
        ]);
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
                die('PDO query Error on "' . $query . '"');
            }
        } catch (PDOException $e) {
            die('PDO query Error on "' . $query . '" ' . $e->getMessage());
        }
        return $stmt;
    }
}