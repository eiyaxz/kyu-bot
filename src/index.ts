import { Client, LocalAuth, Events } from "whatsapp-web.js";
import * as qrcode from "qrcode-terminal";

import handleMessageCreate from "./messages";
import { system } from "../lang.json";

const client = new Client({
    authStrategy: new LocalAuth({ clientId: "kyu-bot", dataPath: ".wwebjs_data" }),
    puppeteer: {
        headless: true,
        args: ["--no-sandbox"],
    }
});

client.on(Events.QR_RECEIVED, (qr) => qrcode.generate(qr, { small: true }));
client.on(Events.AUTHENTICATED, () => console.log(system.authenticated));

client.on(Events.MESSAGE_CREATE, (message) => 
    handleMessageCreate(client, message));

client.initialize();