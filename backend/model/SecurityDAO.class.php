<?php
require_once(__DIR__ . '/dal.class.php');

class SecurityDAO {
    private DAL $dal;

    public function __construct() {
        $this->dal = DAL::get();
    }

    // fonction pour hasher l'adresse ip
    private function hashIp(string $ip): string {
        return hash('sha512', $ip);
    }

    // verifie le nombre de tentative de connexion
    public function getSecurityStatus(string $ip): array {
        $ip_hashed = $this->hashIp($ip);
        
        $this->dal->prepare("DELETE FROM login_attempts WHERE attempt_time < NOW() - INTERVAL '24 hours'")->execute();
        
        $stmt = $this->dal->prepare("
            SELECT 
                COUNT(*) as nb, 
                MAX(attempt_time) as last_attempt 
            FROM login_attempts 
            WHERE ip_address = :ip 
            AND attempt_time > NOW() - INTERVAL '5 minutes'
        ");
        $stmt->execute(['ip' => $ip_hashed]);
        $res = $stmt->fetch(PDO::FETCH_ASSOC);

        $nbAttempts = (int)$res['nb'];
        $waitTime = 0;

        if ($nbAttempts >= 6) {
            $lastAttemptTime = strtotime($res['last_attempt']);
            $unlockTime = $lastAttemptTime + (5 * 60); 
            $waitTime = max(0, $unlockTime - time());
        }

        return [
            'nb' => $nbAttempts,
            'wait_time' => $waitTime 
        ];
    }

    // ajoute une tentative si mauvaise connexion
    public function registerAttempt(string $ip): void {
        $ip_hashed = $this->hashIp($ip);
        $this->dal->prepare("INSERT INTO login_attempts (ip_address) VALUES (:ip)")->execute(['ip' => $ip_hashed]);
    }

    // supprime les tentatives 
    public function clearAttempts(string $ip): void {
        $ip_hashed = $this->hashIp($ip);
        $this->dal->prepare("DELETE FROM login_attempts WHERE ip_address = :ip")->execute(['ip' => $ip_hashed]);
    }

    // verifie si le compte a été activer par mail 
    public function verifierActif(string $username): bool {
        $sql = "SELECT est_actif FROM PERSONNES WHERE username = :username";
        
        $stmt = $this->dal->prepare($sql);
        $stmt->execute([':username' => $username]);
        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$result) {
            return false;
        }

        if ($result['est_actif'] === true || $result['est_actif'] === 't' || $result['est_actif'] == 1) {
            return true;
        }

        return false;
    }
}