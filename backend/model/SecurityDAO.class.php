<?php
require_once(__DIR__ . '/dal.class.php');

class SecurityDAO {
    private DAL $dal;

    public function __construct() {
        $this->dal = DAL::get();
    }

    // Fonction interne pour hacher l'IP systématiquement
    private function hashIp(string $ip): string {
        return hash('sha512', $ip);
    }

    public function getSecurityStatus(string $ip): array {
    $ip_hashed = $this->hashIp($ip);
    
    // 1. Nettoyage (optionnel ici, peut être mis dans un cron)
    $this->dal->prepare("DELETE FROM login_attempts WHERE attempt_time < NOW() - INTERVAL '24 hours'")->execute();
    
    // 2. On récupère le nombre et la date du dernier essai dans les 15 dernières minutes
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
        // Calcul du temps restant avant expiration du blocage (15 min après le dernier essai)
        $lastAttemptTime = strtotime($res['last_attempt']);
        $unlockTime = $lastAttemptTime + (5 * 60); // + 15 minutes
        $waitTime = max(0, $unlockTime - time());
    }

    return [
        'nb' => $nbAttempts,
        'wait_time' => $waitTime // Temps en secondes
    ];
}

    public function registerAttempt(string $ip): void {
        $ip_hashed = $this->hashIp($ip);
        $this->dal->prepare("INSERT INTO login_attempts (ip_address) VALUES (:ip)")->execute(['ip' => $ip_hashed]);
    }

    public function clearAttempts(string $ip): void {
        $ip_hashed = $this->hashIp($ip);
        $this->dal->prepare("DELETE FROM login_attempts WHERE ip_address = :ip")->execute(['ip' => $ip_hashed]);
    }
    /**
     * Vérifie si le compte de l'utilisateur est activé (est_actif = true)
     * @param string $username Le nom d'utilisateur
     * @return bool True si actif, False si inactif ou utilisateur inexistant
     */
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