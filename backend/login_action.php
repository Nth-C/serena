<?php
require_once __DIR__ . '/../init.php';

// Baseline validation of inputs (à migrer vers un module central de validation)
$username = isset($_POST['username']) ? trim((string)$_POST['username']) : '';
$password = isset($_POST['password']) ? (string)$_POST['password'] : '';

if ($username === '' || $password === '') {
    // Entrées invalides
    header('Location: /frontend/login.php?error=1');
    exit();
}

/ TODO: Implémenter l'authentification réelle (BDD) + password_verify()
// Exemple (à adapter):
// $user = find_user_by_username($username);
// if ($user && password_verify($password . get_app_pepper(), $user['password_hash'])) { ... }

// Par défaut, refuser tant que l'authentification réelle n'est pas branchée
header('Location: /frontend/login.php?error=1');
exit();