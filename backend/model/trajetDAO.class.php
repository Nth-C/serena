<?php
require_once(__DIR__ . '/trajet.class.php');
require_once(__DIR__ . '/dal.class.php');

class TrajetDAO{

    private DAL $dal;

    public function __construct()
    {
        $this->dal = DAL::get();
    }

    public function findById(string $id): ?Trajet
    {
        $query = 'SELECT * from trajet where id = :id';
        $stmt = $this->dal->prepare($query);
        $stmt->execute([':id' => $id]);   
        $result = $stmt->fetch();

        if ($result === false) {
        return null;
        }
    
        return new Trajet($result);
    }

    //renvoie les trajets qui ont true l'attribut de demande de trajet
    public function demandeDeTrajet(string $id_famille): array
    {
        $query = 'SELECT TRAJET.* FROM TRAJET,EVENEMENTS WHERE TRAJET.demande_trajet = TRUE AND TRAJET.id_event = EVENEMENTS.id_event AND EVENEMENTS.id_famille = :id_famille';
        $stmt = $this->dal->prepare($query);

        $stmt->execute([':id_famille' => $id_famille]);
        $data = $stmt->fetchAll();
        
        foreach($data as $trajet){
             $trajets[] = new Trajet($trajet);
        }

        return $trajets;
    }
}

?>