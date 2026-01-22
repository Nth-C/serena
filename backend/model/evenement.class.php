<?php

class Evenement
{
    public ?string $id_event = null;
    public ?string $id_recurrence = null;
    public ?string $nom = ''; 
    public ?string $lieu = '';
    public ?string $note = '';
    
    public ?string $date_deb = null; 
    public ?string $date_fin = null;

    public array $accompagnants = [];
    public array $trajets = [];

    

    public function __construct(array $data = array())
    {
        $this->id_event = $data['id_event'] ?? null;
        $this->id_recurrence = $data['id_recurrence'] ?? null;

        
        // Nom
        $this->nom = $data['nom'] ?? $data['titre'] ?? '';

        // Lieu
        $this->lieu = $data['lieu'] ?? '';

        // Description
        $this->note = $data['note'] ?? $data['description'] ?? '';

        // Dates
        $this->date_deb = $data['date_deb'] ?? $data['debut'] ?? null;
        $this->date_fin = $data['date_fin'] ?? $data['fin'] ?? null;

        
        if (!empty($data['accompagnants']) && is_array($data['accompagnants'])) {
            foreach ($data['accompagnants'] as $accompagnant){
                $this->accompagnants[] = $accompagnant;
            }
        }

        if (!empty($data['trajets']) && is_array($data['trajets'])) {
            foreach ($data['trajets'] as $trajet){
                $this->trajets[] = $trajet;
            }
        }
        if (isset($data['id_trajet']) && $data['id_trajet'] !== null) {
            $this->trajets = [
                [
                    'id_trajet' => $data['id_trajet'],
                    'lieu_dep'  => $data['lieu_dep'] ?? '',
                    'lieu_arr'  => $data['lieu_arr'] ?? '',
                    'date_deb'  => $data['trajet_date'] ?? null
                ]
            ];
        } else {
            $this->trajets = []; 
        }
    }
}
?>