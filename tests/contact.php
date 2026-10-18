<?php
declare(strict_types=1);

// Run with: php tests/contact.php. No SMTP connection or real mail is sent.
require dirname(__DIR__) . '/private/contact/app.php';

$checks = 0;
function check(bool $condition, string $message): void {
  global $checks;
  if (!$condition) {
    throw new RuntimeException($message);
  }
  $checks++;
}

$config = require dirname(__DIR__) . '/private/contact/config.example.php';
check(!contact_config_ready($config), 'A fresh upload must remain disabled.');
$config['enabled'] = true;
check(!contact_config_ready($config), 'Missing credentials must keep the form disabled.');
$config['smtp_password'] = 'test-only-not-a-real-password';
$config['recipient_email'] = 'owner@example.com';
check(contact_config_ready($config), 'Complete test settings should be accepted.');

$input = ['name' => 'テスト 太郎', 'email' => 'visitor@example.net', 'subject' => '', 'message' => "共同研究について\nご相談です。", 'website' => ''];
check(contact_validate($input) === null, 'Japanese text and an optional empty subject should be valid.');
foreach ([
  ['email', "visitor@example.net\r\nBcc: other@example.org"],
  ['name', "Name\nInjected"],
  ['subject', "Subject\r\nInjected"],
  ['message', str_repeat('あ', 5001)],
  ['message', '   '],
  ['message', "bad\x00message"],
  ['name', ['not', 'a', 'string']],
  ['website', 'https://spam.example'],
] as [$field, $value]) {
  $invalid = $input;
  $invalid[$field] = $value;
  check(contact_validate($invalid) === $field, 'Must reject invalid ' . $field);
}

$mail = contact_mail($config, $input);
check($mail->preSend(), 'PHPMailer should build the message without sending.');
check($mail->From === 'form@kentashiki.com', 'Visitor input must never replace the sender.');
check($mail->getToAddresses()[0][0] === 'owner@example.com', 'Only the configured owner should receive the email.');
check($mail->getReplyToAddresses()[0][0] === 'visitor@example.net', 'Replies should go to the validated visitor.');
check($mail->ContentType === 'text/plain', 'Messages must remain plain text.');
$mime = $mail->getSentMIMEMessage();
$body = explode("\r\n\r\n", $mime, 2)[1];
check(str_contains((string) base64_decode($body), '共同研究について'), 'Japanese text must survive MIME encoding.');
check(contact_fingerprint($input) === contact_fingerprint($input + ['token' => 'new-challenge']), 'Retry fingerprint must describe the message.');
$edited = $input;
$edited['message'] = 'A different message';
check(contact_fingerprint($input) !== contact_fingerprint($edited), 'Edited messages must not be mistaken for a retry.');

$path = tempnam(sys_get_temp_dir(), 'contact-rate-');
if ($path === false) {
  throw new RuntimeException('Temporary file unavailable.');
}
try {
  $now = 1700000000;
  check(contact_reserve_attempt($path, '192.0.2.1', $now) === 0, 'First attempt should be accepted.');
  check(contact_reserve_attempt($path, '192.0.2.1', $now + 30) === 30, 'Rapid retries should wait a minute.');
  for ($i = 1; $i < 5; $i++) {
    check(contact_reserve_attempt($path, '192.0.2.1', $now + $i * 60) === 0, 'Spaced attempts should fit the hourly limit.');
  }
  check(contact_reserve_attempt($path, '192.0.2.1', $now + 300) === 3300, 'A sixth attempt should hit the hourly limit.');
  check(contact_reserve_attempt($path, '192.0.2.2', $now + 300) === 0, 'Another visitor should not inherit the per-IP limit.');
  for ($i = 0; $i < 44; $i++) {
    check(contact_reserve_attempt($path, '198.51.100.' . $i, $now + 300) === 0, 'Allow attempts up to the global limit.');
  }
  check(contact_reserve_attempt($path, '203.0.113.1', $now + 300) > 0, 'A distributed flood should hit the global hourly limit.');
  check(contact_reserve_attempt($path, '192.0.2.1', $now + 3601) === 0, 'Expired attempts should be purged.');
  $records = file_get_contents($path);
  check(!str_contains($records, '192.0.2.1') && !str_contains($records, 'visitor@example.net'), 'Rate storage must not contain raw IPs or form data.');
} finally {
  unlink($path);
}
echo "Contact checks passed: {$checks}\n";
