import { Client, LocalAuth, Events } from "whatsapp-web.js";
import * as qrcode from "qrcode-terminal";
import { resolve } from "path";

import { authenticated, checkUnread } from "../config.json";
import handleMessage from "./sticker";
import handleUnread from "./unread";

const client = new Client({
    authStrategy: new LocalAuth({ clientId: "kyu-bot", dataPath: ".wwebjs_data" }),
    puppeteer: { args: ["--no-sandbox"] },
    ffmpegPath: resolve(__dirname, "..", "ffmpeg.exe"),
});

client.on(Events.QR_RECEIVED, (qr) => qrcode.generate(qr, { small: true }));
client.on(Events.AUTHENTICATED, () => console.log(authenticated));
client.on(Events.READY, () => { if (checkUnread) handleUnread(client) });
client.on(Events.MESSAGE_RECEIVED, (message) => handleMessage(message));

client.initialize();