import streamDeck from "@elgato/streamdeck";
import { tagActions } from "./actions/tagAction.js";
for (const act of tagActions) {
    streamDeck.actions.registerAction(act);
}
streamDeck.connect();
//# sourceMappingURL=plugin.js.map