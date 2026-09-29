# Barcode Battle v0.2

## 追加機能
- キャラクター画像（バーコード由来の自動生成イラスト）
- BOX保存（ブラウザ内保存）
- キャラ図鑑
- レベル・経験値・育成
- 通常攻撃 / 特殊攻撃 / 防御
- 特殊能力8種
- 勝利EXP / レベルアップ
- PWA対応

## GitHub Pagesへ導入
1. GitHubで `barcode-battle` リポジトリを作成
2. `index.html` `manifest.webmanifest` `sw.js` をアップロード
3. Settings → Pages
4. Source: Deploy from a branch
5. Branch: main / root
6. Save

## 更新方法
次のバージョンができたら GitHub 上の `index.html` `manifest.webmanifest` `sw.js` を新しいものへ置き換えて Commit changes するだけです。

## 保存について
現時点では localStorage を使うため、データはそのブラウザ・端末内に保存されます。ブラウザデータ削除や端末変更では消える可能性があります。
