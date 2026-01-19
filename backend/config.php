<?php
// config.php
// Read sensitive configuration strictly from environment variables.
// Ensure these are provided via runtime env or a secrets manager.
// Never commit secrets to VCS.
return [
    'SMTP_HOST' => getenv('SMTP_HOST') ?: ($_ENV['SMTP_HOST'] ?? ''),
    'SMTP_PORT' => (int)(getenv('SMTP_PORT') ?: ($_ENV['SMTP_PORT'] ?? 0)),
    'SMTP_USER' => getenv('SMTP_USER') ?: ($_ENV['SMTP_USER'] ?? ''),
    'SMTP_PASS' => getenv('SMTP_PASS') ?: ($_ENV['SMTP_PASS'] ?? ''),
    'APP_PEPPER' => getenv('APP_PEPPER') ?: ($_ENV['APP_PEPPER'] ?? ''),
];