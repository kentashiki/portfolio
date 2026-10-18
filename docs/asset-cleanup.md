# 公開ファイルの整理（2026年10月18日）

## Aboutのアバター

日英のAboutページを、写真と紹介文の構成に変更しました。
3DアバターのHTML、専用JavaScript、専用CSSを削除し、外部の3Dビューアーも読み込まなくなりました。

元データは `archive/assets/models/avatar/kenta-shiki.vrm` に移動しています。
移動前後のSHA-256が一致していることを確認しました。`archive/` は公開対象外です。
ただし、公開リポジトリ内のファイルはGitHub上では閲覧できます。
公開ファイルの合計容量は約32.2MBから約27.3MBになりました（約4.9MB削減）。

## サイト全体の参照確認

日英のHTML、CSS、JavaScriptのimport、データ経由の画像・資料リンクを確認しました。
アバター用ファイル以外に、削除できる未参照の公開用ファイルは見つかりませんでした。
公開フォルダ内の `.DS_Store` と、不要になっていた空フォルダも削除しました。

日英21ページをPC・スマートフォン幅で確認し、Aboutは320〜1920pxの6段階で確認しました。
表示崩れ、ローカルファイルの読み込みエラー、旧URLの転送に問題はありませんでした。

次のファイルは用途があるため残しています。

- `public/assets/images/brand/portrait-icon.png`: SNS等で使う512pxのアイコン原本。ページからの直接参照はありません。
- `public/assets/images/project_*.png`、News画像、PDF: JavaScriptのデータから参照しています。
- `public/assets/js/utils/output-date.js`: 日付の表示を省略したページでも、項目の並び替えに使います。
- `public/projects/`、`public/about/history.html`: 以前のURLでアクセスするためのページです。
- `notes/`、`archive/`、`design-proposals/`: メモ・元データ・デザイン案。公開対象外のまま保存しています。

## XServer上で削除するもの

更新した `public/` の中身を上書きした後、次を削除してください。
上書きアップロードだけでは古いファイルは消えません。

```text
kentashiki.com/public_html/assets/models/avatar/
kentashiki.com/public_html/assets/js/avatar-viewer.js
```

`assets/models/` が空になった場合は、そのフォルダも削除できます。
`.DS_Store` がサーバー上にある場合も削除して構いません。
古いPHP関連ファイルについては [お問い合わせフォームの設定手順](contact-form.md) を参照してください。
