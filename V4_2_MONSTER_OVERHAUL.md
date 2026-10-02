# v4.2 Monster Overhaul Lite Patch

このZIPは**差分パッチ**です。
既存の Barcode Battle プロジェクト直下へ展開して、同名ファイルを上書きしてください。

## 内容
- モンスター8系統の新規フラッグシップアート
- `assets/monsters/v42/` を新設
- `data/art-manifest.json` / `data/art-manifest-v30.json` を v42 用に切替
- `sw.js` のキャッシュ更新
- 主要7系統の root アイコン差し替え

## 仕様
- 表示安定化を優先し、tierごとの参照先は同一アートへ集約
- まずは「可愛い寄り」から脱却し、迫力のある高級感路線へ一新
- 将来 v4.3 以降で tier 別差分を増やしやすい構成

## 反映後の推奨
- PWA を再読み込み
- 旧キャッシュが残る場合はホーム画面アプリを一度削除して再追加
