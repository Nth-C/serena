<?php
require_once __DIR__ . '/../init.php';



$user_is_authenticated = true;

if ($user_is_authenticated) {
    session_regenerate_id(true);

    $_SESSION['user_id'] = 'uuid-de-l-utilisateur'; 

    csrf_generate_token();

    header('Location: /frontend/profile.php');
    exit();
} else {
    header('Location: /frontend/login.php?error=1');
    exit();
}