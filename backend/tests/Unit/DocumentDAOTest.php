<?php

use PHPUnit\Framework\TestCase;

// --- CORRECTION ICI ---
// Tu dois inclure explicitement TOUTES les classes que tu utilises dans le test
// ou que tu veux mocker, si tu n'as pas d'autoloader global.

// 1. Inclusion de la DAL
// Attention à la casse du nom de fichier (Linux est sensible à la casse !)
require_once __DIR__ . '/../../model/dal.class.php'; 

// 2. Inclusion du DAO
require_once __DIR__ . '/../../model/DocumentDAO.class.php';

// 3. Inclusion de la classe métier Document (nécessaire pour le testGetDocuments)
// Je suppose que le fichier s'appelle document.class.php ou Document.class.php
require_once __DIR__ . '/../../model/document.class.php'; 


class DocumentDAOTest extends TestCase
{
    // ... Le reste de ton code ne change pas ...
    // On va tester l'ajout d'un document
    public function testAddDocument()
    {
        // 1. Création des Mocks (les doublures)
        // On crée une fausse classe DAL
        $dalMock = $this->createMock(DAL::class);
        // On crée un faux Statement (le résultat d'un prepare)
        $stmtMock = $this->createMock(PDOStatement::class);

        // 2. Configuration du comportement attendu
        
        // Quand on appelle "prepare" sur la DAL, on veut qu'elle retourne notre faux $stmtMock
        $dalMock->method('prepare')
                ->willReturn($stmtMock);

        // Quand on appelle "execute" sur le statement, on veut que ça retourne "true"
        $stmtMock->method('execute')
                 ->willReturn(true);

        // 3. Injection du Mock dans ta classe DAO
        $dao = new DocumentDAO($dalMock);

        // 4. Exécution de la méthode à tester
        $result = $dao->addDocument(1, 2, 'mon_fichier.pdf');

        // 5. Vérifications (Assertions)
        $this->assertTrue($result, "La méthode devrait retourner true si l'insertion réussit");
    }

    // On teste la récupération (avec simulation de données)
    public function testGetDocuments()
    {
        // 1. Mocks
        $dalMock = $this->createMock(DAL::class);
        $stmtMock = $this->createMock(PDOStatement::class);

        // 2. Configuration
        $dalMock->method('prepare')->willReturn($stmtMock);
        
        // On simule une réponse de la base de données (un tableau de tableaux)
        $fakeDbRows = [
            ['id' => 10, 'nom' => 'Doc A', 'id_famille' => 1],
            ['id' => 11, 'nom' => 'Doc B', 'id_famille' => 1]
        ];

        // Attention : Dans ton code tu as mis fetch(), mais pour une liste c'est souvent fetchAll()
        // J'adapte le test pour ton code actuel qui utilise fetch() ou fetchAll() selon le cas
        $stmtMock->method('fetch')->willReturn($fakeDbRows); 
        $stmtMock->method('execute')->willReturn(true);

        // 3. Test
        $dao = new DocumentDAO($dalMock);
        $documents = $dao->getDocuments(1);

        // 4. Vérifications
        $this->assertIsArray($documents);
        $this->assertCount(2, $documents);
        $this->assertInstanceOf(Document::class, $documents[0]);
        $this->assertEquals('Doc A', $documents[0]->nom); // Supposant que l'objet Document a une propriété publique nom
    }
}