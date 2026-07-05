import { action, KeyDownEvent, SingletonAction } from "@elgato/streamdeck";
import { bridge } from "../bridge.js";

/** Map each action UUID to its Lightroom command + value. */
const COMMANDS: Record<string, { cmd: string; value?: string | number }> = {
  "com.woodseedigi.lightroom.mystory.red":    { cmd: "label", value: "red" },
  "com.woodseedigi.lightroom.mystory.yellow":  { cmd: "label", value: "yellow" },
  "com.woodseedigi.lightroom.mystory.green":   { cmd: "label", value: "green" },
  "com.woodseedigi.lightroom.mystory.blue":    { cmd: "label", value: "blue" },
  "com.woodseedigi.lightroom.mystory.purple":  { cmd: "label", value: "purple" },
  "com.woodseedigi.lightroom.mystory.clear":   { cmd: "label", value: "none" },
  "com.woodseedigi.lightroom.mystory.stars5":  { cmd: "rate", value: 5 },
  "com.woodseedigi.lightroom.mystory.stars4":  { cmd: "rate", value: 4 },
  "com.woodseedigi.lightroom.mystory.stars3":  { cmd: "rate", value: 3 },
  "com.woodseedigi.lightroom.mystory.stars2":  { cmd: "rate", value: 2 },
  "com.woodseedigi.lightroom.mystory.stars1":  { cmd: "rate", value: 1 },
  "com.woodseedigi.lightroom.mystory.stars0":  { cmd: "rate", value: 0 },
  "com.woodseedigi.lightroom.mystory.prev":    { cmd: "prev" },
  "com.woodseedigi.lightroom.mystory.next":    { cmd: "next" },
  "com.woodseedigi.lightroom.mystory.zoom":    { cmd: "togglezoom" },
};

/** One class per action UUID — each sends its fixed command. */
function makeTagAction(uuid: string) {
  @action({ UUID: uuid })
  class Tag extends SingletonAction {
    override async onKeyDown(ev: KeyDownEvent<Record<string, never>>): Promise<void> {
      const mapping = COMMANDS[uuid];
      if (mapping) bridge.sendCommand(mapping.cmd, mapping.value);
    }
  }
  return new Tag();
}

export const tagActions = Object.keys(COMMANDS).map(makeTagAction);
