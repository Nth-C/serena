<?php
require_once(__DIR__ . '/audit.class.php'); 
require_once(__DIR__ . '/dal.class.php'); 

class auditDAO {
    private DAL $dal;

    public function __construct() {
        $this->dal = DAL::get();
    }

    // récupère tout les logs d'une famille
    public function getAllAudit($id_famille): array
    {
        $query = 'SELECT * FROM audit_logs WHERE id_famille_audit = :id_famille ORDER BY action_tstamp DESC';
        $stmt = $this->dal->prepare($query);

        $stmt->execute(['id_famille' => $id_famille]);
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC); 

        if ($data === false || empty($data)) {
            return []; 
        }

        $audits = [];
        foreach($data as $auditData){
            $audits[] = new audit($auditData);
        }
        return $audits;
    }

    
}
?>