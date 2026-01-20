<?php
require_once(__DIR__ . '/../app.php');

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}
$app = new App();


