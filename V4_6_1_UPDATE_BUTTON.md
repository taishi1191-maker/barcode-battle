# Barcode Battle v4.6.1 Update Button

ホーム画面追加(PWA)で古いバージョンが残る場合の対策を追加。

- 画面右上に「🔄 更新」ボタン
- Service Workerの更新確認
- Cache Storage削除
- index.html / sw.js を no-store 取得
- キャッシュバスター付きで自動再読み込み
- localStorageのセーブデータは削除しない

GitHub Pagesへ新しいパッチを反映したあと、ホーム画面のアプリを開いて
右上の「🔄 更新」を1回押せば最新版を取り直します。
