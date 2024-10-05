import { Client, Message, MessageMedia } from "whatsapp-web.js";
import { format } from "util";
import sharp from "sharp";

import { system, messages } from "../lang.json";
import { stretchImageKeywords, commands, stickerName, stickerAuthor } from "../config.json";

export default async function handleMessageCreate(client: Client, message: Message) {
    if (message.fromMe) return;

    const chat = await message.getChat();
    const messages = await chat.fetchMessages({ fromMe: true });

    if (messages.length == 0) {
        await client.sendMessage(message.from, system.welcomeMessage.join("\n"));
    }

    switch (message.type) {
        case "image":
            await handleImageMessage(message);
            break;
        case "video":
            await handleVideoMessage(message);
            break;
        case "chat":
            await handleChatMessage(message);
            break;
        default:
            break;
    }
}

async function handleImageMessage(message: Message) {
    try {
        await message.react("🕙");

        let media = await message.downloadMedia();

        if (stretchImageKeywords.some(keyword => message.body.toLowerCase().includes(keyword.toLowerCase()))) {
            const imageBuffer = Buffer.from(media.data, "base64");
            const resizedImageBuffer = await sharp(imageBuffer)
                .resize(512, 512, { fit: "fill" })
                .toBuffer();
            const resizedImage = resizedImageBuffer.toString("base64");

            media = new MessageMedia(media.mimetype, resizedImage, media.filename);
        }   
        
        await message.reply(media, undefined, {
            sendMediaAsSticker: true,
            stickerName,
            stickerAuthor
        });
        await message.react("✅");

        console.log(format(system.createdStickerLog, message.from));
    } catch (error) {
        await message.react("⛔");

        console.error(format(system.errorStickerLog, message.from), );
    }
}

async function handleVideoMessage(message: Message) {
    await message.reply(messages.videoUnsupported);
    await message.react("⛔");
}

async function handleChatMessage(message: Message) {
    switch (message.body.toLowerCase()) {
        case commands.helpCommand.toLowerCase():
            await message.reply(messages.help.join("\n"));

            break;
        case commands.aboutCommand.toLowerCase():
            await message.reply(messages.about.join("\n"));

            break;
        default:
            if (message.body.startsWith("/")) {
                await message.reply(messages.unknownCommand);
            }

            break;
    }
}