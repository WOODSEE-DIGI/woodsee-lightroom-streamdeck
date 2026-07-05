import net from "node:net";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import streamDeck from "@elgato/streamdeck";

const LR_HOST = "127.0.0.1";
const CMD_PORT = 9876;
const STATE_PORT = 9877;

const LR_PLUGIN_NAME = "com.woodseedigi.lightroom-mystory.lrplugin";
const LR_MODULES_DIR = path.join(os.homedir(), "Library", "Application Support", "Adobe", "Lightroom", "Modules");

export interface LRState {
  rating: number;
  flag: number;
  label: string;
  module: string;
}

class LightroomBridge {
  private recv?: net.Socket;
  private send?: net.Socket;
  public state: LRState = { rating: 0, flag: 0, label: "none", module: "library" };
  public connected = false;
  private recvBuffer = "";
  private sendBuffer = "";
  private installed = false;

  connect() {
    this.ensureLRLuginInstalled();

    // Commands -> Lightroom
    this.recv = net.createConnection({ host: LR_HOST, port: CMD_PORT }, () => {
      streamDeck.logger.info("Lightroom command socket connected");
      this.connected = true;
    });
    this.recv.on("error", (e) => {
      streamDeck.logger.warn(`recv error: ${e.message}`);
      this.connected = false;
    });
    this.recv.on("close", () => {
      this.connected = false;
      streamDeck.logger.info("recv closed, reconnecting in 2s...");
      setTimeout(() => this.connect(), 2000);
    });

    // State <- Lightroom
    this.send = net.createConnection({ host: LR_HOST, port: STATE_PORT }, () => {
      streamDeck.logger.info("Lightroom state socket connected");
    });
    this.send.on("data", (data) => {
      this.sendBuffer += data.toString();
      const lines = this.sendBuffer.split("\n");
      this.sendBuffer = lines.pop() ?? "";
      for (const line of lines) {
        if (line.trim()) this.handleLine(line);
      }
    });
    this.send.on("error", (e) => streamDeck.logger.warn(`send error: ${e.message}`));
    this.send.on("close", () => {
      streamDeck.logger.info("send closed, reconnecting in 2s...");
      setTimeout(() => {
        if (this.send) {
          try { this.send.destroy(); } catch {}
          this.send = undefined;
        }
        this.send = net.createConnection({ host: LR_HOST, port: STATE_PORT }, () => {
          streamDeck.logger.info("Lightroom state socket reconnected");
        });
        this.send.on("data", (data) => {
          this.sendBuffer += data.toString();
          const lines = this.sendBuffer.split("\n");
          this.sendBuffer = lines.pop() ?? "";
          for (const line of lines) {
            if (line.trim()) this.handleLine(line);
          }
        });
        this.send.on("error", (e) => streamDeck.logger.warn(`send error: ${e.message}`));
      }, 2000);
    });
  }

  sendCommand(cmd: string, value?: string | number) {
    const payload = JSON.stringify({ cmd, value }) + "\n";
    if (this.recv && this.connected) {
      this.recv.write(payload);
    } else {
      streamDeck.logger.warn("not connected to Lightroom, command dropped");
    }
  }

  private ensureLRLuginInstalled() {
    if (this.installed) return;

    const destPath = path.join(LR_MODULES_DIR, LR_PLUGIN_NAME);
    if (fs.existsSync(destPath)) {
      streamDeck.logger.info(`LR companion already installed at ${destPath}`);
      this.installed = true;
      return;
    }

    // Find bundled lrplugin relative to this file (bin/bridge.js -> ../lr-bundle/)
    const pluginDir = path.resolve(__dirname, "..", "lr-bundle", LR_PLUGIN_NAME);
    if (!fs.existsSync(pluginDir)) {
      streamDeck.logger.warn(`Bundled LR plugin not found at ${pluginDir} — user must install manually`);
      return;
    }

    try {
      fs.mkdirSync(LR_MODULES_DIR, { recursive: true });
      this.copyDirSync(pluginDir, destPath);
      streamDeck.logger.info(`Auto-installed LR companion to ${destPath} — restart Lightroom to activate`);
      this.installed = true;
    } catch (e) {
      streamDeck.logger.warn(`Failed to auto-install LR companion: ${e}`);
    }
  }

  private copyDirSync(src: string, dest: string) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        this.copyDirSync(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }

  private handleLine(line: string) {
    if (!line.startsWith("state|")) return;
    const parts = line.split("|");
    const next: LRState = { ...this.state };
    for (let i = 1; i < parts.length; i++) {
      const eq = parts[i].indexOf("=");
      if (eq === -1) continue;
      const k = parts[i].slice(0, eq);
      const v = parts[i].slice(eq + 1);
      if (k === "rating") next.rating = parseInt(v, 10) || 0;
      else if (k === "flag") next.flag = parseInt(v, 10) || 0;
      else if (k === "label") next.label = v;
      else if (k === "module") next.module = v;
    }
    this.state = next;
    streamDeck.logger.debug(`state: rating=${next.rating} label=${next.label} module=${next.module}`);
  }
}

export const bridge = new LightroomBridge();
