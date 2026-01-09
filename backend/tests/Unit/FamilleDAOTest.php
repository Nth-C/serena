<?php

use PHPUnit\Framework\TestCase;

// Adapte les chemins selon ton projet
require_once __DIR__ . '/../../model/dal.class.php';
require_once __DIR__ . '/../../model/FamilleDAO.class.php';
require_once __DIR__ . '/../../model/famille.class.php';
// On suppose que Personne existe (nécessaire pour getPersFam)
require_once __DIR__ . '/../../model/personne.class.php'; 

class FamilleDAOTest extends TestCase
{
    /**
     * Teste insert()
     */
    public function testInsert()
    {
        $dalMock = $this->createMock(DAL::class);
        $stmtMock = $this->createMock(PDOStatement::class);

        $dalMock->method('prepare')->willReturn($stmtMock);
        $stmtMock->method('execute')->willReturn(true);

        // ADAPTATION : On utilise les clés attendues par ton constructeur
        // Note : 'description' (clé tableau) -> devient $famille->desc
        $data = [
            'nom' => 'Famille Test', 
            'description' => 'Ma description', 
            'nom_aide' => 'Aide'
        ];
        $famille = new Famille($data);

        $dao = new FamilleDAO($dalMock);
        $result = $dao->insert($famille);

        $this->assertTrue($result);
    }

    /**
     * Teste update()
     */
    public function testUpdate()
    {
        $dalMock = $this->createMock(DAL::class);
        $stmtMock = $this->createMock(PDOStatement::class);

        $dalMock->method('prepare')->willReturn($stmtMock);
        $stmtMock->method('execute')->willReturn(true);

        // ADAPTATION : id_famille est readonly, on doit le passer dans le tableau à la création
        $data = [
            'id_famille' => 42, // L'ID qu'on veut mettre à jour
            'nom' => 'Famille Modif', 
            'description' => 'Nouvelle desc', 
            'nom_aide' => 'Nouvelle Aide'
        ];
        $famille = new Famille($data);

        $dao = new FamilleDAO($dalMock);
        $result = $dao->update($famille);

        $this->assertTrue($result);
    }

    /**
     * Teste findByName()
     */
    public function testFindByNameSuccess()
    {
        $dalMock = $this->createMock(DAL::class);
        $stmtMock = $this->createMock(PDOStatement::class);

        // ADAPTATION : Simulation de la ligne BDD.
        // Les clés doivent correspondre à ce que ton constructeur attend !
        $fakeRow = [
            'id_famille' => 5,
            'nom' => 'Dupont',
            'description' => 'Description venant de la BDD', // Important: clé 'description'
            'nom_aide' => 'Soignant'
        ];

        $dalMock->method('prepare')->willReturn($stmtMock);
        $stmtMock->method('execute')->willReturn(true);
        $stmtMock->method('fetch')->willReturn($fakeRow);

        $dao = new FamilleDAO($dalMock);
        $familleRecuperee = $dao->findByName('Dupont');

        // Vérifications
        $this->assertInstanceOf(Famille::class, $familleRecuperee);
        $this->assertEquals(5, $familleRecuperee->id_famille);
        $this->assertEquals('Dupont', $familleRecuperee->nom);
        // ADAPTATION : On vérifie la propriété 'desc', mappée depuis 'description'
        $this->assertEquals('Description venant de la BDD', $familleRecuperee->desc);
    }

    /**
     * Teste findByPersonne()
     */
    public function testFindByPersonne()
    {
        $dalMock = $this->createMock(DAL::class);
        $stmtMock = $this->createMock(PDOStatement::class);

        // Simulation de plusieurs lignes BDD
        $fakeRows = [
            ['id_famille' => 1, 'nom' => 'F1', 'description' => 'D1', 'nom_aide' => 'A1'],
            ['id_famille' => 2, 'nom' => 'F2', 'description' => 'D2', 'nom_aide' => 'A2']
        ];

        $dalMock->method('prepare')->willReturn($stmtMock);
        $stmtMock->method('execute')->willReturn(true);
        $stmtMock->method('fetchAll')->willReturn($fakeRows);

        $dao = new FamilleDAO($dalMock);
        $liste = $dao->findByPersonne(10); // ID arbitraire

        $this->assertIsArray($liste);
        $this->assertCount(2, $liste);
        $this->assertEquals('F1', $liste[0]->nom);
        $this->assertEquals('D1', $liste[0]->desc); // Vérif du mapping description -> desc
    }
    
    // ... Les autres tests (getPersFam, AddPersFam) restent identiques 
    // car ils dépendent de la classe Personne, pas de la structure de Famille.
}