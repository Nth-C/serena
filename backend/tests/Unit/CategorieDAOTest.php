<?php

use PHPUnit\Framework\TestCase;

// Adapte les chemins selon ton architecture
require_once __DIR__ . '/../../model/dal.class.php';
require_once __DIR__ . '/../../model/CategorieDAO.class.php'; // Attention au nom du fichier (majuscule/minuscule)
require_once __DIR__ . '/../../model/categorie.class.php';

class CategorieDAOTest extends TestCase
{
    private $dalMock;
    private $stmtMock;
    private $dao;

    protected function setUp(): void
    {
        // 1. Mocks
        $this->dalMock = $this->createMock(DAL::class);
        $this->stmtMock = $this->createMock(PDOStatement::class);

        // 2. Prepare renvoie toujours le statement mocké
        $this->dalMock->method('prepare')->willReturn($this->stmtMock);

        // 3. Injection (nécessite la correction du constructeur)
        $this->dao = new CategorieDAO($this->dalMock);
    }

    /**
     * Teste que la méthode retourne bien des objets Categorie
     */
    public function testGetAllCategoriesReturnsObjects()
    {
        // Simulation des données BDD
        $fakeRows = [
            ['id_cat' => 1, 'nom' => 'Santé', 'id_famille' => 10, 'role' => 'Professionelle'],
            ['id_cat' => 2, 'nom' => 'Souvenirs', 'id_famille' => 10, 'role' => 'Famille']
        ];

        $this->stmtMock->method('fetchAll')->willReturn($fakeRows);
        $this->stmtMock->method('execute')->willReturn(true);

        // On teste avec un rôle 'Createur' (qui voit tout)
        $result = $this->dao->getAllCategories(10, 'Createur');

        $this->assertCount(2, $result);
        $this->assertInstanceOf(Categorie::class, $result[0]);
        $this->assertEquals('Santé', $result[0]->nom);
    }

    /**
     * Teste la logique de filtrage des rôles (la partie complexe de ton DAO)
     */
    public function testGetAllCategoriesLogicForProche()
    {
        // Si je suis 'Proche', je dois voir 'Proche' ET 'Professionelle'
        // On va vérifier les paramètres envoyés à la méthode execute()
        
        $this->stmtMock->expects($this->once())
            ->method('execute')
            ->with($this->callback(function($params) {
                // On vérifie que les paramètres contiennent bien les rôles attendus
                // $params ressemble à [':id_famille' => 10, ':r0' => 'Proche', ':r1' => 'Professionelle']
                // On vérifie les valeurs (array_values) pour ne pas se soucier des clés :r0, :r1
                $values = array_values($params);
                return in_array('Proche', $values) && in_array('Professionelle', $values) && !in_array('Famille', $values);
            }))
            ->willReturn(true);
            
        // On force un retour vide pour le fetchAll car on teste surtout l'execute ici
        $this->stmtMock->method('fetchAll')->willReturn([]);

        $this->dao->getAllCategories(10, 'Proche');
    }

    /**
     * Teste le cas "Createur" qui doit tout voir
     */
    public function testGetAllCategoriesLogicForCreateur()
    {
        $this->stmtMock->expects($this->once())
            ->method('execute')
            ->with($this->callback(function($params) {
                $values = array_values($params);
                return in_array('Createur', $values) 
                    && in_array('Famille', $values) 
                    && in_array('Proche', $values)
                    && in_array('Professionelle', $values);
            }))
            ->willReturn(true);
            
        $this->stmtMock->method('fetchAll')->willReturn([]);

        $this->dao->getAllCategories(10, 'Createur');
    }

    public function testGetAllCategoriesReturnsEmptyArrayIfNoneFound()
    {
        // fetchAll renvoie false ou tableau vide
        $this->stmtMock->method('fetchAll')->willReturn([]);

        $result = $this->dao->getAllCategories(10, 'Professionelle');

        $this->assertIsArray($result);
        $this->assertEmpty($result);
    }

    public function testAddCategorie()
    {
        $this->stmtMock->method('execute')->willReturn(true);

        $result = $this->dao->addCategorie(10, 'Nouvelle Cat', 'Famille');

        $this->assertTrue($result);
    }

    public function testUpdateCategorie()
    {
        $this->stmtMock->method('execute')->willReturn(true);

        $result = $this->dao->updateCategorie(1, 'Nom Modifié', 'Proche');

        $this->assertTrue($result);
    }

    public function testDeleteCategorie()
    {
        $this->stmtMock->method('execute')->willReturn(true);

        $result = $this->dao->deleteCategorie(10, 5); // id_famille, id_cat

        $this->assertTrue($result);
    }
}