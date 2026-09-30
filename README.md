# Barcode Battle v0.3

## v0.3の変更点
- かわいい系モンスターデザインへ刷新
- 種族ごとにシルエットを変更
  - スライム
  - ドラゴン
  - ビースト
  - バード
  - ゴースト
  - マシン
  - ナイト
- 属性ごとに配色変更
- ★4以上はキラキラ演出
- 召喚アニメーション追加
- html5-qrcodeを使ったスマホ向けカメラ読取
- 背面カメラ優先
- スキャン枠表示
- バトル時のダメージ揺れ演出

## GitHub更新方法
既存の barcode-battle リポジトリで以下を上書きしてください。
- index.html
- manifest.webmanifest
- sw.js
- README.md（任意）

Commit changes後、GitHub Pagesが自動更新されます。

## iPhoneで古い画面が残る場合
PWA/Service Workerのキャッシュが残る場合があります。
Safariでページを再読み込みするか、ホーム画面版を一度閉じて開き直してください。
改善しない場合はSafariのWebサイトデータ削除が必要なことがあります。

## 注意
カメラ読取は外部ライブラリ html5-qrcode をCDNから読み込みます。
初回起動時はインターネット接続が必要です。
