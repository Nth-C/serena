<?php
require_once('model/personneDAO.class.php');
require_once(__DIR__ . '/../app.php');


$app = new App();
$model = new PersonneDAO();

if(!$app->connected){
    echo json_encode(["error" => "Non connecté"]);
    exit;
}

$user = $model->findPersonneById($app->id_personne);
echo json_encode($user);
?>