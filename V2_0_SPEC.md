# Barcode Battle v2.0 改修指示書
## テーマ
Landscape Battle & Art Library Update

## 1. 目的
v2.0では戦闘画面を縦スクロール型から「横向き専用の2D演出バトルUI」へ刷新する。
召喚・BOX・図鑑・冒険・∞ダンジョンは縦向きのまま、戦闘開始時のみ横向きUIへ切り替える。

## 2. 重要方針
- 戦闘ロジックは既存のAI自動戦闘を維持
- COM / 冒険 / ∞ダンジョンは同じBattle Sceneを使う
- BOX / 召喚 / 図鑑 / 戦闘で同じ個体は必ず同じ画像を使う
- 画像は透過PNGの高解像度立ち絵を前提
- v1.9までの保存データを壊さない
- iPhoneでの操作性を優先

## 3. 画面構成
### 縦向きの通常画面
- 召喚
- BOX
- 図鑑
- 冒険
- バトル
- ∞ダンジョン

### 横向きの戦闘画面
左側:
- 味方大型立ち絵
- 名前 / Lv / 属性
- HPバー
- 状態異常
- 装備アイコン

右側:
- 敵大型立ち絵
- 名前 / Lv / 属性
- HPバー
- 状態異常
- BOSS表示

上部:
- WAVE
- ステージ名
- 階層
- 残り敵数
- PAUSE

下部:
- 通常攻撃
- スキル
- アイテム
- AUTO
- ×1 / ×2 / ×3
- バトルログ開閉

## 4. Battle Scene共通化
新規モジュール:
- js/battle-scene.js
- js/battle-engine.js
- js/battle-fx.js

主要関数:
- openBattleScene(mode, payload)
- closeBattleScene()
- renderBattleScene()
- updateBattleHUD()
- playAttackAnimation()
- playDamagePopup()
- playStatusEffect()
- setBattleBackground()
- finishBattle()

mode:
- com
- adventure
- dungeon

## 5. バトル進行
- バトルスタート後はAI自動進行
- ×1 = 演出重視
- ×2 = 標準
- ×3 = 高速
- AUTOは基本ON
- 状態異常・会心・回避・吸収を画面に表示

## 6. 戦闘演出
- 通常攻撃: 前進 + 斬撃
- 炎: fire
- 毒: poison
- 雷: lightning
- 氷: ice
- 回復: heal
- 会心: CRIT!
- 回避: MISS
- 吸収: +HP
- 被弾: キャラ揺れ + 画面シェイク

## 7. 画像管理
新規 art-manifest.json で個体の画像ルールを一元化する。

優先順位:
1. mythic
2. legendary
3. rare
4. normal

通常個体:
- barcode seedから立ち絵差分を固定

レア個体:
- 専用画像

legendary:
- ★5 + SS

mythic:
- ★5 + SS + mythic条件

## 8. 図鑑 / Art Library
図鑑内に新しい表示モードを追加:
- 種族一覧
- 属性一覧
- normal
- rare
- legendary
- mythic

各キャラ画像をカードで見られるようにする。

## 9. 冒険
v2.0では完全マップ化はせず、既存ステージ選択を改善。
ステージカードに:
- 背景サムネイル
- 推奨Lv
- 敵属性
- ★ミッション
- 初回報酬
- 宝箱
- BOSS表示

## 10. ∞ダンジョン
戦闘は完全に新Battle Sceneへ統一。
- 10階ごとにBOSS
- BOSS専用背景
- BOSS専用立ち絵
- 報酬倍率UP
- 勝利後は
  - 次の階へ
  - 強化ショップへ
  - 撤退
  の3ボタン

## 11. 横画面対応
CSS:
@media (orientation: landscape)

戦闘画面は横向き専用レイアウト。
通常画面は縦向きのまま。

## 12. Safe Area
必須:
env(safe-area-inset-top)
env(safe-area-inset-bottom)
env(safe-area-inset-left)
env(safe-area-inset-right)

## 13. 保存データ
v1.9のlocalStorageを読み込む移行処理を追加。
保存対象:
- モンスター
- ニックネーム
- 個体値
- Lv / EXP
- 特殊能力
- 装備
- ゴールド
- 育成EXP
- 図鑑
- 冒険進行
- ∞ダンジョン記録

## 14. v2.0で触らないもの
- PvPオンライン
- Supabase
- 能力入れ替え
- Live2D
- 3D

## 15. 完成条件
- COM / 冒険 / ∞が同じ横向き戦闘UI
- BOXと戦闘で画像一致
- HP/文字の被りなし
- エフェクトが見える速度
- 強化ショップに確実に到達可能
- iPhone横向きで操作しやすい
- v1.9のセーブ引継ぎ
