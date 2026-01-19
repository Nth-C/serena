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
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $submitted_token = $_POST['_csrf_token'] ?? '';
        $stored_token = $_SESSION['csrf_token'] ?? ' ';

        if (!hash_equals($stored_token, $submitted_token)) {
            http_response_code(403);
            die('Erreur de sécurité : Jeton CSRF invalide.');
        }
    }
}

function csrf_input_field() {
    echo '<input type="hidden" name="_csrf_token" value="' . htmlspecialchars(csrf_generate_token()) . '">';
}