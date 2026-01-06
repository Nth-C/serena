<?php
require_once(__DIR__ . '/../model/personneDAO.class.php');
require_once(__DIR__ . '/../app.php');

$app = new App();

if ($app->connected) {
    header('Location: ?route=main');
    exit();
}

$username = $_POST['username'] ?? '';
$mdp = $_POST['mdp'] ?? '';

if ($username && $mdp) {
    $dao = new PersonneDAO();
    $personne = $dao->findByUsername($username);
if ($personne && password_verify($mdp, $personne->mdp)) {
        $app->login($personne);
        echo 'success';
    } else {
        echo 'Login ou mot de passe incorrect';
    }
}
$view->display();