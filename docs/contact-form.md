# XServerでお問い合わせフォームを有効にする

実装済みのフォームは、XServer側の設定が整うと自動的に送信可能になります。
パスワードと受信先はサーバー上で入力します。GitHubに登録する必要はありません。

## 1. アップロード

アップロード用ZIPは、リポジトリの外にある `../portfolio-deploy/xserver-contact.zip` です。
作り直す場合は、リポジトリ直下で実行します。

```sh
python3 scripts/package-xserver.py
```

ZIPを手元で展開し、次の配置になるように、XServerのファイルマネージャ等でアップロードします。
ZIPにある `SETUP.md` はこの手順のコピーです。サーバーへのアップロードは不要です。

```text
kentashiki.com/
├── private/                       ← public_htmlと同じ階層へ新規追加
│   └── contact/
│       ├── app.php
│       ├── config.example.php
│       └── phpmailer/             ← フォルダごと追加
└── public_html/
    ├── api/contact.php            ← 新規追加
    ├── contact/                   ← フォルダの中身を上書き
    ├── ja/contact/index.html      ← 上書き
    └── …                         ← その他の既存ファイルはそのまま
```

**`private/` は `public_html/` の中には置きません。**
ZIPの `public_html/` は既存フォルダに中身を追加・上書きします。
ZIPにはフォーム関連の更新だけをまとめており、サイト全体をアップロードし直す必要はありません。
サーバー側の `.htaccess` や既存のSSL設定は残します。
アップロードするZIPには、個人メモ、デザイン案、実際の認証情報は含めていません。

