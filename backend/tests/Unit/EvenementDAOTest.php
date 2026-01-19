<?php

use PHPUnit\Framework\TestCase;

// Adapte les chemins selon ton arborescence
require_once __DIR__ . '/../../model/dal.class.php';
require_once __DIR__ . '/../../model/EvenementDAO.class.php'; // Attention majuscule/minuscule selon ton fichier
require_once __DIR__ . '/../../model/evenement.class.php';

class EvenementDAOTest extends TestCase
{
    private $dalMock;
    private $stmtMock;
    private $dao;

    protected function setUp(): void
    {
        // 1. Création des doublures (Mocks)
        $this->dalMock = $this->createMock(DAL::class);
        $this->stmtMock = $this->createMock(PDOStatement::class);

        // 2. Comportement par défaut : prepare() renvoie toujours notre faux statement
        $this->dalMock->method('prepare')->willReturn($this->stmtMock);

        // 3. Injection de la fausse DAL dans le DAO
        $this->dao = new EvenementDAO($this->dalMock);
    }

    public function testFindByIdSuccess()
    {
        // Simulation d'une ligne de base de données
        $fakeRow = [
            'id_event' => '10',
            'nom' => 'Anniversaire',
            'lieu' => 'Paris',
            'note' => 'Super fête',
            'date_deb' => '2024-01-01',
            'date_fin' => '2024-01-02'
        ];

        // Configuration : fetch renvoie cette ligne
        $this->stmtMock->method('fetch')->willReturn($fakeRow);
        $this->stmtMock->method('execute')->willReturn(true);

        // Action
        $event = $this->dao->findById('10');

        // Assertions
        $this->assertInstanceOf(Evenement::class, $event);
        $this->assertEquals('Anniversaire', $event->nom);
        $this->assertEquals('Paris', $event->lieu);
    }

    public function testFindByIdReturnsNullIfNotFound()
    {
        // Configuration : fetch renvoie false (pas trouvé)
        $this->stmtMock->method('fetch')->willReturn(false);

        // Action
        $event = $this->dao->findById('999');

        // Assertion
        $this->assertNull($event);
    }

    public function testGetFutureEvenements()
    {
        $fakeRows = [
            ['id_event' => 1, 'nom' => 'Event A', 'id_famille' => 5],
            ['id_event' => 2, 'nom' => 'Event B', 'id_famille' => 5]
        ];

        $this->stmtMock->method('fetchAll')->willReturn($fakeRows);

        $events = $this->dao->getFutureEvenements('5');

        $this->assertCount(2, $events);
        $this->assertEquals('Event A', $events[0]->nom);
    }

    public function testAddEvenement()
    {
        // Ton DAO utilise "RETURNING id_event", donc il fait un fetch() après l'insert
        // On doit simuler ce retour d'ID.
        $this->stmtMock->method('fetch')->willReturn(['id_event' => 42]);
        $this->stmtMock->method('execute')->willReturn(true);

        $id = $this->dao->addEvenement(1, 'Test', '2024-01-01', '2024-01-02', 'Lieu', 'Note');

        $this->assertEquals(42, $id);
    }

    /**
     * Test CRITIQUE : Suppression avec Transaction
     * On vérifie que beginTransaction, commit et les 4 deletes sont appelés.
     */
    public function testDeleteEvenementSuccess()
    {
        // 1. On s'attend à ce que beginTransaction soit appelé une fois
        $this->dalMock->expects($this->once())->method('beginTransaction');

        // 2. On s'attend à ce que prepare soit appelé 4 fois 
        // (DELETE CHARGE, DELETE EFFECTUE, DELETE TRAJET, DELETE EVENEMENT)
        $this->dalMock->expects($this->exactly(4))->method('prepare')->willReturn($this->stmtMock);

        // 3. On s'attend à ce que commit soit appelé une fois à la fin
        $this->dalMock->expects($this->once())->method('commit')->willReturn(true);

        // 4. Le statement doit s'exécuter correctement à chaque fois
        $this->stmtMock->method('execute')->willReturn(true);

        // Action
        $result = $this->dao->deleteEvenement('1', '10');

        // Assertion
        $this->assertTrue($result);
    }

    public function testDeleteEvenementRollbackOnFailure()
    {
        // Simulation d'un crash : beginTransaction ok, mais prepare lance une exception
        $this->dalMock->method('beginTransaction');
        $this->dalMock->method('prepare')->willThrowException(new Exception("Erreur SQL"));

        // On vérifie que rollBack est bien appelé en cas d'erreur !
        $this->dalMock->expects($this->once())->method('rollBack');

        // On s'attend à ce que notre méthode lance l'exception plus haut
        $this->expectException(Exception::class);

        // Action
        $this->dao->deleteEvenement('1', '10');
    }

    public function testUpdateEvenement()
    {
        $this->stmtMock->method('execute')->willReturn(true);

        $result = $this->dao->updateEvenement(10, 'NomModif', '2024-01-01', '2024-01-02', 'LieuModif', 'NoteModif');

        $this->assertTrue($result);
    }

    public function testGetAccompagnants()
    {
        $fakeRows = [
            ['id_personne' => 1, 'prenom' => 'Jean', 'nom' => 'Dupont'],
            ['id_personne' => 2, 'prenom' => 'Marie', 'nom' => 'Curie']
        ];

        $this->stmtMock->method('fetchAll')->willReturn($fakeRows);

        $result = $this->dao->getAccompagnants(10);

        $this->assertIsArray($result);
        $this->assertCount(2, $result);
        $this->assertEquals('Jean', $result[0]['prenom']);
    }
}