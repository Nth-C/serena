<?php

require_once(__DIR__ . '/categorie.class.php');
class CategorieDAO {
    private DAL $dal;

    public function __construct(?DAL $dal = null) {
    $this->dal = $dal ?? DAL::get();
}

    public function getAllCategories($id_famille, $role): array
{
    // 1. Définition de la hiérarchie
    $rolesAccessibles = match ($role) {
        'Createur'       => ['Createur', 'Famille', 'Proche', 'Professionelle'],
        'Famille'        => ['Famille', 'Proche', 'Professionelle'],
        'Proche'         => ['Proche', 'Professionelle'],
        'Professionelle' => ['Professionelle'],
        default          => ['Professionelle'],
    };

    // 2. Préparation dynamique des marqueurs (ex: :r0, :r1, :r2)
    $placeholders = [];
    $params = [':id_famille' => $id_famille];

    foreach ($rolesAccessibles as $index => $r) {
        $key = ":r" . $index;
        $placeholders[] = $key;
        $params[$key] = $r;
    }

    $inClause = implode(',', $placeholders);

    // 3. Requête sécurisée
    $query = "SELECT * FROM CAT 
              WHERE id_famille = :id_famille 
              AND role IN ($inClause)
              ORDER BY role DESC"; // Permet de trier par importance

    $stmt = $this->dal->prepare($query);
    $stmt->execute($params);
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!$data) {
        return [];
    }
    
    $categories = [];
    foreach($data as $row){
        $categories[] = new Categorie($row);
    }
    return $categories;
}

    public function addCategorie($id_famille, $nom, $role){
        $query = 'INSERT INTO CAT (nom, id_famille,role) VALUES (:nom, :id_famille,:role)';
        $stmt = $this->dal->prepare($query);
        return $stmt->execute(['nom' => $nom,'id_famille' => $id_famille,'role' => $role]);
    }

    public function updateCategorie($id_cat, $nouveauNom, $role) {
    // On met à jour le nom de la catégorie pour l'ID spécifique
    $query = 'UPDATE CAT 
              SET nom = :nom , role = :role
              WHERE id_cat = :id_cat';
    
    $stmt = $this->dal->prepare($query);
    
    return $stmt->execute([
        'nom'    => $nouveauNom,
        'role'    => $role,
        'id_cat' => $id_cat
    ]);
}

    

    public function deleteCategorie($id_famille,$id_categorie) : bool {
        $query = 'DELETE FROM CAT WHERE id_famille = :id_famille AND id_cat = :id_categorie';
        $stmt = $this->dal->prepare($query);

        return $stmt->execute(['id_famille' => $id_famille,'id_categorie' => $id_categorie]);
    }

    
}