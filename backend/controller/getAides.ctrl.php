<?php
// 1. Sécurité et Headers
ini_set('display_errors', 0);
error_reporting(E_ALL);

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");

try {
    // 2. Inclusions
    require_once(__DIR__ . '/../model/aidesDAO.class.php');

    // 3. Récupération des données React
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data) {
        echo json_encode([]);
        exit;
    }

    // 4. Extraction de TOUTES les variables du formulaire
    $statut   = $data['statut_pro'] ?? '';
    $depenses = $data['depenses'] ?? '';
    $fiscal   = $data['fiscalite'] ?? '';
    $role     = $data['role'] ?? '';
    $age      = $data['age_aide'] ?? '';
    $gir      = $data['gir'] ?? '';
    $medical  = $data['situation_medicale'] ?? '';
    $objectif = $data['objectif'] ?? '';
    
    // Checkboxes (booléens)
    $apa    = filter_var($data['aide_apa'] ?? false, FILTER_VALIDATE_BOOLEAN);
    $pch    = filter_var($data['aide_pch'] ?? false, FILTER_VALIDATE_BOOLEAN);
    $aucune = filter_var($data['aide_aucune'] ?? false, FILTER_VALIDATE_BOOLEAN);

    // 5. Récupération des aides en BDD
    $dao = new AidesDAO();
    $allAides = $dao->getAllAides();
    $aidesValides = [];

    // 6. Boucle de filtrage (Les 22 aides)
    foreach ($allAides as $aide) {
        $show = false;
        
        // On part du principe que id_aide_fin contient le NOM de l'aide ou son ID numérique
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
                if ($statut === 'Salarie' && $medical === 'AccidentTravail') $show = true; // Exemple de condition
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
                // Pour les aides sans conditions spécifiques complexes, on peut décider de les afficher ou non
                $show = false;
                break;
        }

        if ($show) {
            $aidesValides[] = $aide;
        }
    }

    // 7. Réponse
    echo json_encode($aidesValides);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erreur serveur"]);
}