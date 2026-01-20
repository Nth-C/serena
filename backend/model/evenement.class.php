<?php

class Evenement
{
    // On met les propriétés en public pour que le contrôleur puisse faire $ev->nom, $ev->id_event, etc.
    public ?string $id_event = null;
    public ?string $id_recurrence = null;
    public ?string $nom = '';        // Correspond à 'titre'
    public ?string $lieu = '';
    public ?string $note = '';       // Correspond à 'description'
    
    // On garde les dates en string pour l'instant pour faciliter l'export JSON vers React
    public ?string $date_deb = null; 
    public ?string $date_fin = null;

    // Si tu veux manipuler des objets DateTime en PHP, tu peux ajouter des getters spécifiques, 
    // mais pour l'affichage React, les strings de la BDD suffisent souvent.

    public array $accompagnants = [];
    public array $trajets = [];

    

    public function __construct(array $data = array())
    {
        // 1. Récupération de l'ID (important pour le select !)
        $this->id_event = $data['id_event'] ?? null;
        $this->id_recurrence = $data['id_recurrence'] ?? null;

        // 2. Mapping des noms de colonnes BDD vers l'objet
        // On utilise '??' pour éviter l'erreur "Undefined array key" si la colonne manque
        
        // Titre / Nom
        $this->nom = $data['nom'] ?? $data['titre'] ?? '';

        // Lieu
        $this->lieu = $data['lieu'] ?? '';

        // Description / Note (Gère le cas où la note est NULL en BDD)
        $this->note = $data['note'] ?? $data['description'] ?? '';

        // Dates
        // On stocke la date brute renvoyée par Postgres (ex: "2024-01-01 14:00:00")
        $this->date_deb = $data['date_deb'] ?? $data['debut'] ?? null;
        $this->date_fin = $data['date_fin'] ?? $data['fin'] ?? null;

        // Gestion des tableaux (vérifie s'ils existent avant de boucler)
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
    }
}
?>