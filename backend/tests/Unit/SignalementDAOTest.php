<?php

use PHPUnit\Framework\TestCase;

// Adapte les chemins selon ton architecture
require_once __DIR__ . '/../../model/dal.class.php';
require_once __DIR__ . '/../../model/SignalementDAO.class.php';
require_once __DIR__ . '/../../model/signalement.class.php';

class SignalementDAOTest extends TestCase
{
    private $dalMock;
    private $stmtMock;
    private $dao;

    protected function setUp(): void
    {
        // 1. Création des Mocks
        $this->dalMock = $this->createMock(DAL::class);
        $this->stmtMock = $this->createMock(PDOStatement::class);

        // 2. Configuration : prepare() renvoie toujours notre faux statement
        $this->dalMock->method('prepare')->willReturn($this->stmtMock);

        // 3. Injection : On passe le mock au DAO (nécessite la correction du constructeur)
        $this->dao = new SignalementDAO($this->dalMock);
    }

    /**
     * Test de getAllSignalement
     * NOTE : Dans ton DAO actuel, cette méthode retourne un tableau brut (array),
     * elle ne convertit pas les résultats en objets "Signalement".
     */
    public function testGetAllSignalement()
    {
        // Simulation des données brutes BDD
        $fakeRows = [
            [
                'id_signal' => 1,
                'sujet' => 'Bug affichage',
                'message' => 'Le bouton ne marche pas',
                'mail_signal' => 'user@test.com',
                'status' => 'En cours',
                'id_pers_signal' => 10
            ]
        ];

        // Configuration du Mock
        $this->stmtMock->method('fetchAll')->willReturn($fakeRows);
        $this->stmtMock->method('execute')->willReturn(true);

        // Action
        $result = $this->dao->getAllSignalement(10);

        // Assertions
        $this->assertIsArray($result);
        $this->assertCount(1, $result);
        
        // Comme ton DAO retourne un tableau associatif brut, on teste les clés du tableau
        // et non pas les propriétés d'un objet ($result[0]->sujet ne marcherait pas ici)
        $this->assertEquals('Bug affichage', $result[0]['sujet']);
        $this->assertEquals('user@test.com', $result[0]['mail_signal']);
    }

    public function testAddSignalement()
    {
        // On s'attend à une exécution réussie
        $this->stmtMock->method('execute')->willReturn(true);

        // Action
        $result = $this->dao->addSignalement('Sujet Test', 'Message Test', 'email@test.com', 10);

        // Assertion
        $this->assertTrue($result);
    }

    public function testDeleteSignalement()
    {
        // Configuration
        $this->stmtMock->method('execute')->willReturn(true);

        // Action
        $result = $this->dao->deleteSignalement(1, 10);

        // Assertion
        $this->assertTrue($result);
    }

    public function testUpdateSignalement()
    {
        // Configuration
        $this->stmtMock->method('execute')->willReturn(true);

        // Action
        $result = $this->dao->updateSignalement(1, 10, 'Fermé');

        // Assertion
        $this->assertTrue($result);
    }

    /**
     * Test : Récupération d'email réussie
     */
    public function testGetEmailFound()
    {
        // Simulation : la BDD trouve l'email
        $fakeRow = ['mail' => 'trouve@example.com'];

        $this->stmtMock->method('fetch')->willReturn($fakeRow);
        $this->stmtMock->method('execute')->willReturn(true);

        // Action
        $email = $this->dao->getEmail(50);

        // Assertion
        $this->assertEquals('trouve@example.com', $email);
    }

    /**
     * Test : Email non trouvé (retourne null)
     */
    public function testGetEmailNotFoundReturnsNull()
    {
        // Simulation : fetch renvoie false (pas de résultat)
        $this->stmtMock->method('fetch')->willReturn(false);

        // Action
        $email = $this->dao->getEmail(999);

        // Assertion
        $this->assertNull($email);
    }
}