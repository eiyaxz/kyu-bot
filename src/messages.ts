import { Client, Message, MessageMedia } from "whatsapp-web.js";
import { format } from "util";
import sharp from "sharp";

import { stretchImageKeywords, commands, stickerName, stickerAuthor } from "../config.json";
import { system, messages } from "../lang.json";

export default async function handleMessage(client: Client, message: Message) {
    const chat = await message.getChat();
    const messages = await chat.fetchMessages({ fromMe: true });

    if (messages.length == 0) {
        await client.sendMessage(message.from, system.welcomeMessage.join("\n"));
    }

    switch (message.type) {
        case "image":
            await handleStaticSticker(message);
            break;
        case "video":
            await handleAnimatedSticker(message);
            break;
        case "chat":
            await handleCommand(message);
            break;
        default:
            break;
    }
}

async function handleStaticSticker(message: Message) {
    await message.react("🕙");

    let media = await message.downloadMedia();

    if (stretchImageKeywords.some(keyword => message.body.toLowerCase().includes(keyword.toLowerCase()))) {
        const imageBuffer = Buffer.from(media.data, "base64");
        const resizedImageBuffer = await sharp(imageBuffer)
            .resize(512, 512, { fit: "fill" })
            .toBuffer();

        media = new MessageMedia(media.mimetype, resizedImageBuffer.toString("base64"));
    }
    
    await message.reply(media, undefined, {
        sendMediaAsSticker: true,
        stickerName,
        stickerAuthor
    }).then(() => message.react("✅")).catch(() => message.react("⛔"));

    console.log(format(system.createdStickerLog, message.from));
}

async function handleAnimatedSticker(message: Message) {
    await message.react("🕙");

    const downloadedMedia = await message.downloadMedia();
    await message.reply(downloadedMedia, undefined, {
        sendMediaAsSticker: true,
        stickerName,
        stickerAuthor
    }).then(() => message.react("✅")).catch(() => message.react("⛔"));

    console.log(format(system.createdStickerLog, message.from));
}

async function handleCommand(message: Message) {
    switch (message.body.toLowerCase()) {
        case commands.helpCommand.toLowerCase():
            await message.reply(messages.help.join("\n"));
            break;
        case commands.aboutCommand.toLowerCase():
            await message.reply(messages.about.join("\n"));
            break;
        default:
            if (!message.body.startsWith("/")) return;
            await message.reply(messages.unknownCommand);
            await message.react("⛔");
            return;
    }

    await message.react("✅");
}