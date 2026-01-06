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
        //attention : dans $data accompagnants est un array de personnes
        $this->id_trajet = $data['id_trajet'] ?? -1;
        $this->lieuDepart = $data['lieuDepart'] ?? "";
        $this->lieuArrive = $data['lieuArrive'] ?? "";
        // --- GESTION DES DATES ---
        // On vérifie si on a une date (string) et on la convertit en Objet
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
         // pour chaque accompagnants de "accompagnants" on l'ajoute à l'attribut
        $listeAccompagnants = $data['accompagnants'] ?? [];
        
        foreach ($listeAccompagnants as $accompagnant){
            // Optionnel : vérifiez ici si $accompagnant est bien un objet Personne ou un array à convertir
            $this->accompagnants[] = $accompagnant;
        }
        }
    public function getNbAccompagnants() {
        $i = 0;
        foreach($accompagnants as $accompagnant){
            $i = $i + 1; 
        }
    }
        

    }
?>