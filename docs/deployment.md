# 公開手順

## 公開対象

GitHub PagesでもXServerでも、**`public/` の中身だけ**を公開します。
HTML・CSS・JavaScriptをそのまま使用するため、ビルドは不要です。
日本語は `/ja/`、英語は `/` です。

## GitHub Pages

### 初回の設定

1. [リポジトリのPages設定](https://github.com/kentashiki/portfolio/settings/pages) を開きます。
2. **Build and deployment → Source → GitHub Actions** を選びます。
3. テンプレートは追加しません。`.github/workflows/pages.yml` が公開を担当します。
4. その設定を済ませてから、構成変更を含むコミットを `main` にpushします。
5. [Actions](https://github.com/kentashiki/portfolio/actions/workflows/pages.yml) で
   **Deploy portfolio to GitHub Pages** の実行結果を確認します。
6. 成功後、<https://kentashiki.github.io/portfolio/> と
   <https://kentashiki.github.io/portfolio/ja/> を確認します。

`public/` への移動と公開元の切り替えはセットで行います。
以前の `Deploy from a branch / main / (root)` のままでは、新しい構成を正しく公開できません。

### 以後の更新

`main` に `public/` または公開ワークフローの変更をpushすると、自動で公開します。
資料だけを更新した場合は公開し直しません。
手動で公開する場合は、Actionsでこのワークフローを開き、
**Run workflow → Branch: main → Run workflow** を選びます。
設定変更前の実行が失敗している場合も、設定変更後にこの方法で実行できます。

ワークフローは `public/` だけを公開用データとしてアップロードするため、
`docs/`、個人メモ、アーカイブ、デザイン案はPagesには含まれません。
ただし、公開リポジトリにコミットしたファイルはGitHub上では閲覧できます。

公式案内:
[公開元の設定](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)、
[カスタムワークフロー](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

## XServer

1. ドメインの取得・サーバーへのドメイン追加・DNS設定・無料独自SSL設定を済ませます。
2. ファイルマネージャやファイル転送ソフトで、対象ドメインの `public_html/` を開きます。
3. **`public/` フォルダ自体ではなく、その中身**を配置します。

```text
対象ドメイン/public_html/
├── index.html
├── about/
├── assets/
├── awards/
├── contact/
├── data/
├── ja/
├── news/
├── outputs/
├── projects/
└── work/
```

GitHub Pages用の `/portfolio/` フォルダを作る必要はありません。
独自ドメイン直下で英語、日本語は `/ja/` で表示されます。
`docs/`、`notes/`、`archive/`、`design-proposals/`、`.git/`、`.github/`、
`.codex/`、`.DS_Store`、認証情報はアップロードしません。

初回アップロード後は、日英ページ、画像、PDF、3Dモデル、言語切り替え、
スマートフォンのメニュー、HTTPSの表示と転送を確認します。
ドメインが決まったら、`public/data/outputs.js` にあるPortfolio WebsiteのデモURLも更新します。

GitHubへのpushだけではXServerには反映されません。
最初は手動でアップロードし、必要になったら自動転送を追加します。

[XServer公式: 公開ファイルのアップロード先](https://www.xserver.ne.jp/support/faq/service_ftp_setting_upload.php)

## Formspreeフォームの有効化

[お問い合わせフォームの設定手順](contact-form.md) に沿って、Formspreeのアカウントとフォームを作成し、
`public/contact/config.js` に公開用の送信先URLを設定します。
PHPファイル、メールのSMTPパスワード、サーバー側の設定ファイルは不要です。
GitHub PagesとXServerの両方で利用できます。

フォーム更新用ZIPは `python3 scripts/package-xserver.py` で作成できます。
ZIP内の `public_html/` の中身を、サーバーの `kentashiki.com/public_html/` に上書きします。
以前のPHP処理は上書きだけでは消えないので、設定手順にある削除対象も確認してください。
