import streamDeck from "@elgato/streamdeck";
import { bridge } from "./bridge";
import { tagActions } from "./actions/tagAction";

for (const act of tagActions) {
  streamDeck.actions.registerAction(act);
}

bridge.connect();
streamDeck.connect();
