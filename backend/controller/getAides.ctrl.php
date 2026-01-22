<?php
require_once(__DIR__ . '/../model/aidesDAO.class.php');
require_once(__DIR__ . '/../app.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

$app = new App();

try {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (!$data) {
        echo json_encode([]);
        exit;
    }

    // Extraction et nettoyage
    $nom      = filter_var($data['nom'] ?? 'Sans nom', FILTER_SANITIZE_SPECIAL_CHARS);
    $desc     = filter_var($data['description'] ?? '', FILTER_SANITIZE_SPECIAL_CHARS);
    $statut   = $data['statut_pro'] ?? '';
    $depenses = $data['depenses'] ?? '';
    $fiscal   = $data['fiscalite'] ?? '';
    $role     = $data['role'] ?? '';
    $age      = $data['age_aide'] ?? '';
    $gir      = $data['gir'] ?? '';
    $medical  = $data['situation_medicale'] ?? '';
    $objectif = $data['objectif'] ?? '';
    
    $apa    = filter_var($data['aide_apa'] ?? false, FILTER_VALIDATE_BOOLEAN);
    $pch    = filter_var($data['aide_pch'] ?? false, FILTER_VALIDATE_BOOLEAN);
    $aucune = filter_var($data['aide_aucune'] ?? false, FILTER_VALIDATE_BOOLEAN);

    $dao = new AidesDAO();
    
    // Sauvegarde du profil d'aide
    $dao->setAide(
        $app->id_famille,
        $nom, 
        $desc,
        $statut, 
        $depenses, 
        $fiscal, 
        $role, 
        $age, 
        $gir, 
        $medical, 
        $apa, 
        $pch, 
        $aucune, 
        $objectif
    );

    $allAides = $dao->getAllAides();
    $aidesValides = [];
    //vérifie les aides disponible
    foreach ($allAides as $aide) {
        $show = false;
        $id = $aide['id_aide_fin']; 

        switch ($id) {
            case "1": case "AJPA":
                if (in_array($statut, ['Salarie', 'Chomeur']) && in_array($gir, ['GIR 1-2', 'GIR 3-4'])) $show = true;
                break;
            case "2": case "AJAP":
                if ($medical === 'FinDeVie') $show = true;
                break;
            case "3": case "Salariat APA":
                if ($role !== 'conjoint' && $apa === true && $objectif === 'remunere') $show = true;
                break;
            case "4": case "MTP":
                if ($age === 'moinsLimiteAge' && $apa === false) $show = true;
                break;
            case "7": case "Crédit d'Impôt Emploi Domicile":
                if ($fiscal === 'imposable' && $depenses === 'PayeFacture') $show = true;
                break;
            case "8": case "Déduction Obligation Alimentaire":
                if ($fiscal === 'imposable' && $depenses === 'DonneArgent') $show = true;
                break;
            case "9": case "Exonération Cotisations Patronales":
                if ($age === 'plusLimiteAge' || in_array($gir, ['GIR 1-2', 'GIR 3-4'])) $show = true;
                break;
            case "12": case "MaPrimeAdapt'":
                if (in_array($gir, ['GIR 1-2', 'GIR 3-4']) || $age === 'plusLimiteAge') $show = true;
                break;
            case "13": case "Aide Action Logement":
                if ($statut === 'Salarie') $show = true;
                break;
            case "15": case "Téléassistance":
                if ($age === 'plusLimiteAge' && $objectif === 'repos') $show = true;
                break;
            case "16": case "AVA":
                if (in_array($gir, ['GIR 1-2', 'GIR 3-4']) && in_array($statut, ['Salarie', 'Chomeur', 'Independant'])) $show = true;
                break;
            case "17": case "Trimestres Majorés":
                if ($role === 'famille' && in_array($gir, ['GIR 1-2'])) $show = true;
                break;
            case "18": case "Aide Agirc-Arrco":
                if ($statut === 'Retraite') $show = true;
                break;
            case "19": case "Droit au répit":
                if ($apa === true && $gir === 'GIR 1-2' && $objectif === 'repos') $show = true;
                break;
            case "20": case "PCH":
                if ($pch === true || $objectif === 'PCH') $show = true;
                break;
            case "22": case "Aide Bien Vieillir":
                if ($gir === 'GIR 5-6' && $aucune === true) $show = true;
                break;
        }

        if ($show) {
            $aidesValides[] = $aide;
        }
    }

    echo json_encode($aidesValides);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => $e->getMessage()
    ]);
}

exit();