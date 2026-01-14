<?php
require_once(__DIR__ . '/dal.class.php');

class SecurityDAO {
    private DAL $dal;

    public function __construct() {
        $this->dal = DAL::get();
    }

    // Fonction interne pour hacher l'IP systématiquement
    private function hashIp(string $ip): string {
        return hash('sha256', $ip);
    }

    public function getNbAttempts(string $ip): int {
        $ip_hashed = $this->hashIp($ip);
        // Nettoyage auto
        $this->dal->prepare("DELETE FROM login_attempts WHERE attempt_time < NOW() - INTERVAL '24 hours'")->execute();
        
        $stmt = $this->dal->prepare("SELECT COUNT(*) FROM login_attempts WHERE ip_address = :ip AND attempt_time > NOW() - INTERVAL '15 minutes'");
        $stmt->execute(['ip' => $ip_hashed]);
        return (int) $stmt->fetchColumn();
    }

    public function registerAttempt(string $ip): void {
        $ip_hashed = $this->hashIp($ip);
        $this->dal->prepare("INSERT INTO login_attempts (ip_address) VALUES (:ip)")->execute(['ip' => $ip_hashed]);
    }

    public function clearAttempts(string $ip): void {
        $ip_hashed = $this->hashIp($ip);
        $this->dal->prepare("DELETE FROM login_attempts WHERE ip_address = :ip")->execute(['ip' => $ip_hashed]);
    }
}