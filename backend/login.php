<?php
require_once __DIR__ . '/../backend/init.php';
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Connexion - Serena</title>
</head>
<body>
    <h1>Connexion</h1>

    <?php if (isset($_GET['error'])): ?>
        <p style="color: red;">Identifiants incorrects.</p>
    <?php endif; ?>

    <form action="/backend/actions/login_action.php" method="post">
        <?php csrf_input_field(); ?>
        <p><label>Utilisateur: <input type="text" name="username"></label></p>
        <p><label>Mot de passe: <input type="password" name="password"></label></p>
        <p><button type="submit">Se connecter</button></p>
    </form>
</body>
</html>