# Woodsee's Lightroom Stream Deck

Stream Deck plugin for tagging and culling photos in Lightroom Classic.

Maps your tagging scheme directly to Stream Deck buttons — one press per action, no dropdowns needed.

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
- Lightroom Classic 11+ (SDK 11+)

## Install

### Option 1: Installer app (recommended)

1. Download `Woodsee's Lightroom Stream Deck Installer.app`
2. Double-click to run
3. Follow the 3-step prompt in Terminal
4. Restart Lightroom if it was open

### Option 2: Double-click `.streamDeckPlugin`

1. Double-click `Woodsee-Lightroom-StreamDeck.streamDeckPlugin`
2. Stream Deck installs the plugin automatically
3. The Lightroom companion is installed on first launch
4. Restart Lightroom to activate the companion

### Option 3: Development (symlink)

```bash
git clone https://github.com/WOODSEE-DIGI/woodsee-lightroom-streamdeck.git
cd woodsee-lightroom-streamdeck
npm install
npm run build

# Link into Stream Deck's plugin folder
ln -s "$(pwd)" ~/Library/Application\ Support/com.elgato.StreamDeck/Plugins/
```

Then restart Stream Deck.

## 15-key Stream Deck layout

```
┌─────────┬─────────┬─────────┬─────────┬─────────┐
│ 🔴 HOOK │ 🟡 RISE │ 🟢 CLMX │ 🔵 OUT  │ 🟣 TXTR │
├─────────┼─────────┼─────────┼─────────┼─────────┤
│ ★★★★★  │ ★★★★☆  │ ★★★☆☆  │ ★★☆☆☆  │ ★☆☆☆☆  │
│ESSENTIAL│ STRONG  │  USABLE │   CUT   │  REF    │
├─────────┼─────────┼─────────┼─────────┼─────────┤
│  ☆ 0★  │  ⊘ CLR  │  🔍 ZM  │  ◀ PREV │  ▶ NEXT │
└─────────┴─────────┴─────────┴─────────┴─────────┘
```

## How it works

```
Stream Deck App (TypeScript/Node)
    │
    ├── TCP :9876 (commands) ──▶  Lightroom Companion (Lua)
    │                                │
    │   TCP :9877 (state)   ◀──     │
    │                                │
    └── Updates key titles/icons     └── Executes SDK calls:
                                            LrSelection
                                            LrApplicationView
```

## Files

```
├── manifest.json              Stream Deck plugin manifest (15 actions)
├── src/
│   ├── plugin.ts              Entry point
│   ├── bridge.ts              TCP client + LR auto-installer
│   └── actions/
│       └── tagAction.ts       All 15 actions (factory pattern)
├── assets/key/                Key icon SVGs (72×72)
├── lr-bundle/
│   └── com.woodseedigi.lightroom-mystory.lrplugin/
│       ├── Info.lua           Lightroom plugin metadata
│       └── Init.lua           TCP server + command dispatcher
├── installer/                 macOS installer .app bundle
└── profiles/                  (Stream Deck profiles — coming soon)
```

## Troubleshooting

### Red plug icon won't go away
- Lightroom Classic must be running
- Restart Lightroom after installing the plugin
- On macOS, click **Allow** when prompted for incoming connections

### Buttons don't trigger anything
- Lightroom Classic must be the active window (clicked/focused)
- Check the Lightroom Plug-in Manager — companion should show green dot

### Plugin not visible in Stream Deck
- Restart the Stream Deck app
- Check the plugin is in `~/Library/Application Support/com.elgato.StreamDeck/Plugins/`

## License

MIT
