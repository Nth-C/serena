<?php
require_once __DIR__ . '/../backend/init.php';

if (!isset($_SESSION['user_id'])) {
    header('Location: /frontend/login.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Profil - Serena</title>
</head>
<body>
    <h1>Page de profil</h1>
    <p>Bienvenue !</p>

    <form action="/backend/actions/logout.php" method="post">
        <?php csrf_input_field(); ?>
        <button type="submit">Se déconnecter</button>
    </form>
</body>
</html>