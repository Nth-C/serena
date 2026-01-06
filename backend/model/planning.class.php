<?php
class Planning {
    private string $description;
    private array $evenements = [];

    public function __construct(array $data = array()) {
        //attention : dans data ya description(string) et evenements (array d'evenement)
        // on recupère la description du planning
        $this->description = $data['description'] ?? '';
        // pour chaque evenements de "evenements" on l'ajoute à l'attribut
        if (!empty($data['evenements'])) {
            foreach ($data['evenements'] as $evenement){
                $this->evenements[] = $evenement;
            }
        }
        
    }

}
?>