XServerの「PHPバージョン切替」で、対象ドメインにサポート中のPHP 8.3以降を選んでください。
[公式: PHPバージョン切替](https://www.xserver.ne.jp/manual/man_program_php_ver.php)

## 2. サーバー上で設定ファイルを作る

`kentashiki.com/private/contact/config.example.php` をコピーし、同じ場所に `config.php` を作ります。
ファイルマネージャの編集機能などで、次の3項目を変更します。

| 項目 | 入力内容 |
| --- | --- |
| `smtp_password` | `form@kentashiki.com` 作成時に設定したメールアカウントのパスワード |
| `recipient_email` | お問い合わせを受け取るメールアドレス（普段のGmail等） |
| `enabled` | `false` を `true` に変更 |

設定例の該当箇所は次の形です。既存の配列の該当行を編集し、引用符・カンマは残してください。

```php
'enabled' => true,
'smtp_password' => 'ここにメールアカウントのパスワードを入力',
'recipient_email' => 'ここに受信先メールアドレスを入力',
```

PHPの単一引用符で囲んだ値では、パスワード中の `\` は `\\`、`'` は `\'` と記述します。
実際のパスワードをチャットやGitHubへ貼り付けないでください。

以下は設定済みなので、変更不要です。

| 項目 | 設定 |
| --- | --- |
| SMTPサーバー | `sv17275.xserver.jp` |
| SMTP認証ユーザー | `form@kentashiki.com` |
| 送信元 | `form@kentashiki.com` |
| ポート・暗号化 | `465`・`ssl` |
| 利用するサイト | `https://kentashiki.com`、`https://www.kentashiki.com` |

パスワードにはXServerアカウント全体のパスワードではなく、メールアカウントのものを使います。
`config.php` のパーミッションは、XServer上でPHPから読める `600` を推奨します。
`private/contact/` はPHPが書き込める状態にします。実行時に `runtime/` が自動作成されます。
`runtime/` はセッションと連投制限用です。お問い合わせ本文は保存しません。

## 3. 設定確認と送信テスト

1. <https://kentashiki.com/api/contact.php> を開きます。
   正常に準備できていれば `"ok":true` とランダムなトークンが表示されます。
   `"code":"unavailable"` の場合は、配置と `config.php` の3項目を確認します。
   一緒に表示される `setup` は下表の原因を示します。`fields` があれば該当する項目名だけが表示されます。
   この確認ではSMTPへ接続しないため、パスワードの正しさは次の送信テストで確認します。
2. <https://kentashiki.com/ja/contact/> を再読み込みします。
   準備中の案内が通常の案内に変わり、送信ボタンが使えることを確認します。
3. 名前・返信先メール・テスト本文を入力して、1通送信します。
4. 指定した受信先の受信トレイと迷惑メールフォルダを確認します。
5. 届いたメールの返信操作で、フォームに入力したメールアドレスが返信先になることを確認します。
6. 英語版 <https://kentashiki.com/contact/> も、1分以上あけて確認します。

フォームは、PHP側でSMTPへの送信が完了したときだけ成功表示に変わります。
受信トレイへの到着は、受信側の処理もあるため、必ず実際のメールで確認します。
送信中は二重操作を防ぎ、失敗時は入力内容を残します。

## 送信できないとき

確認用APIは、準備不足の場合もHTTP 200で `"ok":false` と原因コードを返します。
XServerの汎用503ページに応答を置き換えられずに状況を確認するための仕様です。
実際の設定値・パスワード・サーバー内の絶対パスは返しません。

| `setup` | 確認すること |
| --- | --- |
| `application_missing` | `private/contact/app.php` が `public_html` と同じ階層にあるか・PHPから読み取れるか |
| `config_missing` | 同じ場所に `config.php` があるか・読み取れるか（`config.example.php` のままでは不可） |
| `config_fields` | `fields` に表示された項目。`enabled` は引用符なしの `true`、ポートは引用符なしの `465` |
| `config_format` | `config.php` の先頭の `<?php` と `return [ … ];` を残しているか |
| `php_syntax` | 編集したPHPの引用符・カンマ・パスワード中の記号のエスケープ |
| `mailer_missing` | `private/contact/phpmailer/` の3つのPHPファイルが揃っていて読めるか |
| `storage` | `private/contact/` へのPHPの書き込み権限と `runtime/` の作成可否 |
| `php_version` | 実際に動いている対象ドメインのPHPが8.3以上か |

APIがJSONではなく汎用エラーページを返す場合は、サーバーパネルのエラーログも確認します。

| 状況 | 確認すること |
| --- | --- |
| 準備中のまま | `config.php` の配置、`enabled`、空のパスワード・受信先、PHPバージョン、ファイルの権限 |
| APIにPHPコードがそのまま表示される | PHPが実行されていません。フォームを有効にせず、XServerのPHP設定を確認 |
| 送信時に失敗する | メールアカウントのパスワード、SMTPホスト名・ポート、`phpmailer/` のアップロード漏れ |
| 送信回数の制限 | 同じIPからは1分間隔・1時間に5回まで。サイト全体では1時間に50回まで。時間をあけて再試行 |
| 内容の確認を求められる | 名前100文字、件名150文字、本文5000文字以内。メールアドレスの形式を確認 |
| 送信成功だが届かない | 受信先の誤記、迷惑メール、XServerのSPF・DKIM設定を確認 |

最初にフォームを開いてから2秒未満の機械的な送信も拒否します。
ブラウザーのCookieが無効だと送信できません。
長時間開いたフォームは、送信操作時にセッションを更新し、再度送信するよう案内します。
サーバーのエラーログには、処理失敗を示す `[portfolio-contact]` の記録だけを残します。
SMTPの応答詳細やパスワードは画面へ出しません。

## GitHub Pagesと以後の更新

GitHub Pages用ワークフローでは `.php` ファイルを除外し、`private/` も公開しません。
GitHub Pagesのフォームは無効のままで、XServerへの送信リクエストも行いません。
`kentashiki.com` と `www.kentashiki.com` のHTTPSページのみ、本番の送信処理へ接続します。

更新時は `public/` の変更を `public_html/` へ、必要な `private/contact/` のコードだけを同じ場所へ反映します。
パッケージ作成処理は `config.php` と `runtime/` を読み込まず、ZIPにも含めません。
**サーバー上の `config.php` と `runtime/` は上書き・削除しないでください。**
停止したい場合は、サーバーの `config.php` で `enabled` を `false` に戻します。

## 実装の確認（開発用）

PHP CLIがある環境では、リポジトリ直下で実行できます。実際のメールは送信しません。

```sh
php tests/contact.php
php -l private/contact/app.php
php -l public/api/contact.php
```

ライブラリはPHPMailer 7.1.1を同梱しています。ComposerをXServerへインストールする必要はありません。

公式資料:
[メールアカウント設定](https://www.xserver.ne.jp/manual/man_mail_setting.php)、
[SPF設定](https://www.xserver.ne.jp/manual/man_mail_spf.php)、
[DKIM設定](https://www.xserver.ne.jp/manual/man_mail_dkim.php)、
[PHPMailer](https://github.com/PHPMailer/PHPMailer)
