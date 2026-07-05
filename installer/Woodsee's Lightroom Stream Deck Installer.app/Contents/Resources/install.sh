#!/bin/bash
# Woodsee's Lightroom Stream Deck — Installer
# Installs the Stream Deck plugin. No Lightroom companion needed.

set -e

PLUGIN_NAME="com.woodseedigi.lightroom.mystory.sdPlugin"
SD_PLUGINS_DIR="$HOME/Library/Application Support/com.elgato.StreamDeck/Plugins"

# Resolve source directory (where this script lives)
SRC_DIR="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║   Woodsee's Lightroom Stream Deck Installer  ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# ── Step 1: Stream Deck plugin ──────────────────────────────
echo "▶ Step 1/2: Installing Stream Deck plugin..."
mkdir -p "$SD_PLUGINS_DIR"

if [[ -d "$SD_PLUGINS_DIR/$PLUGIN_NAME" ]]; then
  echo "  ↳ Previous installation found — removing..."
  rm -rf "$SD_PLUGINS_DIR/$PLUGIN_NAME"
fi

cp -R "$SRC_DIR/$PLUGIN_NAME" "$SD_PLUGINS_DIR/"
echo "  ✓ Installed to: $SD_PLUGINS_DIR/$PLUGIN_NAME"
echo ""

# ── Step 2: Restart Stream Deck ─────────────────────────────
echo "▶ Step 2/2: Restarting Stream Deck..."
if pgrep -x "Stream Deck" > /dev/null 2>&1; then
  osascript -e 'quit app "Stream Deck"' 2>/dev/null || true
  sleep 2
fi
open -a "Stream Deck" 2>/dev/null || echo "  ↳ Please open Stream Deck manually."
echo "  ✓ Stream Deck restarted"
echo ""

# ── Done ────────────────────────────────────────────────────
echo "════════════════════════════════════════════════"
echo "✓ Installation complete!"
echo ""
echo "  Stream Deck:  Drag actions from 'Lightroom Classic'"
echo "  Lightroom:    No plugin needed — buttons send"
echo "                keyboard shortcuts directly."
echo ""
echo "  Purple + Clear Label need custom shortcuts:"
echo "    Lightroom → Keyboard Shortcuts"
echo "    Purple: Cmd+0"
echo "    Clear:  Cmd+Shift+0"
echo "════════════════════════════════════════════════"
echo ""
read -p "Press Enter to exit..."
