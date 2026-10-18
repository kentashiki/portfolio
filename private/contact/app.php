<?php
declare(strict_types=1);

use PHPMailer\PHPMailer\PHPMailer;

function contact_reply(int $status, array $body): void {
  http_response_code($status);
  echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

function contact_config_ready(array $config): bool {
  if (($config['enabled'] ?? false) !== true) {
    return false;
  }
  foreach (['smtp_host', 'smtp_username', 'smtp_password', 'sender_name'] as $key) {
    if (!is_string($config[$key] ?? null) || trim($config[$key]) === '') {
      return false;
    }
  }
  foreach (['sender_email', 'recipient_email'] as $key) {
    if (!is_string($config[$key] ?? null) || !filter_var($config[$key], FILTER_VALIDATE_EMAIL)) {
      return false;
    }
  }
  return in_array([$config['smtp_port'] ?? null, $config['smtp_encryption'] ?? null], [[465, 'ssl'], [587, 'tls']], true)
    && is_array($config['allowed_origins'] ?? null) && count($config['allowed_origins']) > 0;
}

function contact_validate(array $input): ?string {
  foreach (['name', 'email', 'subject', 'message', 'website'] as $field) {
    if (!is_string($input[$field] ?? null)) {
      return $field;
    }
  }
  if ($input['website'] !== '') {
    return 'website';
  }
  foreach (['name' => 100, 'email' => 254, 'subject' => 150, 'message' => 5000] as $field => $limit) {
    $value = trim($input[$field]);
    $length = preg_match_all('/./us', $value);
    if ($length === false || $length > $limit || ($field !== 'subject' && $value === '')) {
      return $field;
    }
    if ($field !== 'message' && preg_match('/[\x00-\x1f\x7f]/', $value)) {
      return $field;
    }
  }
  if (!filter_var(trim($input['email']), FILTER_VALIDATE_EMAIL)) {
    return 'email';
  }
  if (preg_match('/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/', $input['message'])) {
    return 'message';
  }
  return null;
}

// Reserve an attempt under one lock. Failed SMTP attempts also consume a slot.
// Store timestamps and hashed IPs only; never store the form's contents here.
function contact_reserve_attempt(string $path, string $ip, int $now): int {
  $file = fopen($path, 'c+');
  if ($file === false) {
    throw new RuntimeException('Rate-limit storage is unavailable.');
  }
  chmod($path, 0600);
  try {
    if (!flock($file, LOCK_EX)) {
      throw new RuntimeException('Could not lock rate-limit storage.');
    }
    $raw = stream_get_contents($file);
    $records = $raw === '' ? [] : json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
    if (!is_array($records)) {
      throw new RuntimeException('Invalid rate-limit storage.');
    }
    foreach ($records as $key => $times) {
      $records[$key] = array_values(array_filter($times, static fn ($time) => is_int($time) && $time > $now - 3600));
      if (!$records[$key]) {
        unset($records[$key]);
      }
    }
    $key = hash('sha256', $ip);
    $times = $records[$key] ?? [];
    $global = $records['global'] ?? [];
    if ($times && $now - end($times) < 60) {
      return 60 - ($now - end($times));
    }
    if (count($times) >= 5 || count($global) >= 50) {
      $oldest = count($times) >= 5 ? $times[0] : $global[0];
      return max(1, $oldest + 3600 - $now);
    }
    $records[$key][] = $now;
    $records['global'][] = $now;
    $encoded = json_encode($records, JSON_THROW_ON_ERROR);
    rewind($file);
    if (!ftruncate($file, 0) || fwrite($file, $encoded) !== strlen($encoded) || !fflush($file)) {
      throw new RuntimeException('Could not update rate-limit storage.');
    }
    return 0;
  } finally {
    flock($file, LOCK_UN);
    fclose($file);
  }
}

function contact_mail(array $config, array $input): PHPMailer {
  require_once __DIR__ . '/phpmailer/Exception.php';
  require_once __DIR__ . '/phpmailer/PHPMailer.php';
  require_once __DIR__ . '/phpmailer/SMTP.php';

  $mail = new PHPMailer(true);
  $mail->isSMTP();
  $mail->Host = $config['smtp_host'];
  $mail->Port = $config['smtp_port'];
  $mail->SMTPSecure = $config['smtp_encryption'];
  $mail->SMTPAuth = true;
  $mail->Username = $config['smtp_username'];
  $mail->Password = $config['smtp_password'];
  $mail->Timeout = 15;
  $mail->getSMTPInstance()->Timelimit = 15;
  $mail->CharSet = PHPMailer::CHARSET_UTF8;
  $mail->Encoding = PHPMailer::ENCODING_BASE64;
  $mail->setFrom($config['sender_email'], $config['sender_name']);
  $mail->addAddress($config['recipient_email']);
  $mail->addReplyTo(trim($input['email']), trim($input['name']));
  $subject = trim($input['subject']);
  $mail->Subject = '[kentashiki.com] ' . ($subject !== '' ? $subject : 'お問い合わせ / Contact');
  $mail->isHTML(false);
  $mail->Body = "Name: " . trim($input['name']) . "\n"
    . "Email: " . trim($input['email']) . "\n\n"
    . trim($input['message']);
  return $mail;
}

function contact_fingerprint(array $input): string {
  $values = [];
  foreach (['name', 'email', 'subject', 'message', 'website'] as $field) {
    $values[] = $input[$field] ?? null;
  }
  return hash('sha256', json_encode($values, JSON_THROW_ON_ERROR));
}

function contact_handle(string $directory): void {
  $method = $_SERVER['REQUEST_METHOD'] ?? '';
  if (!in_array($method, ['GET', 'POST'], true)) {
    header('Allow: GET, POST');
    contact_reply(405, ['ok' => false, 'code' => 'method']);
    return;
  }
  $configPath = $directory . '/config.php';
  $config = is_file($configPath) ? require $configPath : [];
  if (!is_array($config) || !contact_config_ready($config)) {
    contact_reply(503, ['ok' => false, 'code' => 'unavailable']);
    return;
  }
  foreach (['Exception.php', 'PHPMailer.php', 'SMTP.php'] as $library) {
    if (!is_file($directory . '/phpmailer/' . $library)) {
      contact_reply(503, ['ok' => false, 'code' => 'unavailable']);
      return;
    }
  }
  if ($method === 'POST' && !in_array($_SERVER['HTTP_ORIGIN'] ?? '', $config['allowed_origins'], true)) {
    contact_reply(403, ['ok' => false, 'code' => 'origin']);
    return;
  }
  $runtime = $directory . '/runtime';
  if (!is_dir($runtime) && !mkdir($runtime, 0700, true) && !is_dir($runtime)) {
    throw new RuntimeException('Contact runtime directory is unavailable.');
  }
  $sessions = $runtime . '/sessions';
  if (!is_dir($sessions) && !mkdir($sessions, 0700) && !is_dir($sessions)) {
    throw new RuntimeException('Session storage is unavailable.');
  }
  session_name('portfolio_contact');
  session_save_path($sessions);
  ini_set('session.use_strict_mode', '1');
  ini_set('session.use_only_cookies', '1');
  ini_set('session.gc_maxlifetime', '3600');
  ini_set('session.gc_probability', '1');
  ini_set('session.gc_divisor', '100');
  session_set_cookie_params([
    'lifetime' => 0, 'path' => '/', 'httponly' => true, 'samesite' => 'Lax',
    'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
  ]);
  if (!session_start()) {
    throw new RuntimeException('Could not start a session.');
  }
  if ($method === 'GET') {
    // Reuse a valid challenge so opening another tab does not invalidate a draft.
    if (!isset($_SESSION['token'], $_SESSION['issued']) || time() - $_SESSION['issued'] > 3600) {
      $_SESSION['token'] = bin2hex(random_bytes(32));
      $_SESSION['issued'] = time();
    }
    $token = $_SESSION['token'];
    session_write_close();
    contact_reply(200, ['ok' => true, 'token' => $token]);
    return;
  }
  $contentType = strtolower(trim(explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0]));
  if ($contentType !== 'application/json') {
    contact_reply(415, ['ok' => false, 'code' => 'format']);
    return;
  }
  if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 32768) {
    contact_reply(413, ['ok' => false, 'code' => 'size']);
    return;
  }
  $raw = file_get_contents('php://input', false, null, 0, 32769);
  if ($raw === false || strlen($raw) > 32768) {
    contact_reply(413, ['ok' => false, 'code' => 'size']);
    return;
  }
  try {
    $input = json_decode($raw, true, 32, JSON_THROW_ON_ERROR);
  } catch (JsonException $error) {
    contact_reply(400, ['ok' => false, 'code' => 'format']);
    return;
  }
  // An interrupted HTTP response must not turn a retry into a second email.
  $sent = $_SESSION['sent'] ?? null;
  if (is_array($input) && is_string($input['token'] ?? null) && is_array($sent)
    && time() - $sent['time'] <= 3600
    && hash_equals($sent['token'], $input['token'])
    && hash_equals($sent['fingerprint'], contact_fingerprint($input))) {
    session_write_close();
    contact_reply(200, ['ok' => true]);
    return;
  }
  if (!is_array($input) || !is_string($input['token'] ?? null)
    || !isset($_SESSION['token'], $_SESSION['issued'])
    || time() - $_SESSION['issued'] > 3600
    || !hash_equals($_SESSION['token'], $input['token'])) {
    contact_reply(403, ['ok' => false, 'code' => 'session']);
    return;
  }
  $invalid = contact_validate($input);
  if ($invalid !== null) {
    contact_reply(422, ['ok' => false, 'code' => 'validation', 'field' => $invalid]);
    return;
  }
  if (time() - $_SESSION['issued'] < 2) {
    contact_reply(429, ['ok' => false, 'code' => 'too_fast']);
    return;
  }
  $retry = contact_reserve_attempt($runtime . '/rate-limits.json', $_SERVER['REMOTE_ADDR'] ?? 'unknown', time());
  if ($retry > 0) {
    header('Retry-After: ' . $retry);
    contact_reply(429, ['ok' => false, 'code' => 'rate']);
    return;
  }
  try {
    contact_mail($config, $input)->send();
  } catch (Throwable $error) {
    // Retain the challenge and entered text so a failed submission can be retried.
    error_log('[portfolio-contact] SMTP delivery failed (' . get_class($error) . ').');
    contact_reply(502, ['ok' => false, 'code' => 'delivery']);
    return;
  }
  $_SESSION['sent'] = ['token' => $input['token'], 'fingerprint' => contact_fingerprint($input), 'time' => time()];
  unset($_SESSION['token'], $_SESSION['issued']);
  session_write_close();
  contact_reply(200, ['ok' => true]);
}
