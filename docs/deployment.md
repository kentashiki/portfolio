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

初回アップロード後は、日英ページ、画像、PDF、言語切り替え、
スマートフォンのメニュー、HTTPSの表示と転送を確認します。
ドメインが決まったら、`public/data/outputs.js` にあるPortfolio WebsiteのデモURLも更新します。

GitHubへのpushだけではXServerには反映されません。
更新時は `public/` の中身を `public_html/` に上書きします。

CSSやJavaScriptを変更した場合は、アップロード前に読み込み元のURLの `?v=` を新しい値に更新します。
ニュース更新時は日英の `news.js` を参照する `import` からたどり、変更したモジュールを読み込む `import` とHTMLの `src` も順に更新します。
変更したファイルと読み込み元を同じ更新でアップロードします。

サイト全体の更新用ZIPは、次のコマンドで一時フォルダに作成できます。

```sh
python3 scripts/package-xserver.py --full-site
```

出力されたZIP内の `public_html/` の中身を、サーバーの同名フォルダへ上書きします。
上書きでは古いファイルが残るため、[公開ファイルの整理記録](asset-cleanup.md) の削除対象も確認してください。

[XServer公式: 公開ファイルのアップロード先](https://www.xserver.ne.jp/support/faq/service_ftp_setting_upload.php)

## Google Analyticsの無効化

更新後のページはGoogle Analyticsを読み込まず、同意バナーとフッターの設定ボタンも表示しません。
反映するには、更新した `public/` の中身を通常の手順で再公開してください。Google Analyticsの管理画面やサーバー設定の変更は不要です。

XServerで上書きした場合、以前にアップロードした次のファイルは任意で整理できます。更新後のページからは参照されません。

- `public_html/assets/css/analytics.css`
- `public_html/assets/js/analytics-config.js`
- `public_html/assets/js/analytics.js`

## Contact欄の更新

[Contact欄の更新](contact.md) に、日英トップページへの統合を反映する手順と、旧Contactページのファイル整理をまとめています。
