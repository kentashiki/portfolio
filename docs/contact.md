# Contact欄の更新

日英トップページのContact欄に、公開用の `contact@kentashiki.com` を表示しています。
アドレスを変更する場合は、`public/index.html` と `public/ja/index.html` の表示テキストと `mailto:` リンクを更新してください。
旧URLの `/contact/` と `/ja/contact/` は、それぞれの言語のトップページの `#contact` に転送します。

## XServerに反映する

トップページへの統合を初めて反映する際は、各ページのナビも更新するため、[公開手順](deployment.md#xserver) にある `--full-site` を使います。
統合後にContact欄を更新する場合は、次のコマンドで一時フォルダ内に `portfolio-deploy/xserver-contact-email.zip` を作成できます。

```sh
python3 scripts/package-xserver.py
```

ZIPを展開し、次のファイルを既存の `kentashiki.com/public_html/` 以下へ上書きします。

| ローカル | XServerの配置先 |
| --- | --- |
| `public/index.html` | `public_html/index.html` |
| `public/ja/index.html` | `public_html/ja/index.html` |
| `public/assets/css/home.css` | `public_html/assets/css/home.css` |
| `public/assets/js/site-shell.js` | `public_html/assets/js/site-shell.js` |
| `public/contact/index.html` | `public_html/contact/index.html` |
| `public/ja/contact/index.html` | `public_html/ja/contact/index.html` |

ZIP内の `SETUP.md` は手順書です。

## 旧Contactページのファイルを整理する

過去に配置した次のファイルが残っている場合は、上書き後にXServerのファイルマネージャーで個別に削除できます。

- `public_html/contact/config.js`
- `public_html/contact/contact.js`
- `public_html/contact/contact.css`
- `public_html/contact/copy-email.js`
- `public_html/assets/js/copy-email.js`
- `public_html/api/contact.php`
- `public_html/php-check.php`
- `private/contact/`

## 公開後に確認する

日英のナビと旧URLからそれぞれのContact欄に移動できることを確認します。表示されたアドレスをクリックして、メールの宛先に入ることを確認します。
