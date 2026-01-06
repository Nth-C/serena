<?php
require_once(__DIR__ . '/../model/personneDAO.class.php');
require_once(__DIR__ . '/../app.php');

$app = new App();

$nom = $_POST['nom'] ?? '';
$prenom = $_POST['prenom'] ?? '';
$mail = $_POST['mail'] ?? '';
$username = $_POST['username'] ?? '';
$mdp = $_POST['mdp'] ?? '';
$date_naissance = $_POST['date_naissance'] ?? '';

if ($nom && $prenom && $mail && $username && $mdp && $date_naissance) {
    $hashedPassword = password_hash($mdp, PASSWORD_DEFAULT);
    $personne = new Personne([
        'nom' => $nom,
        'prenom' => $prenom,
        'mail' => $mail,
        'username' => $username,
        'mdp' => $hashedPassword,
        'date_naissance' => new DateTimeImmutable($date_naissance)
    ]);

    $dao = new PersonneDAO();
    if ($dao->insert($personne)) {
        // Registration successful, redirect to login
        header('Location: ?route=login');
        exit();
    } else {
        echo 'Erreur lors de l\'inscription';
    }
} else {
    // Display form or something, but since it's API, perhaps just ok
}