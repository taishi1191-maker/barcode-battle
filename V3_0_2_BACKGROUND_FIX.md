# Barcode Battle v3.0.2 Background Patch

## 変更内容
- バトル背景を旧 assets/backgrounds/* 参照から、新しい高解像度 `assets/backgrounds/v30/` 参照へ変更
- COMバトル、ストーリー、∞ダンジョンで v30 背景を使用
- Service Worker のキャッシュ名を更新し、新しい背景画像を事前キャッシュ

## 上書き対象
- index.html
- sw.js
- assets/backgrounds/v30/*
- 必要に応じて assets/backgrounds/premium/*, assets/backgrounds/vertical/*

## 推奨
- GitHubへアップ後、iPhone/Safari でキャッシュ削除 or ホーム画面アプリの再追加を推奨
