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
  'medicament/list' => 'viewMedicament',
  'medicament/add' => 'addMedicament',
  'medicament/delete' => 'deleteMedicament',
  'medicament/update' => 'updateMedicament',
  'nommedicament/search' => 'searchNomMedicament',
  'login' => 'login',
  'register' => 'register',
  'logout' => 'logout',
  'audit/list' => 'viewAudit',
  'famille/add' => 'addFamille',
  'famille/all' => 'getFamille',
  'famille/update' => 'updateFamille',
  'famille/select' => 'selectFamille',
  'famille/quitter' => 'quitterFamille',  
  'deletefamillepersonne' => 'deleteFamillePersonne',
  'invitepersonnefamille/add' => 'addInviteFamille',
  'invitefamille/view' => 'viewInviteFamille',
  'invitation/view' => 'viewInvitation',
  'invitation/accepter' => 'accepterInvitation',
  'invitation/refuser' => 'refuserInvitation',
  'allpersonne/view' => 'viewAllPersonne',
  'rapport/list' => 'getRapport',
  'rapport/add' => 'addRapport',
  'rapport/delete' => 'deleteRapport',
  'rapport/update' => 'updateRapport',
  'document/list' => 'viewDocument',
  'document/add' => 'addDocument',
  'document/delete' => 'deleteDocument',
  'categorie/add' => 'addCategorie',
  'getfamillepersonne' => 'getfamillepersonne',
  'rolepersonne/update' => 'updateRolePersonne',
  'getevents' => 'getevents',
  'forgot_password' => 'forgotPassword',
  'reset_password' => 'resetPassword',
  'liste_membre' => 'liste_membre'
);

if (!array_key_exists($route, _ROUTES)) {
  throw new Exception("Bad route : '" . $route . "'");
  exit(-1);
}

$_controllerName = _ROUTES[$route];

require_once('controller/' . $_controllerName . '.ctrl.php');
exit(0); 