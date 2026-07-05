import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import { exec } from "node:child_process";

/**
 * Each button sends a keyboard shortcut directly to Lightroom via AppleScript.
 * No companion plugin needed. No TCP bridge. Just keystrokes.
 */

interface Hotkey {
  /** Character to keystroke (for regular keys) */
  key?: string;
  /** macOS virtual keycode (for special keys like arrows) */
  keyCode?: number;
  cmd?: boolean;
  shift?: boolean;
}

const HOTKEYS: Record<string, Hotkey> = {
  // Color labels — Lightroom defaults: 6=Red, 7=Yellow, 8=Green, 9=Blue
  "com.woodseedigi.lightroom.mystory.red":    { key: "6" },
  "com.woodseedigi.lightroom.mystory.yellow":  { key: "7" },
  "com.woodseedigi.lightroom.mystory.green":   { key: "8" },
  "com.woodseedigi.lightroom.mystory.blue":    { key: "9" },
  // Purple + Clear need custom shortcuts set in Lightroom → Keyboard Shortcuts
  "com.woodseedigi.lightroom.mystory.purple":  { key: "0", cmd: true },       // Set to Cmd+0 in LR
  "com.woodseedigi.lightroom.mystory.clear":   { key: "0", cmd: true, shift: true }, // Set to Cmd+Shift+0 in LR

  // Star ratings — Lightroom defaults: 0-5
  "com.woodseedigi.lightroom.mystory.stars5":  { key: "5" },
  "com.woodseedigi.lightroom.mystory.stars4":  { key: "4" },
  "com.woodseedigi.lightroom.mystory.stars3":  { key: "3" },
  "com.woodseedigi.lightroom.mystory.stars2":  { key: "2" },
  "com.woodseedigi.lightroom.mystory.stars1":  { key: "1" },
  "com.woodseedigi.lightroom.mystory.stars0":  { key: "0" },

  // Navigation — arrow keys
  "com.woodseedigi.lightroom.mystory.prev":    { keyCode: 123 },  // Left arrow
  "com.woodseedigi.lightroom.mystory.next":    { keyCode: 124 },  // Right arrow

  // Zoom
  "com.woodseedigi.lightroom.mystory.zoom":    { key: "z" },
};

function sendHotkey(hk: Hotkey) {
  const mods: string[] = [];
  if (hk.cmd) mods.push("command down");
  if (hk.shift) mods.push("shift down");
  const modStr = mods.length ? `, ${mods.join(" and ")}` : "";

  let script: string;
  if (hk.keyCode !== undefined) {
    script = `tell application "System Events" to key code ${hk.keyCode}${modStr}`;
  } else if (hk.key) {
    script = `tell application "System Events" to keystroke "${hk.key}"${modStr}`;
  } else {
    return;
  }

  exec(`osascript -e ${JSON.stringify(script)}`, (err) => {
    if (err) console.error(`hotkey failed: ${err.message}`);
  });
}

function makeTagAction(uuid: string) {
  @action({ UUID: uuid })
  class Tag extends SingletonAction {
    override async onKeyDown(ev: KeyDownEvent<Record<string, never>>): Promise<void> {
      const hk = HOTKEYS[uuid];
      if (hk) sendHotkey(hk);
    }
  }
  return new Tag();
}

export const tagActions = Object.keys(HOTKEYS).map(makeTagAction);
