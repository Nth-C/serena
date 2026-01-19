<?php
/**
 * Gère la déconnexion de l'utilisateur.
 */

require_once __DIR__ . '/../init.php';

session_destroy();

header('Location: /frontend/login.php');
exit();