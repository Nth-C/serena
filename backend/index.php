<?php
$origin = $_SERVER['HTTP_ORIGIN'] ?? 'http://localhost:5173'; 

header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Credentials: true"); 
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once('model/dal.class.php');

$route = $_GET['route'] ?? '';

const _ROUTES = array(
  'evenement/add' => 'addEvenement',
  'evenement/delete' => 'deleteEvenement',
  'evenementrecurrence/delete' => 'deleteEvenementRecurrence',
  'evenement/update' => 'updateEvenement',
  'trajet/accepter' => 'accepterDemandeTrajet',
  'trajet/update' => 'updateTrajet',
  'medicament/list' => 'viewMedicament',
  'medicament/add' => 'addMedicament',
  'medicament/delete' => 'deleteMedicament',
  'medicament/update' => 'updateMedicament',
  'nommedicament/search' => 'searchNomMedicament',
  'login' => 'login',
  'register' => 'register',
  'verify_account' => 'verifyAccount',
  'logout' => 'logout',
  'audit/list' => 'viewAudit',
  'famille/add' => 'addFamille',
  'famille/all' => 'getFamille',
  'famille/update' => 'updateFamille',
  'famille/select' => 'selectFamille',
  'famille/quitter' => 'quitterFamille',  
  'deletefamillepersonne' => 'deleteFamillePersonne',
  'invitepersonnefamille/add' => 'addInviteFamille',
  'invitepersonnefamille/delete' => 'removeInviteFamille',
  'invitation/view' => 'viewInvitation',
  'invitation/accepter' => 'accepterInvitation',
  'invitation/refuser' => 'refuserInvitation',
  'allpersonne/view' => 'viewAllPersonne',
  'rapport/list' => 'viewRapport',
  'rapport/add' => 'addRapport',
  'rapport/delete' => 'deleteRapport',
  'rapport/update' => 'updateRapport',
  'rapport/last' => 'viewLastReport',
  'document/list' => 'viewDocument',
  'document/add' => 'addDocument',
  'document/delete' => 'deleteDocument',
  'categorie/add' => 'addCategorie',
  'categorie/update' => 'updateCategorie',
  'categorie/delete' => 'deleteCategorie',
  'getfamillepersonne' => 'getfamillepersonne',
  'rolepersonne/update' => 'updateRolePersonne',
  'getevents' => 'getEvents',
  'forgot_password' => 'forgotPassword',
  'reset_password' => 'resetPassword',
  'liste_membre' => 'liste_membre',
  'trajet/add' => 'addTrajet',
  'signalement/list' => 'getSignalement',
  'signalement/add' => 'addSignalement',
  'signalement/delete' => 'deleteSignalement',
  'signalement/update' => 'updateSignalement',
  'dashboard/view' => 'viewDashboard',
  'user/profile' => 'getUserInfo',
  'user/update' => 'updateUser',
  'user/delete' => 'deleteCompte',
  'aides/calculer' => 'getAides',
  'aides/get' => 'viewAides',
  'ocr' => 'ocr',
  'ocr/extract' => 'analyseOCR'
  
);

if (!array_key_exists($route, _ROUTES)) {
  throw new Exception("Bad route : '" . $route . "'");
  exit(-1);
}
$_controllerName = _ROUTES[$route];

require_once('controller/' . $_controllerName . '.ctrl.php');
exit(0); 