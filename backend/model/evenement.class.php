<?php

class Evenement
{
    private ?DateTimeImmutable $debut;
    private ?DateTimeImmutable $fin;
    private string $lieu;
    private string $description;
    private string $titre;
    private array $accompagnants = [];
    private array $trajets = [];

    public function __construct(array $data = array())
    {
         if (!empty($data['debut'])) {
            $this->heureDepart = new DateTimeImmutable($data['debut']);
        } else {
            $this->heureDepart = null;
        }

         if (!empty($data['fin'])) {
            $this->heureDepart = new DateTimeImmutable($data['fin']);
        } else {
            $this->heureDepart = null;
        }

        $this->lieu = $data['lieu'];
        $this->description = $data['description'];
        $this->titre = $data['titre'];

        foreach ($data['accompagnants'] as $accompagnant){
            $this->accompagnants[] = $accompagnant;
        }

        foreach ($data['trajets'] as $trajet){
            $this->trajets[] = $trajet;
        }
    }
}
