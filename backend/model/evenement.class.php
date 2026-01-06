<?php

class Evenement
{
    private ?DateTimeImmutable $debut;
    private ?DateTimeImmutable $fin;
    private string $lieu;
    private string $description;
    private string $type;
    private array $evenements = [];
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
        $this->type = $data['type'];

        foreach ($data['evenements'] as $evenement){
            $this->evenements[] = $evenement;
        }

        foreach ($data['trajets'] as $trajet){
            $this->evenements[] = $evenement;
        }
    }
}
