<?php

use PHPUnit\Framework\TestCase;

// Adapte les chemins selon ton architecture
require_once __DIR__ . '/../../model/dal.class.php';
require_once __DIR__ . '/../../model/PersonneDAO.class.php';
require_once __DIR__ . '/../../model/personne.class.php';

class PersonneDAOTest extends TestCase
{
    /**
     * Teste l'insertion d'une personne (méthode insert)
     */
    public function testInsert()
    {
        // 1. Création des Mocks
        $dalMock = $this->createMock(DAL::class);
        $stmtMock = $this->createMock(PDOStatement::class);

        // 2. Configuration du comportement attendu
        $dalMock->method('prepare')->willReturn($stmtMock);
        // On s'attend à ce que execute renvoie true
        $stmtMock->method('execute')->willReturn(true);

        // 3. Préparation de la donnée
        // On crée l'objet Personne via son tableau de données
        $data = [
            'nom' => 'Doe',
            'prenom' => 'John',
            'mail' => 'john@test.com',
            'username' => 'johndoe',
            'mdp' => 'hash_du_mot_de_passe',
            'date_naissance' => '1990-01-01'
        ];
        $personne = new Personne($data);

        // 4. Injection et Exécution
        $dao = new PersonneDAO($dalMock);
        $result = $dao->insert($personne);

        // 5. Assertion
        $this->assertTrue($result, "L'insertion devrait réussir et retourner true");
    }

    /**
     * Teste findByUsername quand l'utilisateur EXISTE
     */
    public function testFindByUsernameSuccess()
    {
        $dalMock = $this->createMock(DAL::class);
        $stmtMock = $this->createMock(PDOStatement::class);

        // Simulation de la ligne retournée par la BDD
        // IMPORTANT : Utilise les clés que ton constructeur Personne attend (id_personne, etc.)
        $fakeRow = [
            'id_personne' => '50', // Ton DAO utilise id_personne dans le SELECT
            'nom' => 'Connor',
            'prenom' => 'Sarah',
            'mail' => 'sarah@skynet.com',
            'username' => 'sconnor',
            'mdp' => '$2y$10$ExempleDeHash',
            'date_naissance' => '1985-05-20'
        ];

        $dalMock->method('prepare')->willReturn($stmtMock);
        $stmtMock->method('execute')->willReturn(true);
        $stmtMock->method('fetch')->willReturn($fakeRow);

        $dao = new PersonneDAO($dalMock);
        $result = $dao->findByUsername('sconnor');

        // Vérifications
        $this->assertInstanceOf(Personne::class, $result);
        $this->assertEquals('sconnor', $result->username);
        $this->assertEquals('sarah@skynet.com', $result->mail);
        // Vérification de l'ID mappé correctement
        $this->assertEquals('50', $result->id); 
    }

    /**
     * Teste findByUsername quand l'utilisateur N'EXISTE PAS
     */
    public function testFindByUsernameNotFound()
    {
        $dalMock = $this->createMock(DAL::class);
        $stmtMock = $this->createMock(PDOStatement::class);

        $dalMock->method('prepare')->willReturn($stmtMock);
        // fetch retourne false si rien n'est trouvé
        $stmtMock->method('fetch')->willReturn(false);

        $dao = new PersonneDAO($dalMock);
        $result = $dao->findByUsername('fantome');

        $this->assertNull($result, "Doit retourner null si le username n'existe pas");
    }

    /**
     * Teste findPersonneById quand l'ID EXISTE
     */
    public function testFindPersonneByIdSuccess()
    {
        $dalMock = $this->createMock(DAL::class);
        $stmtMock = $this->createMock(PDOStatement::class);

        $fakeRow = [
            'id_personne' => '12',
            'nom' => 'Kent',
            'prenom' => 'Clark',
            'mail' => 'clark@dailyplanet.com',
            'username' => 'superman',
            'mdp' => 'krypton',
            'date_naissance' => '1980-02-29'
        ];

        $dalMock->method('prepare')->willReturn($stmtMock);
        $stmtMock->method('execute')->willReturn(true);
        $stmtMock->method('fetch')->willReturn($fakeRow);

        $dao = new PersonneDAO($dalMock);
        // Note: ta méthode attend un string pour l'ID
        $result = $dao->findPersonneById('12');

        $this->assertInstanceOf(Personne::class, $result);
        $this->assertEquals('12', $result->id);
        $this->assertEquals('Clark', $result->prenom);
    }

    /**
     * Teste findPersonneById quand l'ID N'EXISTE PAS
     */
    public function testFindPersonneByIdNotFound()
    {
        $dalMock = $this->createMock(DAL::class);
        $stmtMock = $this->createMock(PDOStatement::class);

        $dalMock->method('prepare')->willReturn($stmtMock);
        $stmtMock->method('fetch')->willReturn(false);

        $dao = new PersonneDAO($dalMock);
        $result = $dao->findPersonneById('99999');

        $this->assertNull($result);
    }
}