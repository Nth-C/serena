<?php
class Trajet {
    private readonly string $id_trajet;
    private string $lieuDepart;
    private string $lieuArrive;
    private ?DateTimeImmutable $heureDepart;
    private ?DateTimeImmutable $heureArrive;
    private bool $demandeTrajet;
    private array $accompagnants = [];
    private ?SocieteTrajet $societeTrajet;


    public function __construct(array $data = array()) {
        $this->id_trajet = $data['id_trajet'] ?? -1;
        $this->lieuDepart = $data['lieuDepart'] ?? "";
        $this->lieuArrive = $data['lieuArrive'] ?? "";
        if (!empty($data['heureDepart'])) {
            $this->heureDepart = new DateTimeImmutable($data['heureDepart']);
        } else {
            $this->heureDepart = null;
        }

        if (!empty($data['heureArrive'])) {
            $this->heureArrive = new DateTimeImmutable($data['heureArrive']);
        } else {
            $this->heureArrive = null;
        }
        $this->demandeTrajet = $data['demandeTrajet'] ?? false;
        $this->societeTrajet = $data['societeTrajet'] ?? null;
        $listeAccompagnants = $data['accompagnants'] ?? [];
        
        foreach ($listeAccompagnants as $accompagnant){
            $this->accompagnants[] = $accompagnant;
        }
    }
    

    }
?>