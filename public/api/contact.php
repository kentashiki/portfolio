<?php
declare(strict_types=1);

// The application, SMTP credentials, and runtime data live outside public_html.
ini_set('display_errors', '0');
header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

$setupProblem = 'application';
try {
  if (PHP_VERSION_ID < 80300) {
    $setupProblem = 'php_version';
    throw new RuntimeException('PHP 8.3 or later is required.');
  }
  $application = dirname(__DIR__, 2) . '/private/contact/app.php';
  if (!is_readable($application)) {
    $setupProblem = 'application_missing';
    throw new RuntimeException('Contact application is not installed.');
  }
  require $application;
  $setupProblem = 'storage';
  contact_handle(__DIR__ . '/../../private/contact');
} catch (Throwable $error) {
  // Never include credentials, visitor input, or SMTP diagnostics in responses.
  error_log('[portfolio-contact] Request failed (' . get_class($error) . ').');
  // Some hosts replace 503 JSON with their own HTML error page. Readiness
  // reports use HTTP 200 with ok:false; a submission still fails with 503.
  http_response_code(($_SERVER['REQUEST_METHOD'] ?? '') === 'GET' ? 200 : 503);
  echo json_encode([
    'ok' => false,
    'code' => 'unavailable',
    'setup' => $error instanceof ParseError ? 'php_syntax' : $setupProblem,
  ]);
}
