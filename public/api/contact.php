<?php
declare(strict_types=1);

// The application, SMTP credentials, and runtime data live outside public_html.
ini_set('display_errors', '0');
header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

try {
  if (PHP_VERSION_ID < 80300) {
    throw new RuntimeException('PHP 8.3 or later is required.');
  }
  $application = dirname(__DIR__, 2) . '/private/contact/app.php';
  if (!is_file($application)) {
    throw new RuntimeException('Contact application is not installed.');
  }
  require $application;
  contact_handle(__DIR__ . '/../../private/contact');
} catch (Throwable $error) {
  // Never include credentials, visitor input, or SMTP diagnostics in responses.
  error_log('[portfolio-contact] Request failed (' . get_class($error) . ').');
  http_response_code(503);
  echo json_encode(['ok' => false, 'code' => 'unavailable']);
}
