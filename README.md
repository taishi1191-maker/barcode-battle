# Barcode Battle v1.8.1 — Battle UI Hotfix

## Fixed
- BOX / summon / COM battle / Adventure / Infinite Dungeon now use the SAME monster art source.
- Battles use the existing high-resolution 1254px base monster assets instead of the low-resolution cropped rare sheet art.
- Legendary/Mythic are shown with special glow/frame while keeping the high-resolution source image.
- Fixed HUD, HP bar and character overlap on iPhone.
- Moved enemy HUD below the stage label and kept player HUD at the bottom edge.
- Removed the sticky speed-control bar that could cover lower content.
- Fixed malformed duplicate Infinite Dungeon battle-log markup.
- Fixed duplicate `dungeonLog` ID.
- Added extra bottom space so the Infinite Dungeon upgrade shop can be reached above the fixed navigation.
- Added a `強化ショップへ` jump button.
- Infinite Dungeon portrait DOM is no longer recreated every battle tick, reducing flicker and unnecessary image reloads.
- Switching tabs returns to the top, preventing headings from opening under the iPhone status bar.

## Important
The storage key remains `barcodeBattle_v18`.
Existing v1.8 save data is reused.

## GitHub
Overwrite only:
- index.html
- sw.js
- manifest.webmanifest
- README.md

Keep the existing assets folder unchanged.
