<?php

// 1. Sécurité et Headers
ini_set('display_errors', 0);
error_reporting(E_ALL);

header("Content-Type: application/json");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true"); // Important pour les sessions

try {
    // 2. Inclusions
    require_once(__DIR__ . '/../model/aidesDAO.class.php');
    require_once(__DIR__ . '/../app.php');

    $app = new App();
    $dao = new AidesDAO();

    // 3. Vérification de l'ID famille pour éviter l'erreur UUID "0"
    if (empty($app->id_famille) || $app->id_famille === "0") {
        echo json_encode(["isFilled" => false]);
        exit;
    }

    // 4. On vérifie si la famille a déjà rempli le formulaire
    $existingData = $dao->getAideByFamille($app->id_famille);

    if (!$existingData) {
        // Rien en base de données
        echo json_encode(["isFilled" => false]);
        exit;
    }

    // 5. Si déjà rempli, on extrait les variables de la base de données
    $statut   = $existingData['statuspro'] ?? '';
    $depenses = $existingData['depense'] ?? '';
    $fiscal   = $existingData['fiscalite'] ?? '';
    $role     = $existingData['role'] ?? '';
    $age      = $existingData['age_aide'] ?? '';
    $gir      = $existingData['gir'] ?? '';
    $medical  = $existingData['situation_medicale'] ?? '';
    $objectif = $existingData['objectif'] ?? '';
    
    // Checkboxes (booléens de la BDD)
    $apa    = filter_var($existingData['aide_apa'] ?? false, FILTER_VALIDATE_BOOLEAN);
    $pch    = filter_var($existingData['aide_pch'] ?? false, FILTER_VALIDATE_BOOLEAN);
    $aucune = filter_var($existingData['aide_aucune'] ?? false, FILTER_VALIDATE_BOOLEAN);

    // 6. On lance le filtrage (Exactement ton code précédent)
    $allAides = $dao->getAllAides();
    $aidesValides = [];

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
            case "5": case "PCRH":
                if ($statut === 'Salarie' && $medical === 'AccidentTravail') $show = true;
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
            default:
                $show = false;
                break;
        }

        if ($show) {
            $aidesValides[] = $aide;
        }
    }

    // 7. Réponse finale (on renvoie isFilled: true et les résultats)
    echo json_encode([
        "isFilled" => true,
        "aides" => $aidesValides
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "error" => "Erreur : " . $e->getMessage()
    ]);
}