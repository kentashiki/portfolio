<?php
declare(strict_types=1);

// Copy to config.php on XServer, outside public_html. Never commit config.php.
return [
  'enabled' => false,
  'smtp_host' => 'sv17275.xserver.jp',
  'smtp_port' => 465,
  'smtp_encryption' => 'ssl',
  'smtp_username' => 'form@kentashiki.com',
  'smtp_password' => '',
  'sender_email' => 'form@kentashiki.com',
  'sender_name' => 'Kenta Shiki Website',
  'recipient_email' => '',
  'allowed_origins' => ['https://kentashiki.com', 'https://www.kentashiki.com'],
];
