<?php
require_once(__DIR__ . '/dal.class.php');

class AidesDAO {
    private DAL $dal;

    public function __construct() {
        $this->dal = DAL::get();
    }

    public function getAllAides(): array {
        $query = "SELECT * FROM aide_finance"; 
        $stmt = $this->dal->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }


    // Ajoutez $id_famille dans les arguments de la fonction
public function setAide($id_famille, $nom, $description, $statuspro, $depense, $fiscalite, $role, $age_aide, $gir, $medical, $apa, $pch, $aucune, $objectif)
{
    $query = "INSERT INTO aide (
                id_famille, nom, description, status, statuspro, depense, 
                fiscalite, role, age_aide, gir, situation_medicale, 
                aide_apa, aide_pch, aide_aucune, objectif
              ) VALUES (
                :id_famille, :nom, :description, true, :statuspro, :depense, 
                :fiscalite, :role, :age_aide, :gir, :medical, 
                :apa, :pch, :aucune, :objectif
              )
              ON CONFLICT (id_famille) 
              DO UPDATE SET 
                statuspro = EXCLUDED.statuspro,
                depense = EXCLUDED.depense,
                fiscalite = EXCLUDED.fiscalite,
                gir = EXCLUDED.gir,
                situation_medicale = EXCLUDED.situation_medicale,
                objectif = EXCLUDED.objectif,
                aide_apa = EXCLUDED.aide_apa,
                aide_pch = EXCLUDED.aide_pch,
                aide_aucune = EXCLUDED.aide_aucune";

    $stmt = $this->dal->prepare($query);
    return $stmt->execute([
        ':id_famille' => $id_famille,
        ':nom'        => $nom,
        ':description'=> $description,
        ':statuspro'  => $statuspro,
        ':depense'    => $depense,
        ':fiscalite'  => $fiscalite,
        ':role'       => $role,
        ':age_aide'   => $age_aide,
        ':gir'        => $gir,
        ':medical'    => $medical,
        ':apa'        => $apa ? 1 : 0,
        ':pch'        => $pch ? 1 : 0,
        ':aucune'     => $aucune ? 1 : 0,
        ':objectif'   => $objectif
    ]);
}

}