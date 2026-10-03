# v4.6.3 Art Reference Hard Fix

- 新規アートパック `assets/monsters/v463/` を追加し、旧v45キャッシュと完全分離。
- 各モンスターに `artRef` (pack/key/idx/tier) を保存し、名前や画面ごとの再判定に依存しない参照方式へ変更。
- 既存セーブのモンスター/図鑑を起動時に自動移行。
- 図鑑で rarity を強制★1にして別画像へ飛んでいた処理を修正。
- 画像エラー時は同系統Mythic→同系統1番→beast_8→内蔵SVGの順で必ず表示。
- URLは document.baseURI 基準 + v=4630 で固定。
- Service Workerをv463へ更新。
