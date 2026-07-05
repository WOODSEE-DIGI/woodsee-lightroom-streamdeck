var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
import { action, SingletonAction } from "@elgato/streamdeck";
import { exec } from "node:child_process";
const HOTKEYS = {
    // Color labels — Lightroom defaults: 6=Red, 7=Yellow, 8=Green, 9=Blue
    "com.woodseedigi.lightroom.mystory.red": { key: "6" },
    "com.woodseedigi.lightroom.mystory.yellow": { key: "7" },
    "com.woodseedigi.lightroom.mystory.green": { key: "8" },
    "com.woodseedigi.lightroom.mystory.blue": { key: "9" },
    // Purple + Clear need custom shortcuts set in Lightroom → Keyboard Shortcuts
    "com.woodseedigi.lightroom.mystory.purple": { key: "0", cmd: true }, // Set to Cmd+0 in LR
    "com.woodseedigi.lightroom.mystory.clear": { key: "0", cmd: true, shift: true }, // Set to Cmd+Shift+0 in LR
    // Star ratings — Lightroom defaults: 0-5
    "com.woodseedigi.lightroom.mystory.stars5": { key: "5" },
    "com.woodseedigi.lightroom.mystory.stars4": { key: "4" },
    "com.woodseedigi.lightroom.mystory.stars3": { key: "3" },
    "com.woodseedigi.lightroom.mystory.stars2": { key: "2" },
    "com.woodseedigi.lightroom.mystory.stars1": { key: "1" },
    "com.woodseedigi.lightroom.mystory.stars0": { key: "0" },
    // Navigation — arrow keys
    "com.woodseedigi.lightroom.mystory.prev": { keyCode: 123 }, // Left arrow
    "com.woodseedigi.lightroom.mystory.next": { keyCode: 124 }, // Right arrow
    // Zoom
    "com.woodseedigi.lightroom.mystory.zoom": { key: "z" },
};
function sendHotkey(hk) {
    const mods = [];
    if (hk.cmd)
        mods.push("command down");
    if (hk.shift)
        mods.push("shift down");
    const modStr = mods.length ? `, ${mods.join(" and ")}` : "";
    let script;
    if (hk.keyCode !== undefined) {
        script = `tell application "System Events" to key code ${hk.keyCode}${modStr}`;
    }
    else if (hk.key) {
        script = `tell application "System Events" to keystroke "${hk.key}"${modStr}`;
    }
    else {
        return;
    }
    exec(`osascript -e ${JSON.stringify(script)}`, (err) => {
        if (err)
            console.error(`hotkey failed: ${err.message}`);
    });
}
function makeTagAction(uuid) {
    let Tag = (() => {
        let _classDecorators = [action({ UUID: uuid })];
        let _classDescriptor;
        let _classExtraInitializers = [];
        let _classThis;
        let _classSuper = SingletonAction;
        var Tag = class extends _classSuper {
            static { _classThis = this; }
            static {
                const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
                __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
                Tag = _classThis = _classDescriptor.value;
                if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
                __runInitializers(_classThis, _classExtraInitializers);
            }
            async onKeyDown(ev) {
                const hk = HOTKEYS[uuid];
                if (hk)
                    sendHotkey(hk);
            }
        };
        return Tag = _classThis;
    })();
    return new Tag();
}
export const tagActions = Object.keys(HOTKEYS).map(makeTagAction);
//# sourceMappingURL=tagAction.js.map