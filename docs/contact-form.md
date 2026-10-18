# お問い合わせフォームの設定（Formspree）

ContactフォームはFormspreeへ通常のHTMLフォームとしてPOSTします。
入力項目は名前・返信用メールアドレス・件名（任意）・本文です。
受信先のメールアドレスやSMTPパスワードはサイト内に置きません。
送信後の認証や完了表示はFormspreeの画面で行います。
サイト側では送信成功を先に表示しません。

## 1. Formspreeでフォームを作る

1. [Formspree](https://formspree.io/) でアカウントを作成し、確認メールでメールアドレスを認証します。
2. ダッシュボードの **New Form** でフォームを作成します。
3. お問い合わせを受け取る **Target Email** を確認・認証します。
   `form@kentashiki.com` を使っても、普段確認している別のメールアドレスを使っても構いません。
4. **Integration** にある `https://formspree.io/f/…` 形式の送信先URLをコピーします。
   必要なのは公開用の送信先URLです。APIキーやパスワードは使用しません。
5. Formspree側の迷惑送信対策を有効にします。通常のHTML送信なので、必要な認証はFormspreeの画面で行われます。
   公開元ドメインを制限する場合は、利用する `kentashiki.com`、`www.kentashiki.com`、
   `kentashiki.github.io` を許可してください。ローカルの動作確認時には制限の影響にも注意します。

受信先はFormspreeの管理画面で変更できます。XServerのSMTP設定とは独立しています。
料金・送信上限・利用できる機能は [公式プラン](https://formspree.io/plans) を確認してください。

## 2. サイトに送信先URLを設定する

`public/contact/config.js` の1か所を変更します。

```js
window.portfolioContactEndpoint = 'https://formspree.io/f/取得したフォームID';
```

日英でこの設定を共有します。空欄または不正なURLの場合、入力欄を非表示にしてSNSをご案内します。
JavaScriptを無効にした場合も同様です。未設定のまま同じページや旧PHPへ送信することはありません。
公開用の送信先URLはHTMLの送信先と同じく公開されます。ここには秘密のキーを記載しません。

## 3. XServerのファイルを更新する

リポジトリのルートで実行すると、`../portfolio-deploy/xserver-formspree-contact.zip` を作成します。

```sh
python3 scripts/package-xserver.py
```

ZIPを手元で展開し、次の5ファイルをサーバーへ上書きしてください。
`public_html` を二重に作らず、既存の同名フォルダへ中身を置きます。

| ローカル | XServerの配置先（`kentashiki.com/` 以下） |
| --- | --- |
| `public/contact/index.html` | `public_html/contact/index.html` |
| `public/contact/contact.css` | `public_html/contact/contact.css` |
| `public/contact/contact.js` | `public_html/contact/contact.js` |
| `public/contact/config.js` | `public_html/contact/config.js` |
| `public/ja/contact/index.html` | `public_html/ja/contact/index.html` |

ZIPの `SETUP.md` は手順書なので、サーバーにはアップロードしません。
旧 `xserver-contact.zip`、`contact-diagnostics.zip` はPHP版です。以後は使用しません。

GitHub Pagesにも反映する場合は、変更を `main` にpushします。
XServerへのアップロードとは別の操作です。

## 4. 旧PHPファイルをサーバーから削除する

このサイトのお問い合わせフォーム用に配置した次のファイルは不要です。
上書きアップロードだけでは削除されないので、ファイルマネージャーで個別に削除します。

| 削除対象（`kentashiki.com/` 以下） | 内容 |
| --- | --- |
| `public_html/api/contact.php` | 旧PHPの送信窓口 |
| `private/contact/` フォルダ全体 | 旧処理、`config.php` 内のSMTP設定、PHPMailer、`runtime/` |
| `public_html/php-check.php` | PHP動作確認用の一時ファイル（配置した場合） |

`public_html/api/` は空になった場合だけ削除できます。
アップロードしていた場合は、このフォーム用のZIPや `SETUP.md` などの作業用ファイルも公開フォルダから削除できます。

**残すもの:** `public_html/contact/`、`public_html/ja/contact/`、`.htaccess`、他ページのファイル。
`notes/` などのメモも削除しません。メールアカウント `form@kentashiki.com` はそのまま利用できます。

## 5. 公開後の確認

1. `https://kentashiki.com/contact/` と `https://kentashiki.com/ja/contact/` を再読み込みします。
2. 入力欄と送信ボタンが表示されることを確認します。
3. 必須項目の未入力やメールアドレスの形式誤りがある場合、送信が止まり、該当欄の下に短い説明が表示されることを確認します。修正すると説明が消えます。
4. ご自身でテストメッセージを1通送信し、必要な認証と完了画面を確認します。
5. Formspree管理画面の送信記録と受信メールを確認します。迷惑メールフォルダも確認してください。
6. 名前・件名・本文が届き、返信先がフォームに入力したメールアドレスになることを確認します。
7. GitHub Pagesにも公開した場合は、そちらでも同じ設定が反映されていることを確認します。

Formspreeの送信先URLをまだ設定していない間は、送信を有効化しません。
サイト側の模擬送信テストだけでは、実際のメール到達やFormspree側の認証・ドメイン制限までは確認できません。

## 公式資料

- [HTMLフォームの作成と送信先URLの取得](https://help.formspree.io/articles/building-your-form/building-an-html-form)
- [件名フィールド](https://help.formspree.io/articles/building-your-form/email-subject-line)
- [reCAPTCHA設定](https://help.formspree.io/articles/form-and-project-settings/recaptcha-settings)
