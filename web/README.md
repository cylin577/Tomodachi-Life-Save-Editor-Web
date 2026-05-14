# Web Port

Static browser build. No backend. No network calls. Save file stays on user device and is processed in memory with `File`/`Blob` APIs.

## Open

- Double-click `web/index.html`, or
- serve repo root with `python -m http.server` and open `/web/`

## Current Features

- load `savedataArc.txt`
- detect JP, KR, or prompt for EUR/USA
- edit save file settings
- edit island info
- repair Mii CRC/XMODEM for one slot or all 100 slots
- download edited save and original backup copy

## Notes

- Desktop app has many more editors. This web port is foundation + first migrated features.
- Invalid item/color combos can still corrupt save. Use same caution as desktop tool.
