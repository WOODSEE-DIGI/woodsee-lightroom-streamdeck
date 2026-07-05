import streamDeck from "@elgato/streamdeck";
import { bridge } from "./bridge.js";
import { tagActions } from "./actions/tagAction.js";

for (const act of tagActions) {
  streamDeck.actions.registerAction(act);
}

bridge.connect();
streamDeck.connect();
