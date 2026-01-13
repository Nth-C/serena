<?php
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (!empty($origin)) {
    header("Access-Control-Allow-Origin: $origin");
    header("Access-Control-Allow-Credentials: true");
} else {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Credentials: false");
}
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=utf-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

ini_set('display_errors', '0');

require_once(__DIR__ . '/../model/dal.class.php');
$dal = DAL::get();

$subject = '';
$message = '';

$log = [
    'time' => date('c'),
    'method' => $_SERVER['REQUEST_METHOD'] ?? '',
    'uri' => $_SERVER['REQUEST_URI'] ?? '',
    'origin' => $_SERVER['HTTP_ORIGIN'] ?? '',
    'content_type' => $_SERVER['CONTENT_TYPE'] ?? ''
];
if (function_exists('getallheaders')) {
    $log['headers'] = getallheaders();
}
$rawBody = file_get_contents('php://input');
if (!empty($rawBody)) {
    $log['raw'] = $rawBody;
}
error_log('envoieSignalement debug: ' . json_encode($log));

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
    if (stripos($contentType, 'application/json') !== false) {
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true);
        if (is_array($data)) {
            $subject = $data['subject'] ?? '';
            $message = $data['message'] ?? '';
        }
    } else {
        $subject = $_POST['subject'] ?? '';
        $message = $_POST['message'] ?? '';
    }
} else {
    $subject = $_GET['subject'] ?? '';
    $message = $_GET['message'] ?? '';
}

if (empty(trim($subject)) || empty(trim($message))) {
    http_response_code(400);
    echo json_encode(['error' => 'Sujet ou message manquant']);
    exit;
}

$to = "admin@sere-na.alwaysdata.net";

$headers = "From: no-reply@sere-na.alwaysdata.net\r\n";
$headers .= "Reply-To: no-reply@sere-na.alwaysdata.net\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Ensure mail() exists and suppress warnings from it; log failures for diagnosis.
if (!function_exists('mail')) {
    error_log('envoieSignalement: mail() is not available on this host');
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Fonction mail() non disponible sur le serveur']);
    exit;
}

$success = @mail($to, $subject, $message, $headers);
if ($success) {
    echo json_encode(['success' => true]);
} else {
    $err = error_get_last();
    error_log('envoieSignalement: mail() failed: ' . json_encode($err));
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Echec de l\'envoi du mail']);
}