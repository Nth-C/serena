<?php

use PHPUnit\Framework\TestCase;

// Adapte ces chemins selon ton architecture de dossiers réelle
require_once __DIR__ . '/../../model/dal.class.php';
require_once __DIR__ . '/../../model/DocumentDAO.class.php';
require_once __DIR__ . '/../../model/document.class.php';

class DocumentDAOTest extends TestCase
{
    private $dalMock;
    private $stmtMock;
    private $dao;

    protected function setUp(): void
    {
        // Cette méthode s'exécute avant CHAQUE test.
        // On réinitialise les mocks pour partir d'une base propre à chaque fois.

        // 1. Création du Mock de la DAL
        $this->dalMock = $this->createMock(DAL::class);

        // 2. Création du Mock du Statement (PDOStatement)
        $this->stmtMock = $this->createMock(PDOStatement::class);

        // 3. Injection : On dit au Mock DAL de renvoyer notre Mock Statement quand on fait un prepare()
        $this->dalMock->method('prepare')->willReturn($this->stmtMock);

        // 4. On instancie le DAO avec notre fausse DAL
        $this->dao = new DocumentDAO($this->dalMock);
    }

    public function testAddDocument()
    {
        // Configuration : execute renvoie true
        $this->stmtMock->method('execute')->willReturn(true);

        // Action
        $result = $this->dao->addDocument('1', '2', 'mon_fichier.pdf', 'http://url.com');

        // Assertion
        $this->assertTrue($result);
    }

    public function testDeleteDocument()
    {
        // Configuration : execute renvoie true
        $this->stmtMock->method('execute')->willReturn(true);

        // Action
        $result = $this->dao->deleteDocument('12');

        // Assertion
        $this->assertTrue($result);
    }

    public function testGetDocumentById()
    {
        // Données simulées venant de la BDD
        $fakeRow = [
            'id_doc' => 12,
            'nom_doc' => 'Contrat.pdf',
            'url' => 'http://test',
            'type' => 'pdf',
            'id_cat' => 2
        ];

        // Configuration : fetch renvoie une ligne
        $this->stmtMock->method('fetch')->willReturn($fakeRow);
        $this->stmtMock->method('execute')->willReturn(true);

        // Action
        $result = $this->dao->getDocumentById('12');

        // Assertion : On vérifie qu'on récupère bien le tableau
        $this->assertIsArray($result);
        $this->assertEquals('Contrat.pdf', $result['nom_doc']);
    }

    public function testGetDocuments()
    {
        // Données simulées (plusieurs lignes)
        $fakeRows = [
            ['id_doc' => 1, 'nom_doc' => 'Doc A', 'url' => 'u1', 'type' => 't1', 'id_cat' => 10],
            ['id_doc' => 2, 'nom_doc' => 'Doc B', 'url' => 'u2', 'type' => 't2', 'id_cat' => 10]
        ];

        // Configuration : fetchAll renvoie le tableau
        $this->stmtMock->method('fetchAll')->willReturn($fakeRows);
        $this->stmtMock->method('execute')->willReturn(true);

        // Action
        $documents = $this->dao->getDocuments('1');

        // Assertions
        $this->assertCount(2, $documents);
        $this->assertInstanceOf(Document::class, $documents[0]);
        $this->assertEquals('Doc A', $documents[0]->nom_doc);
        $this->assertEquals('Doc B', $documents[1]->nom_doc);
    }

    public function testGetDocumentsReturnsEmptyArrayIfNoResult()
    {
        // CORRECTION : On retourne un tableau vide [] au lieu de false
        // Car la signature de fetchAll oblige à retourner un array.
        $this->stmtMock->method('fetchAll')->willReturn([]);

        // Action
        $documents = $this->dao->getDocuments('999');

        // Assertion
        $this->assertIsArray($documents);
        $this->assertEmpty($documents);
    }
    public function testGetDocumentsDeIdCategorie()
    {
        $fakeRows = [
            ['id_doc' => 5, 'nom_doc' => 'Doc Cat', 'url' => 'u', 'type' => 'img', 'id_cat' => 50]
        ];

        $this->stmtMock->method('fetchAll')->willReturn($fakeRows);

        $documents = $this->dao->getDocumentsDeIdCategorie('1', '50');

        $this->assertCount(1, $documents);
        $this->assertEquals('Doc Cat', $documents[0]->nom_doc);
    }

    /**
     * Test de la méthode complexe qui fait des tris par catégorie
     */
    public function testGetDocumentsParCategorie()
    {
        // Ici, on simule le résultat de ta jointure LEFT JOIN
        $fakeJoinRows = [
            // Ligne 1 : Catégorie "Santé" avec un document "Ordonnance"
            [
                'id_cat' => 10,
                'cat_nom' => 'Santé',
                'id_doc' => 100,
                'nom_doc' => 'Ordonnance.pdf',
                'url' => 'url1',
                'type' => 'pdf'
            ],
            // Ligne 2 : Catégorie "Santé" avec un autre doc "Radio"
            [
                'id_cat' => 10,
                'cat_nom' => 'Santé',
                'id_doc' => 101,
                'nom_doc' => 'Radio.jpg',
                'url' => 'url2',
                'type' => 'jpg'
            ],
            // Ligne 3 : Catégorie "Vide" sans document (id_doc null à cause du LEFT JOIN)
            [
                'id_cat' => 20,
                'cat_nom' => 'Vide',
                'id_doc' => null,
                'nom_doc' => null,
                'url' => null,
                'type' => null
            ]
        ];

        $this->stmtMock->method('fetchAll')->willReturn($fakeJoinRows);

        // Action
        $result = $this->dao->getDocumentsParCategorie('1');

        // Assertions
        // On s'attend à recevoir 2 catégories principales
        $this->assertCount(2, $result);

        // Vérification de la première catégorie (Santé)
        $catSante = $result[0];
        $this->assertEquals('Santé', $catSante['nom']);
        $this->assertCount(2, $catSante['documents']); // Elle doit contenir 2 documents
        $this->assertEquals('Ordonnance.pdf', $catSante['documents'][0]['nom_doc']);

        // Vérification de la deuxième catégorie (Vide)
        $catVide = $result[1];
        $this->assertEquals('Vide', $catVide['nom']);
        $this->assertCount(0, $catVide['documents']); // Elle doit être vide
    }
}