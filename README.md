# Woodsee's Lightroom Stream Deck

Stream Deck plugin for tagging and culling photos in Lightroom Classic.

One press per action. No dropdowns. No companion plugin.

## How it works

Each button sends a keyboard shortcut directly to Lightroom via AppleScript. No TCP bridge, no Lua companion, no extra install — just keystrokes.

| Button | Shortcut | Lightroom Action |
|--------|----------|-----------------|
| 🔴 Red | `6` | Set Red label |
| 🟡 Yellow | `7` | Set Yellow label |
| 🟢 Green | `8` | Set Green label |
| 🔵 Blue | `9` | Set Blue label |
| 🟣 Purple | `Cmd+0` | Set Purple label * |
| ⊘ Clear Label | `Cmd+Shift+0` | Remove color label * |
| ★★★★★ | `5` | Rate 5 stars — Essential |
| ★★★★☆ | `4` | Rate 4 stars — Strong |
| ★★★☆☆ | `3` | Rate 3 stars — Usable |
| ★★☆☆☆ | `2` | Rate 2 stars — Probably Cut |
| ★☆☆☆☆ | `1` | Rate 1 star — Reference / Exclude |
| ☆ Unrated | `0` | Clear rating |
| ◀ Prev | `←` | Previous photo |
| ▶ Next | `→` | Next photo |
| 🔍 Zoom | `Z` | Toggle zoom (Fit / 1:1) |

\* Purple and Clear Label need custom shortcuts set once in Lightroom (see setup below).

## Setup

### Quick install (recommended)

1. Clone this repo
2. Double-click `installer/Woodsee's Lightroom Stream Deck Installer.app`
3. Follow the Terminal prompt — it copies the plugin and restarts Stream Deck

### Setup Purple and Clear Label shortcuts

In Lightroom Classic, go to **Keyboard Shortcuts** (menu bar) and assign:

| Command | Shortcut |
|---------|----------|
| Purple label (or "Set Color Label > Purple") | `Cmd+0` |
| Remove Color Label (or "Set Color Label > None") | `Cmd+Shift+0` |

These only need to be set once. All other shortcuts work with Lightroom defaults.

### Development install

```bash
git clone https://github.com/WOODSEE-DIGI/woodsee-lightroom-streamdeck.git
cd woodsee-lightroom-streamdeck
npm install
npm run build

ln -s "$(pwd)" ~/Library/Application\ Support/com.elgato.StreamDeck/Plugins/com.woodseedigi.lightroom.mystory.sdPlugin
```

Then restart Stream Deck.

## Layout (5×3 Stream Deck)

```
┌─────────┬─────────┬─────────┬─────────┬─────────┐
│ 🔴 RED  │ 🟡 YEL  │ 🟢 GRN  │ 🔵 BLU  │ 🟣 PUR  │
├─────────┼─────────┼─────────┼─────────┼─────────┤
│ ★★★★★  │ ★★★★☆  │ ★★★☆☆  │ ★★☆☆☆  │ ★☆☆☆☆  │
│ESSENTIAL│ STRONG  │  USABLE │   CUT   │  EXCLUDE│
├─────────┼─────────┼─────────┼─────────┼─────────┤
│ UNRATED │  CLEAR  │  ZOOM   │  ◀ PREV │  ▶ NEXT │
└─────────┴─────────┴─────────┴─────────┴─────────┘
```

## Tagging scheme

| Color Label | Narrative Role | Star Rating | Priority |
|-------------|---------------|-------------|----------|
| 🔴 Red | Opening / Hook | ★★★★★ 5 | Essential |
| 🟡 Yellow | Rising Action | ★★★★☆ 4 | Strong |
| 🟢 Green | Climax / Turning Point | ★★★☆☆ 3 | Usable |
| 🔵 Blue | Resolution / Outro | ★★☆☆☆ 2 | Probably Cut |
| 🟣 Purple | Texture / Detail | ★☆☆☆☆ 1 | Reference / Exclude |
| | | ☆☆☆☆☆ 0 | Unreviewed |

## Requirements

- macOS 13+
- Stream Deck 7.1+
- Lightroom Classic 11+

## Troubleshooting

### Buttons don't trigger anything
- Lightroom Classic must be the active window (clicked/focused)
- The plugin sends keystrokes to whatever app is in the foreground

### Plugin not visible in Stream Deck
- Restart the Stream Deck app
- Check it's in `~/Library/Application Support/com.elgato.StreamDeck/Plugins/`

### Purple / Clear buttons don't work
- Set the custom shortcuts in Lightroom → Keyboard Shortcuts (see setup above)

## License

MIT
