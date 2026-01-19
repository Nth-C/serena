<?php

use PHPUnit\Framework\TestCase;

// Adapte les chemins selon ton architecture
require_once __DIR__ . '/../../model/dal.class.php';
require_once __DIR__ . '/../../model/MedicamentDAO.class.php';
require_once __DIR__ . '/../../model/medicament.class.php';

class MedicamentDAOTest extends TestCase
{
    private $dalMock;
    private $stmtMock;
    private $dao;

    protected function setUp(): void
    {
        // 1. Création des mocks
        $this->dalMock = $this->createMock(DAL::class);
        $this->stmtMock = $this->createMock(PDOStatement::class);

        // 2. Le prepare renvoie toujours notre faux statement
        $this->dalMock->method('prepare')->willReturn($this->stmtMock);

        // 3. Injection du mock
        $this->dao = new MedicamentDAO($this->dalMock);
    }

    public function testGetNbMedicament()
    {
        // Attention : Dans ton code, si fetchAll renvoie vide, $medicaments n'est pas initialisé
        // Je simule donc un résultat positif ici.
        $fakeRows = [
            ['quantite' => 5, 'designation_med' => 'Doliprane']
        ];

        $this->stmtMock->method('fetchAll')->willReturn($fakeRows);
        $this->stmtMock->method('execute')->willReturn(true);

        $result = $this->dao->getNbMedicament(1, 'Doliprane');

        $this->assertIsArray($result);
        $this->assertInstanceOf(Medicament::class, $result[0]);
        // Vérifie le mapping (quantite -> stock dans ta classe Medicament)
        $this->assertEquals(5, $result[0]->stock);
    }

    public function testGetAllMedicaments()
    {
        // Simulation d'une jointure STOCK_MEDICS + CAT_MEDICS
        $fakeRows = [
            [
                'id_medicament' => '10',
                'designation_med' => 'Aspirine',
                'quantite' => 10,
                'total' => 20,
                'designation_elem_pharma' => 'Comprimé', // Correspond au type
                'id_famille' => 1
            ]
        ];

        $this->stmtMock->method('fetchAll')->willReturn($fakeRows);

        $result = $this->dao->getAllMedicaments(1);

        $this->assertCount(1, $result);
        $this->assertEquals('Aspirine', $result[0]->nomMedicament);
        $this->assertEquals('Comprimé', $result[0]->type);
    }

    public function testGetAllMedicamentsUrgent()
    {
        // Ici, on teste que la méthode transforme bien le retour SQL en objets.
        // La logique SQL (le OR complexe) est testée par la base de données réelle, 
        // ici on simule que la BDD a bien renvoyé les médicaments urgents.
        $fakeRows = [
            ['id_medicament' => '50', 'designation_med' => 'UrgentMed', 'quantite' => 1, 'total' => 100]
        ];

        $this->stmtMock->method('fetchAll')->willReturn($fakeRows);

        $result = $this->dao->getAllMedicamentsUrgent(1);

        $this->assertCount(1, $result);
        $this->assertEquals('UrgentMed', $result[0]->nomMedicament);
    }

    public function testSearchNomMedicament()
    {
        // Ta méthode retourne un tableau associatif ["resultats" => [...]]
        $fakeRows = [
            ['denomination_substance' => 'Paracétamol'],
            ['denomination_substance' => 'Paraflu']
        ];

        $this->stmtMock->method('fetchAll')->willReturn($fakeRows);

        $result = $this->dao->searchNomMedicament('Para');

        $this->assertIsArray($result);
        $this->assertArrayHasKey('resultats', $result);
        $this->assertCount(2, $result['resultats']);
        $this->assertEquals('Paracétamol', $result['resultats'][0]['denomination_substance']);
    }

    public function testIsGoodNameReturnsTrueIfFound()
    {
        // Ta méthode utilise fetchColumn qui renvoie "1" si trouvé
        $this->stmtMock->method('fetchColumn')->willReturn(1);

        $result = $this->dao->isGoodName('Doliprane');

        $this->assertTrue($result);
    }

    public function testIsGoodNameReturnsFalseIfNotFound()
    {
        // fetchColumn renvoie false si rien n'est trouvé
        $this->stmtMock->method('fetchColumn')->willReturn(false);

        $result = $this->dao->isGoodName('Inconnu');

        $this->assertFalse($result);
    }

    public function testGetTypesByNomExact()
    {
        $fakeRows = [
            ['id_medics' => 1, 'designation_elem_pharma' => 'Sirop'],
            ['id_medics' => 2, 'designation_elem_pharma' => 'Gélule']
        ];

        $this->stmtMock->method('fetchAll')->willReturn($fakeRows);

        $result = $this->dao->getTypesByNomExact('Doliprane');

        $this->assertCount(2, $result);
    }

    public function testUpdateMedecine()
    {
        $this->stmtMock->method('execute')->willReturn(true);
        $result = $this->dao->updateMedecine(1, 50, 10); // id_famille, stock, id_med
        $this->assertTrue($result);
    }

    public function testAddSameMedecine()
    {
        $this->stmtMock->method('execute')->willReturn(true);
        $result = $this->dao->addSameMedecine(1, 10, 5); // id_famille, id_med, stockAjout
        $this->assertTrue($result);
    }

    public function testDeleteMedecine()
    {
        $this->stmtMock->method('execute')->willReturn(true);
        $result = $this->dao->deleteMedecine(1, 10);
        $this->assertTrue($result);
    }

    /**
     * Teste le cas normal où le stock est inférieur au total
     */
    public function testAddMedecineNormal()
    {
        $this->stmtMock->method('execute')->willReturn(true);
        
        // Stock (10) <= Total (20), pas de changement attendu
        $result = $this->dao->addMedecine(1, 'Med', 10, 20, 'cat_1');
        
        $this->assertTrue($result);
    }

    /**
     * Teste la logique de sécurité : si Stock > Total, Total devient égal au Stock
     */
    public function testAddMedecineCorrigeLeTotal()
    {
        // On veut vérifier les arguments passés à execute()
        // Situation : Stock (50) > Total (10)
        // Attendu : Le DAO doit envoyer Total = 50 à la base de données
        
        $this->stmtMock->expects($this->once())
             ->method('execute')
             ->with($this->callback(function($params) {
                 // On vérifie que dans les paramètres envoyés SQL, stockTotal a été modifié
                 return $params['stockTotal'] === 50 && $params['stock'] === 50;
             }))
             ->willReturn(true);

        $this->dao->addMedecine(1, 'Med', 50, 10, 'cat_1');
    }
}