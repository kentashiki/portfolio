# Kenta Shiki — Portfolio

HTML・CSS・JavaScriptで構成した日本語・英語のポートフォリオです。
ビルドやパッケージのインストールは不要です。

## ファイル構成

```text
portfolio/
├── public/                公開するファイル
│   ├── index.html         英語ホーム
│   ├── ja/                日本語ページ
│   ├── about/             About
│   ├── work/              Work一覧・プロジェクト詳細
│   ├── news/              News
│   ├── outputs/           Outputs
│   ├── awards/            Awards
│   ├── contact/           Contact
│   ├── projects/          旧URLからWorkへの転送
│   ├── assets/            CSS・JavaScript・画像・PDF・3Dモデル
│   └── data/              ページに表示するデータ
├── docs/                  データ構造・公開手順
├── notes/                 個人のメモ（Git管理対象外）
├── archive/               過去のサイト・元画像（公開対象外）
├── design-proposals/      デザイン案・検討用素材（公開対象外）
└── .github/workflows/     GitHub Pagesへの自動公開設定
```

**編集・公開するサイトは `public/` です。**
GitHub PagesとXServerの両方で、このフォルダの中身を公開します。
`public` という名前は公開URLには含まれません。

## ローカルで確認する

このREADMEがあるディレクトリで実行します。

```sh
python3 -m http.server 8000 --bind 127.0.0.1 --directory public
```

- 英語: <http://127.0.0.1:8000/>
- 日本語: <http://127.0.0.1:8000/ja/>

終了するときは、サーバーを起動したターミナルで `Ctrl+C` を押します。
JavaScriptでデータを読み込むため、HTMLのダブルクリックではなくHTTP経由で確認します。

## 内容を更新する

- ページ本文: `public/index.html`、`public/ja/`、各ページのHTML
- 研究・News・成果・受賞: `public/data/` と日本語用の `public/data/ja/`
- 共通の見た目: `public/assets/css/`
- ヘッダー・フッター: `public/assets/js/site-shell.js`
- 画像・資料: `public/assets/images/`、`public/assets/documents/`

データ構造の説明は [docs/README.md](docs/README.md) を参照してください。
データ中の `assets/...` などのURLは `public/` を公開したサイトの起点からのパスです。
URLの文字列へ `public/` を付け足す必要はありません。

## 公開する

手順は [docs/deployment.md](docs/deployment.md) にまとめています。

- **GitHub Pages:** `main` の `public/` を更新してpushすると自動公開します。
- **XServer:** `public/` の中身を、対象ドメインの `public_html/` 直下へ配置します。

`docs/`、`notes/`、`archive/`、デザイン案、作業記録はアップロードしません。
公開フォルダの外に置くことと、GitHubのリポジトリ内で非公開になることは別です。
個人用メモと秘密情報はGitに追加せず、SMTP認証情報はサーバー側で管理します。

Contactフォームは現在「準備中」で、送信処理はありません。
PHPによる送信処理はXServer向けに別途実装します。

## デザイン案・確認記録

デザイン案と過去ページも見る場合は、開発用にリポジトリ全体をローカル配信します。

```sh
python3 -m http.server 8001 --bind 127.0.0.1 --directory .
```

例: <http://127.0.0.1:8001/design-proposals/2026-10-17/about-photo-ideas/>
この配信方法は、手元で資料を確認するときにだけ使用します。

スクリーンショットやブラウザーの確認ログは、サイトと区別するため、
リポジトリ外の `../portfolio-checks/` などへ保存します。
2026年10月18日までの旧 `output/` は `../portfolio-checks/2026-10-18/` へ移動しました。
これらの記録はサイトの動作にもアップロードにも不要です。
