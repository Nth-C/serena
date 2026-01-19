<?php

function csrf_ensure_session_started() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
}

function csrf_generate_token(): string {
    csrf_ensure_session_started();
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function csrf_validate_request() {
    csrf_ensure_session_started();

    $method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
    $state_changing = in_array($method, ['POST','PUT','PATCH','DELETE'], true);

    if ($state_changing) {
        $header_token = $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';
        $form_token = $_POST['_csrf_token'] ?? '';
        $submitted_token = $header_token !== '' ? $header_token : $form_token;

        $stored_token = $_SESSION['csrf_token'] ?? '';

        if ($submitted_token === '' || $stored_token === '' || !hash_equals($stored_token, $submitted_token)) {
            http_response_code(403);
            die('Erreur de sécurité : Jeton CSRF invalide ou manquant.');
        }
    }
}

function csrf_input_field() {
    echo '<input type="hidden" name="_csrf_token" value="' . htmlspecialchars(csrf_generate_token()) . '">';
}