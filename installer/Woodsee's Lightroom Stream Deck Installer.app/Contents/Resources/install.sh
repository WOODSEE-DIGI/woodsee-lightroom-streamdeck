#!/bin/bash
# Woodsee's Lightroom Stream Deck — Installer
# Installs both the Stream Deck plugin and Lightroom companion.

set -e

PLUGIN_NAME="com.woodseedigi.lightroom.mystory.sdPlugin"
LR_PLUGIN_NAME="com.woodseedigi.lightroom-mystory.lrplugin"
SD_PLUGINS_DIR="$HOME/Library/Application Support/com.elgato.StreamDeck/Plugins"
LR_MODULES_DIR="$HOME/Library/Application Support/Adobe/Lightroom/Modules"

# Resolve source directory (where this script lives)
SRC_DIR="$(cd "$(dirname "$0")" && pwd)"

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║   Woodsee's Lightroom Stream Deck Installer  ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# ── Step 1: Stream Deck plugin ──────────────────────────────
echo "▶ Step 1/3: Installing Stream Deck plugin..."
mkdir -p "$SD_PLUGINS_DIR"

if [[ -d "$SD_PLUGINS_DIR/$PLUGIN_NAME" ]]; then
  echo "  ↳ Previous installation found — removing..."
  rm -rf "$SD_PLUGINS_DIR/$PLUGIN_NAME"
fi

cp -R "$SRC_DIR/$PLUGIN_NAME" "$SD_PLUGINS_DIR/"
echo "  ✓ Installed to: $SD_PLUGINS_DIR/$PLUGIN_NAME"
echo ""

# ── Step 2: Lightroom companion ─────────────────────────────
echo "▶ Step 2/3: Installing Lightroom companion..."
mkdir -p "$LR_MODULES_DIR"

if [[ -d "$LR_MODULES_DIR/$LR_PLUGIN_NAME" ]]; then
  echo "  ↳ Previous installation found — removing..."
  rm -rf "$LR_MODULES_DIR/$LR_PLUGIN_NAME"
fi

cp -R "$SRC_DIR/$LR_PLUGIN_NAME" "$LR_MODULES_DIR/"
echo "  ✓ Installed to: $LR_MODULES_DIR/$LR_PLUGIN_NAME"
echo ""

# ── Step 3: Restart Stream Deck ─────────────────────────────
echo "▶ Step 3/3: Restarting Stream Deck..."
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
echo "  Lightroom:    Restart Lightroom if it was open"
echo "                Check Plug-in Manager for green dot"
echo "════════════════════════════════════════════════"
echo ""
read -p "Press Enter to exit..."
