# Kenta Shiki — 名前の表示とポートレートアイコン

2026年10月18日更新。

## 方針

- ヘッダーとフッターの `Kenta Shiki` は普通のテキスト表示です。
- アイコンは比較案H「線と面のポートレート」を採用しています。
- ご本人の顔写真を基に、濃紺の背景と明るい色で顔・髪・襟を描いた画像です。

## 使用ファイル

すべて `public/assets/images/brand/` 以下です。

| ファイル | 用途 |
| --- | --- |
| `portrait-icon.png` | SNSなどに使う512×512pxの画像 |
| `apple-touch-icon.png` | ホーム画面用アイコン、180×180px |
| `favicon-32.png` | ブラウザー用アイコン、32×32px |

採用したH案を、絵柄と縦横比を保って各サイズで書き出しています。
小さいアイコンに元の大きな画像を読み込む必要はありません。
画像生成方法は組み込みの `image_gen.imagegen` です。
参照写真は `public/assets/images/kentashiki-960.webp`。
元の比較案と最終生成プロンプトは `design-proposals/2026-10-18/icon-variations/` に保存しています。

## 公開

各ページのheadのPNGアイコン・ホーム画面用アイコンの参照を更新しています。
GitHub Pagesは `main` へのpushで更新されます。
XServerには別途、`public/` の中身を `kentashiki.com/public_html/` に上書きします。
アイコンの参照を更新した各ページのHTMLもアップロードしてください。

旧KSアイコンは公開フォルダから削除しました。XServerでも、次の旧ファイルを配置していた場合は削除できます。

- `assets/images/favicon.ico`
- `assets/images/favicon.svg`
- `assets/images/brand/ks-icon.png`
- `assets/images/brand/ks-monogram.svg`

`assets/images/brand/apple-touch-icon.png` はH案で更新するため、上書きしてください。
既存ページ、元の顔写真、メモ、過去の検討用データは削除しません。
