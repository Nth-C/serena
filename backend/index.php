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
  'login' => 'login',
  'register' => 'register',
  'logout' => 'logout',
  'famille/add' => 'addFamille',
  'famille/all' => 'getFamille',
  'famille/update' => 'updateFamille',
  'famille/select' => 'selectFamille', 
  'rapport/list' => 'getRapport',
  'rapport/add' => 'addRapport',
  'document/list' => 'viewDocument',
  'document/add' => 'addDocument',
  'categorie/add' => 'addCategorie',
  'getfamillepersonne' => 'getfamillepersonne'
);

if (!array_key_exists($route, _ROUTES)) {
  throw new Exception("Bad route : '" . $route . "'");
  exit(-1);
}

$_controllerName = _ROUTES[$route];

require_once('controller/' . $_controllerName . '.ctrl.php');
exit(0); 