<?php
require_once(__DIR__ . '/../model/AidesDAO.class.php');
require_once(__DIR__ . '/../app.php');

header("Content-Type: application/json");

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode([]);
    exit;
}

// Fonction pour transformer les entrées React (bool ou string) en booléen PHP pur
function toBool($val) {
    return ($val === true || $val === 'true' || $val === 1 || $val === '1');
}

$dao = new AideDAO();
$allAides = $dao->getAllAides();
$aidesValides = [];

// Extraction des données du formulaire 
$statut   = $data['statut_pro'] ?? '';
$gir      = $data['gir'] ?? '';
$medical  = $data['situation_medicale'] ?? '';
$objectif = $data['objectif'] ?? '';
$fiscal   = $data['fiscalite'] ?? '';
$depenses = $data['depenses'] ?? '';
$role     = $data['role'] ?? '';
$age      = $data['age_aide'] ?? '';
$apa      = toBool($data['aide_apa'] ?? false);
$pch      = toBool($data['aide_pch'] ?? false);
$aucune   = toBool($data['aide_aucune'] ?? false);

foreach ($allAides as $aide) {
    $show = false;
    $id = (int)$aide['id_aide_fin'];

    switch ($id) {
        case 1: // AJPA [cite: 1, 2]
            if (in_array($statut, ['Salarie', 'Chomeur']) && in_array($gir, ['GIR 1-2', 'GIR 3-4'])) $show = true;
            break;
        case 2: // AJAP [cite: 1, 8]
            if ($medical === 'FinDeVie') $show = true;
            break;
        case 3: // Salariat APA [cite: 1, 13]
            if ($role !== 'conjoint' && $apa === true) $show = true;
            break;
        case 4: // MTP [cite: 1, 60]
            if ($age === 'moinsLimiteAge' && $apa === false) $show = true;
            break;
        case 5: // PCRH [cite: 1, 101]
            if ($statut === 'Salarie') $show = true;
            break;
        case 7: // Crédit Impôt [cite: 1, 40]
            if ($fiscal === 'imposable' && $depenses === 'PayeFacture') $show = true;
            break;
        case 8: // Déduction Obligation Alimentaire [cite: 1, 45]
            if ($fiscal === 'imposable' && $depenses === 'DonneArgent') $show = true;
            break;
        case 9: // Exonération Cotisations [cite: 1, 65]
            if ($age === 'plusLimiteAge' || in_array($gir, ['GIR 1-2', 'GIR 3-4'])) $show = true;
            break;
        case 10: // TVA Réduite [cite: 1, 106]
            if ($objectif === 'remunere') $show = true;
            break;
        case 11: // Abattement Taxe Foncière [cite: 1, 111]
            if ($age === 'plusLimiteAge') $show = true;
            break;
        case 12: // MaPrimeAdapt' [cite: 1, 50]
            if (in_array($gir, ['GIR 1-2', 'GIR 3-4']) || $age === 'plusLimiteAge') $show = true;
            break;
        case 13: // Aide Action Logement 
            if ($statut === 'Salarie') $show = true;
            break;
        case 14: // Forfait Incontinence 
            if ($medical === 'Vieillesse') $show = true;
            break;
        case 15: // Téléassistance [cite: 1, 86]
            if ($age === 'plusLimiteAge' && $objectif === 'repos') $show = true;
            break;
        case 16: // AVA [cite: 1, 24]
            if (in_array($gir, ['GIR 1-2', 'GIR 3-4']) && in_array($statut, ['Salarie', 'Chomeur', 'Independant'])) $show = true;
            break;
        case 17: // Trimestres Majorés [cite: 1, 71]
            if ($role === 'famille' && $gir === 'GIR 1-2') $show = true;
            break;
        case 18: // Aide au Répit Agirc-Arrco [cite: 1, 76]
            if ($statut === 'Retraite') $show = true;
            break;
        case 19: // Droit au Répit APA [cite: 1, 30]
            if ($apa === true && $gir === 'GIR 1-2' && $objectif === 'repos') $show = true;
            break;
        case 20: // Relais Particulier Emploi 
            if ($objectif === 'repos' && $role === 'proche') $show = true;
            break;
        case 21: // Vacances Répit [cite: 1, 91]
            if ($medical === 'Vieillesse' && $objectif === 'repos') $show = true;
            break;
        case 22: // Aide Bien Vieillir [cite: 1, 55]
            if ($gir === 'GIR 5-6' && $aucune === true) $show = true;
            break;
    }

    if ($show) {
        $aidesValides[] = $aide;
    }
}

echo json_encode($aidesValides);