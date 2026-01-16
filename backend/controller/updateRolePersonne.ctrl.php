<?php
require_once(__DIR__ . '/../app.php');
require_once(__DIR__ . '/../model/familleDAO.class.php');

header("Content-Type: application/json");

$app = new App();

// 1. Sécurité : l'utilisateur doit être connecté
if (!$app->connected || !$app->personne) {
    echo json_encode(['success' => false, 'error' => 'Non connecté']);
    exit;
}

if (!$app->checkRole('Famille')) {
    header('HTTP/1.1 403 Forbidden');
    echo json_encode([
        'success' => false, 
        'message' => 'Erreur : Vous devez être un proche de la famille pour faire ça.'
    ]);
    exit; 
}

// 2. Récupération des données JSON
$json = file_get_contents('php://input');
$data = json_decode($json, true);

$id_personne_a_modifier = $data['idPersonne'] ?? null;
$nouveau_role = $data['nouveauRole'] ?? null;

if ($nouveau_role == Famille && !$app->checkRole('Createur')) {
    header('HTTP/1.1 403 Forbidden');
    echo json_encode([
        'success' => false, 
        'message' => 'Erreur : Vous devez être chef de famille pour mettre un role proche de la famille'
    ]);
    exit; 
}

$id_famille_actuelle = $app->id_famille; // Récupéré depuis la session via App

if($id_personne_a_modifier == $app->personne->id){
    echo json_encode(['success' => false, 'error' => 'Vous ne pouvez pas modifier votre rôle']);
    exit();
}

// 3. Vérification des données obligatoires
if ($id_personne_a_modifier && $nouveau_role && $id_famille_actuelle) {
    $dao = new FamilleDAO();

    // Optionnel : Vérifier ici si l'utilisateur connecté a le droit (ex: est-il Admin ?)
    // if ($app->role_dans_famille !== 'Admin') { ... }

    try {
        $success = $dao->UpdateRolePersFam($id_famille_actuelle, $id_personne_a_modifier, $nouveau_role);

        if ($success) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Erreur lors de la mise à jour en base']);
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Données incomplètes (ID ou Rôle manquant)']);
}
exit();