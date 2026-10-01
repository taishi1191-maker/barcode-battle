# Barcode Battle v1.7.1 Display Hotfix

Fixes the blank BOX / Dex / Adventure / Battle screens introduced in v1.7.

Restored:
- visualGenes()
- visualGeneLabel()
- displayName()
- shortMonsterId()
- monsterCardMeta()
- renameMonster()

The v1.7 storage key is intentionally kept, so the existing save data should continue to be used.

Upload/overwrite these four files at the repository root:
- index.html
- sw.js
- manifest.webmanifest
- README.md

Do not delete the assets folder.
