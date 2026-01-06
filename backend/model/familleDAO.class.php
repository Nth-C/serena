<?php
class familleDAO {
    private DAL $dal;

    public function __construct() {
        $this->dal = DAL::get();
    }

    public function insert(Famille $famille): bool {
        $query = 'INSERT INTO fams (nom, "desc", nom_aide,) 
                  VALUES (:nom, :desc, :nom_aide)';
        
        $stmt = $this->dal->prepare($query);

        return $stmt->execute([
            ':nom'            => $famille->nom,
            ':prenom'         => $famille->prenom,
            ':mail'           => $famille->mail 
        ]);
    }

    public function getPersFam($id_famille): array {
        $query = 'SELECT * FROM PERSONNES WHERE id_famille = :id_famille';
        
        $stmt = $this->dal->prepare($query);
        $stmt->execute(['id_famille' => $id_famille]);
        $data = $stmt->fetchAll();

        $resultats = [];

        foreach($data as $row) {
            $resultats[] = new Personne($row);
        }

        return $resultats;
    }

    public function AddPersFam($id_famille,$id_personne): array {
        $query = 'INSERT INTO appartient_a (id_famille, id_personne) VALUES (:id_famille, :id_personne)';
        $stmt = $this->dal->prepare($query);
        $stmt->execute([
            'id_famille'  => $id_famille,
            'id_personne' => $id_personne
        ]);
    }

    public function RmPersFam($id_famille,$id_personne): array {
            $query = 'DELETE FROM appartient_a WHERE id_famille = :id_famille AND id_personne = :id_personne';
            $stmt = $this->dal->prepare($query);
            $stmt->execute([
                        'id_famille'  => $id_famille,
                        'id_personne' => $id_personne
                    ]);
    }
    public function ChangeRole($id_famille, $id_personne, $role): void {
            $query = 'UPDATE appartient_a SET role = :role WHERE id_famille = :id_famille AND id_personne = :id_personne';
            $stmt = $this->dal->prepare($query);
            $stmt->execute([
                'id_famille'  => $id_famille,
                'id_personne' => $id_personne,
                'role'        => $role
            ]);



}