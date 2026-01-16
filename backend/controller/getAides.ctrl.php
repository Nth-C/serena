<?php
require_once('model/AideDAO.class.php');
require_once(__DIR__ . '/../app.php');

header("Content-Type: application/json");
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(["error" => "Données manquantes"]);
    exit;
}

$dao = new AideDAO();
$allAides = $dao->getAllAides();
$aidesValides = [];

foreach ($allAides as $aide) {
    $show = false;
    $id = $aide['id_aide_fin'];

    switch ($id) {
        case 1: // AJPA
            if (in_array($data['statut_pro'], ['Salarie', 'Chomeur']) && in_array($data['gir'], ['GIR 1-2', 'GIR 3-4'])) $show = true;
            break;

        case 2: // AJAP
            if ($data['situation_medicale'] === 'FinDeVie') $show = true;
            break;

        case 3: // Salariat APA
            if ($data['role'] !== 'conjoint' && $data['aide_apa']) $show = true;
            break;

        case 4: // MTP (Majoration Tierce Personne)
            if ($data['age_aide'] === 'moinsLimiteAge' && !$data['aide_apa']) $show = true;
            break;

        case 5: // PCRH
            if ($data['statut_pro'] === 'Salarie' && $data['situation_medicale'] === 'AccidentTravail') $show = true;
            break;

        case 7: // Crédit d'Impôt Emploi Domicile
            if ($data['fiscalite'] === 'imposable' && $data['depenses'] === 'PayeFacture') $show = true;
            break;

        case 8: // Déduction Obligation Alimentaire
            if ($data['fiscalite'] === 'imposable' && $data['depenses'] === 'DonneArgent') $show = true;
            break;

        case 9: // Exonération Cotisations Patronales
            if ($data['age_aide'] === 'plusLimiteAge' || in_array($data['gir'], ['GIR 1-2', 'GIR 3-4'])) $show = true;
            break;

        case 10: // TVA Réduite (5,5%)
            if ($data['objectif'] === 'remunere') $show = true; 
            break;

        case 11: // Abattement Taxe Foncière
            if ($data['age_aide'] === 'plusLimiteAge') $show = true; // + condition revenus (géré par le texte)
            break;

        case 12: // MaPrimeAdapt'
            if (in_array($data['gir'], ['GIR 1-2', 'GIR 3-4']) || $data['age_aide'] === 'plusLimiteAge') $show = true;
            break;

        case 13: // Aide Action Logement
            if ($data['statut_pro'] === 'Salarie') $show = true;
            break;

        case 14: // Forfait Incontinence
            if ($data['situation_medicale'] === 'Vieillesse') $show = true;
            break;

        case 15: // Téléassistance
            if ($data['age_aide'] === 'plusLimiteAge' && $data['objectif'] === 'repos') $show = true;
            break;

        case 16: // AVA (Assurance Vieillesse)
            if (in_array($data['gir'], ['GIR 1-2', 'GIR 3-4']) && in_array($data['statut_pro'], ['Salarie', 'Chomeur'])) $show = true;
            break;

        case 17: // Trimestres Majorés
            if ($data['role'] === 'famille' && in_array($data['gir'], ['GIR 1-2'])) $show = true;
            break;

        case 18: // Aide au Répit (Agirc-Arrco)
            if ($data['statut_pro'] === 'Retraite') $show = true;
            break;

        case 19: // Droit au répit (APA)
            if ($data['aide_apa'] && $data['gir'] === 'GIR 1-2' && $data['objectif'] === 'repos') $show = true;
            break;

        case 20: // PCH (Prestation de Compensation du Handicap)
            if ($data['aide_pch'] || $data['objectif'] === 'PCH') $show = true;
            break;

        case 22: // Aide "Bien Vieillir" (Caisses de retraite)
            if (in_array($data['gir'], ['GIR 5-6']) && $data['aide_aucune']) $show = true;
            break;
    }

    if ($show) {
        $aidesValides[] = $aide;
    }
}

echo json_encode($aidesValides);